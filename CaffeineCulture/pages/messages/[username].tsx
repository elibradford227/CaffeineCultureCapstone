/* eslint-disable react/button-has-type */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../utils/context/authContext';
import { getUserByName } from '../../utils/auth';
import { getConversation } from '../../utils/data/messageData';
import MessageCard from '../../components/cards/MessageCard';
import MessageForm from '../../components/MessageForm';
import ConversationList from './list';
import { UserData, MessageData } from '../../utils/interfaces';

export default function Message() {
  const { user } = useAuth();
  const router = useRouter();

  const [chat, setChat] = useState<MessageData[]>([]);
  const [receiver, setReceiver] = useState<UserData>({} as UserData);

  const { username } = router.query as { username: string };

  const getUser = (name: string) => {
    getUserByName(name).then((res) => setReceiver(res));
  };

  useEffect(() => {
    getUser(username);
  }, [username]);

  const getChat = (uid: string) => {
    if (receiver.uid) {
      const payload = { sender_uid: uid, receiver_uid: receiver.uid };
      getConversation(payload).then((res) => setChat(res));
    }
  };

  useEffect(() => {
    if (user.uid && receiver) {
      getChat(user.uid);
    }
  }, [user.uid, receiver]);

  return (
    <>
      <div className="messages-page">
        <ConversationList />
        <div className="message-container">
          {chat.length === 0 ? (
            <h2>No messages to display</h2>
          ) : (
            chat.map((message) => (
              <MessageCard key={message.id} mesObj={message} />
            ))
          ) }
          <MessageForm receiver={receiver} getChat={getChat} />
        </div>
      </div>
    </>
  );
}