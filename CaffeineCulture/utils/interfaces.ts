export interface UserData {
  id: number;
  username: string;
  bio: string;
  join_date: string;
  uid: string;
}

export interface CommentData {
  id: number;
  user: UserData;
  post: PostData;
  content: string;
  date: string;
  parent: CommentData | null;
}

export interface PostData {
  id: number;
  title: string;
  content: string;
  date: string;
  like_count: number;
  category: CategoryData;
  user: UserData;
  comments: CommentData[]; 
  liked: boolean;
}

export interface CategoryData {
  id: number;
  name: string;
}

export interface MessageData {
  id: number;
  content: string;
  date: string;
  sender: number;
  receiver: number;
}

export interface NotificationData {
  id: number;
  is_read: boolean;
  user: UserData;
  message: MessageData;
}