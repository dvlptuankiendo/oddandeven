import React, { useContext } from "react";
import { Alert, Input, Label } from "reactstrap";

import { AppContext } from "../contexts/app.context";

const Momo = () => {
  const { user } = useContext(AppContext);

  return (
    <div className="p-3">
      <h4>NẠP TỪ VÍ MOMO</h4>
      <Alert color="success" className="mb-2">
        <p className="text-danger font-weight-bold mb-1">Tỷ lệ nạp ví 7600%</p>
        <p className="text-danger font-weight-bold mb-0">
          Nạp 100k nhận 760tr vàng
        </p>
      </Alert>
      <div>
        <Label>Tên ví</Label>
        <Input className="mb-2" disabled value="MOMO"></Input>

        <Label>Số tài khoản</Label>
        <Input className="mb-2" disabled value="0367696024"></Input>

        <Label>Họ và tên</Label>
        <Input className="mb-2" disabled value="PHAM TUAN LINH"></Input>

        <Label>Nội dung</Label>
        <Input className="mb-2" disabled value={user.username}></Input>

        <p className="text-danger">
          Hệ thống sẽ tự động cộng vàng vào tài khoản trong vòng 3 phút
        </p>
      </div>
    </div>
  );
};

export default Momo;
