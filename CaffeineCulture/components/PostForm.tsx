import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import { Button } from 'react-bootstrap';
import { useAuth } from '../utils/context/authContext';
import { createPost, updatePost } from '../utils/data/postData';
import getCategories from '../utils/data/categoryData';
import { CategoryData } from '../utils/interfaces';

interface initialState {
  title: string;
  content: string;
  category: number;
}

const initialState: initialState = {
  title: '',
  content: '',
  category: 0,
};

export interface Payload {
  id?: number;
  content: string;
  uid: string;
  like_count: number;
  category?: number;
}

function PostForm({ obj }) {
  const [formInput, setFormInput] = useState<initialState>(initialState);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const router = useRouter();

  const { user } = useAuth();

  useEffect(() => {
    const retrieveCategories = async () => {
      const res = await getCategories();
      setCategories(res as CategoryData[]);
    }
    retrieveCategories();
  }, []);

  useEffect(() => {
    if (obj?.id) {
      const editObj = obj;
      editObj.category = obj.category.id;
      setFormInput(editObj);
    }
  }, [obj]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormInput((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // eslint-disable-next-line consistent-return
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: Payload = { ...formInput, uid: user.uid, like_count: 0 };

    // Convert payload category string value to a number for correct typing

    payload.category = Number(payload.category);

    // // Return early with the alert statement to ensure user selects a category

    if (payload.category === 0) {
      return alert('Please select a category');
    }

    if (obj?.id) {
      await updatePost(payload)
      router.push(`/posts/${obj.id}`)
    } else {
      await createPost(payload)
      router.push('/');
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <h2 className="text-white mt-5">{obj?.id ? 'Update' : 'Create'} Post</h2>

      <FloatingLabel controlId="floatingInput1" label="Post Title" className="mb-3">
        <Form.Control
          type="text"
          placeholder="Enter a title"
          name="title"
          value={formInput.title}
          onChange={handleChange}
          required
        />
      </FloatingLabel>

      <FloatingLabel controlId="floatingInput2" label="Post Content" className="mb-3">
        <Form.Control
          as="textarea"
          style={{ height: '200px' }}
          placeholder="Enter content"
          name="content"
          value={formInput.content}
          onChange={handleChange}
          required
        />
      </FloatingLabel>

      <FloatingLabel label="Select Category" className="mt-5 mb-3">
        <Form.Select
          placeholder="Post Category"
          onChange={handleChange}
          name="category"
          value={formInput.category}
          required
        >
          <option key={0} value={0}>Select A Category</option>
          {categories?.map((category) => (
            (
              <option
                key={(category.id)}
                value={(category.id)}
              >
                {category.name}
              </option>
            )
          ))}
        </Form.Select>
      </FloatingLabel>

      <Button type="submit" variant="dark">{obj?.id ? 'Update' : 'Create'} Post</Button>
    </Form>
  );
}

export default PostForm;
