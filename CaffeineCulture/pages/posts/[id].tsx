import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Card from 'react-bootstrap/Card';
import { useRouter } from 'next/router';
import { faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getSinglePost, deletePost } from '../../utils/data/postData';
import { getPostsComments } from '../../utils/data/commentData';
import CommentCard from '../../components/cards/CommentCard';
import { useAuth } from '../../utils/context/authContext.js';
import CommentForm from '../../components/CommentForm';
import Like from '../../components/Like';
import { PostData, CommentData } from '../../utils/interfaces';
import { s3, accessParams } from '../../utils/awss3';

export default function SinglePost() {
  const router = useRouter();

  const postId = router.query.id;
  const post: number = parseInt(postId as string, 10);

  const [postDetails, setPostDetails] = useState<PostData>({} as PostData);
  const [comments, setComments] = useState<CommentData[]>([]);
  const [editModeCommentId, setEditModeCommentId] = useState<number | null>(null);
  const [change, setChange] = useState<boolean>(false);

  const handleEditClick = (commentId: number) => {
    setEditModeCommentId(commentId);
  };

  const handleCancelEdit = () => {
    setEditModeCommentId(null);
  };

  const deleteThisPost = async () => {
    if (window.confirm('Delete post?')) {

      if (postDetails.image_url) {
        const url: string = postDetails.image_url;
        const [, fileKey]: string[] = url.split(".com/")

        const params = await accessParams(fileKey);

        try {
          await s3.deleteObject(params).promise();
        } catch (error) {
          console.warn(error)
          return alert(`Failed to delete file: ${error.message}`);
        }
      }

      await deletePost(postDetails.id);
      router.push('/');
    }
  };

  const { user } = useAuth();

  const getPostDetails = useCallback(async () => {
    try {
      const postDetailsRes = await getSinglePost(post, user.uid);
      setPostDetails(postDetailsRes as PostData);

      const commentsRes = await getPostsComments(post);
      setComments(commentsRes as CommentData[]);
    } catch (error) {
      console.error('Error fetching post details', error);
    }
  }, [post, user.uid])

  useEffect(() => {
    getPostDetails();
  }, [getPostDetails, change]);

  const timesArray = postDetails?.date?.split('T');

  return (
    <>
      <div>
        <Card className="single-post">
          <Card.Body>
            <h1>{postDetails.title}</h1>
            <span style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <Link passHref href={`/profile/${postDetails.user?.username}`}>
                <p className="username">{postDetails.user?.username}</p>
              </Link>
              <p>{postDetails.category?.name}</p>
              {timesArray
              && <p>{timesArray[0]}</p>}
            </span>
            <hr />
            <h2>{postDetails.content}</h2>
            {postDetails.image_url ? <img src={`${postDetails.image_url}`} style={{ maxWidth: "500px", maxHeight: "500px", overflow: "hidden"}}></img> : '' }
            <hr />
            <Like postId={postDetails.id} liked={postDetails.liked} likeCount={postDetails.like_count} />

            {/* Conditionally render edit and delete functionality if the user viewing this post is the author of this post */}
            {user.uid === postDetails.user?.uid ? (
              <span style={{ fontSize: '2em', marginRight: '10px' }}>
                <Link href={`/posts/edit/${postDetails.id}`} passHref>
                  <FontAwesomeIcon icon={faPenToSquare} className="fa-icon" style={{ marginRight: '10px' }} />
                </Link>
                <FontAwesomeIcon icon={faTrashCan} className="fa-icon" onClick={deleteThisPost} />
              </span>
            ) : ''}
          </Card.Body>
        </Card>

        {/* Render comment box for creating a comment */}
        <CommentForm getPostDetails={getPostDetails} postId={postDetails.id} />

        {/* Conditionally render either comment box for updating an existing comment, or the comment itself based upon editModeCommentId useState */}

        <div className="post-comments">
          {comments.map((comment) => (
            editModeCommentId === comment.id ? (
              <CommentForm key={comment.id} obj={comment} onCancelEdit={handleCancelEdit} getPostDetails={getPostDetails} postId={postDetails.id} />
            ) : (
              <CommentCard key={comment.id} commentObj={comment} onEditClick={() => handleEditClick(comment.id)} user={user} setChange={setChange} getPostDetails={getPostDetails} postId={postDetails.id} />
            )
          ))}
        </div>

      </div>
    </>
  );
}
