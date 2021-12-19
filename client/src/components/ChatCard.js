import React, { useEffect, useState, useContext } from "react";
import { Button, Input, Form } from "reactstrap";
import { FaUserAlt } from "react-icons/fa";

import ContentCard from "./ContentCard";
import firebase from "../configs/firebase";
import { AppContext } from "../contexts/app.context";
import { formatAmount } from "../utils/helpers";

const messageStore = firebase.firestore().collection("Messages");

const ChatCard = () => {
  const { user } = useContext(AppContext);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [messageId, setMessageId] = useState(null);
  const [newMessage, setNewMessage] = useState(null);

  useEffect(() => {
    messageStore.onSnapshot((snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      if (data[0]) {
        !messageId && setMessageId(data[0].id);
        setNewMessage(data[0]);
      }
    });
  }, []);

  useEffect(() => {
    if (newMessage) {
      setMessages([...messages, newMessage]);
      setNewMessage(null);
    }
  }, [newMessage]);

  useEffect(() => {
    const bottom = document.getElementById("message-list-bottom");
    bottom && bottom.scrollIntoView();
  }, [messages]);

  const send = async (e) => {
    e.preventDefault();
    if (!message || !message.trim()) return;
    setMessage("");

    if (!messageId) {
      const allMessages = await messageStore.get();
      const docIds = allMessages.docs.map((doc) => doc.id);
      docIds[0] && setMessageId(docIds[0]);
      await messageStore.doc(docIds[0]).update({
        sender: (user && user.username) || "Vô danh",
        text: message,
        amount: (user && user.amount) || "",
      });
      return;
    }

    await messageStore.doc(messageId).update({
      sender: (user && user.username) || "Anonymous",
      text: message,
      amount: (user && user.amount) || "",
    });
  };

  const renderAmount = (item) => {
    if (!item.amount) return "";
    return `- Số dư: ${formatAmount(item.amount)}`;
  };

  return (
    <ContentCard title="BOX CHAT">
      <div className="d-flex flex-column box-chat">
        <div className="flex-grow-1 mb-2 message-list">
          {messages.map((item, index) => (
            <div
              key={index}
              className="d-flex align-items-center"
              style={{
                justifyContent:
                  user && item.sender === user.username
                    ? "flex-end"
                    : "flex-start",
              }}
            >
              <div className="mb-2 message-item">
                <div className="d-flex align-items-center mb-2">
                  <FaUserAlt className="mr-2" />
                  {item.sender} {renderAmount(item)}
                </div>
                <div>{item.text}</div>
              </div>
            </div>
          ))}
          <div id="message-list-bottom" />
        </div>
        <Form onSubmit={send}>
          <Input
            className="mb-2"
            placeholder="Nhập nội dung chat"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button color="primary" block>
            Gửi
          </Button>
        </Form>
      </div>
    </ContentCard>
  );
};

export default ChatCard;
