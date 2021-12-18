import React, { useState, useContext } from "react";
import { Button, Label, Input, Form } from "reactstrap";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import ContentContainer from "../layouts/ContentContainer";
import { signUp } from "../services/api";
import { AppContext } from "../contexts/app.context";

const SignUp = () => {
  const navigate = useNavigate();
  const { setIsLoading } = useContext(AppContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const validate = () => {
    if (!username || !username.trim() || username.trim().length < 6)
      throw new Error("Username phải có ít nhất 6 ký tự");
    if (!password || !password.trim() || password.trim().length < 8)
      throw new Error("Password phải có ít nhất 8 ký tự");
  };

  const submit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      validate();
      await signUp(username, password);
      toast.success("Sign up successfully");
      navigate("/login");
    } catch (err) {
      toast.error((err.response && err.response.data.message) || err.message);
    }

    setIsLoading(false);
  };

  return (
    <ContentContainer>
      <div className="h-100 d-flex flex-column align-items-center justify-content-center">
        <h5>ĐĂNG KÝ</h5>
        <Form className="login-form" onSubmit={submit}>
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
