import React, { useState } from "react";
import { Button, Input, Form } from "reactstrap";

import ContentCard from "./ContentCard";

const ChatCard = () => {
  const [message, setMessage] = useState("");
  return (
    <ContentCard title="BOX CHAT">
      <div className="d-flex flex-column box-chat">
        <div className="flex-grow-1 mb-2 message-list"></div>
        <Form>
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
