import React, { useContext, useState } from "react";
import { Alert, Input, Label, Button } from "reactstrap";
import { toast } from "react-toastify";

import { AppContext } from "../contexts/app.context";
import { depositTSR, getInfo } from "../services/api";

const TheSieuRe = ({ getData }) => {
  const { user, setIsLoading, setUser } = useContext(AppContext);
  const [code, setCode] = useState("");

  const submit = async () => {
    setIsLoading(true);

    try {
      if (!code || !code.trim()) throw new Error("Vui lòng nhập mã giao dịch");
      await depositTSR({ code });
      const res = await getInfo();
      setUser(res.data);
      getData();
      setCode("");
      toast.success("Nạp vàng thành công");
    } catch (err) {
      toast.error((err.response && err.response.data.message) || err.message);
    }

    setIsLoading(false);
  };

  return (
    <div className="p-3">
      <h4>NẠP TỪ VÍ THESIEURE.COM</h4>
      <Alert color="success" className="mb-2">
        <p className="text-danger font-weight-bold mb-1">Tỷ lệ nạp ví 10000%</p>
        <p className="text-danger font-weight-bold mb-0">
          Nạp 100k nhận 1 tỷ vàng
        </p>
        <p className="text-danger mb-0">
          Vui lòng gửi tiền vào tài khoản thesieure bên dưới theo đúng cú pháp,
          sau đó bấm nút Nạp tiền để nạp vàng vào tài khoản
        </p>
      </Alert>
      <div>
        <Label>Tài khoản nhận</Label>
        <Input className="mb-2" disabled value="nrowin"></Input>

        <Label>Họ và tên</Label>
        <Input className="mb-2" disabled value="Hảo Khắc Toàn"></Input>

        <Label>Nội dung</Label>
        <Input className="mb-3" disabled value={user.username}></Input>

        <Label>Mã giao dịch</Label>
        <Input
          className="mb-2"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Mã giao dịch"
        ></Input>

        <Button
          color="primary"
          block
          className="font-weight-bold"
          onClick={submit}
        >
          Nạp tiền
        </Button>
      </div>
    </div>
  );
};

export default TheSieuRe;
