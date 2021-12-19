import React, { useState, useContext } from "react";
import { Button, Label, Input, Form } from "reactstrap";
import { toast } from "react-toastify";

import ContentContainer from "../layouts/ContentContainer";
import { logIn } from "../services/api";
import { AppContext } from "../contexts/app.context";
import { ACCESS_TOKEN } from "../utils/constants";

const Login = () => {
  const { setIsLoading, setUser } = useContext(AppContext);
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
      const res = await logIn(username, password);
      const { data, accessToken } = res.data;
      localStorage.setItem(ACCESS_TOKEN, accessToken);
      setUser(data);
    } catch (err) {
      toast.error((err.response && err.response.data.message) || err.message);
    }

    setIsLoading(false);
  };

  return (
    <ContentContainer>
      <div className="h-100 d-flex flex-column align-items-center justify-content-center">
        <h5>ĐĂNG NHẬP</h5>
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
            Đăng nhập
          </Button>
        </Form>
      </div>
    </ContentContainer>
  );
};

export default Login;
