import React, { useState } from "react";
import { Button, Label, Input, Form } from "reactstrap";

import ContentContainer from "../layouts/ContentContainer";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <ContentContainer>
      <div className="h-100 d-flex flex-column align-items-center justify-content-center">
        <h5>ĐĂNG KÝ</h5>
        <Form className="login-form">
          <Label>Username</Label>
          <Input
            className="mb-2"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <Label>Mật khẩu</Label>
          <Input
            className="mb-2"
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button block color="primary">
            Đăng ký
          </Button>
        </Form>
      </div>
    </ContentContainer>
  );
};

export default SignUp;
