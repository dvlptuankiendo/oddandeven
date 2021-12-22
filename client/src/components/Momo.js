import React, { useContext } from "react";
import { Alert, Input, Label, Button } from "reactstrap";
import { toast } from "react-toastify";

import { AppContext } from "../contexts/app.context";
import { depositMomo, getInfo } from "../services/api";

const Momo = ({ getData }) => {
  const { user, setIsLoading, setUser } = useContext(AppContext);

  const submit = async () => {
    setIsLoading(true);

    try {
      await depositMomo();
      const res = await getInfo();
      setUser(res.data);
      getData();
      toast.success("Nạp vàng thành công");
    } catch (err) {
      toast.error((err.response && err.response.data.message) || err.message);
    }

    setIsLoading(false);
  };

  return (
    <div className="p-3">
      <h4>NẠP TỪ VÍ MOMO</h4>
      <Alert color="success" className="mb-2">
        <p className="text-danger font-weight-bold mb-1">Tỷ lệ nạp ví 7600%</p>
        <p className="text-danger font-weight-bold mb-0">
          Nạp 100k nhận 760tr vàng
        </p>
        <p className="text-danger mb-0">
          Vui lòng gửi tiền vào tài khoản momo bên dưới theo đúng cú pháp, sau
          đó bấm nút Nạp tiền để nạp vàng vào tài khoản
        </p>
      </Alert>
      <div>
        <Label>Tên ví</Label>
        <Input className="mb-2" disabled value="MOMO"></Input>

        <Label>Số tài khoản</Label>
        <Input className="mb-2" disabled value="0922102393"></Input>

        <Label>Họ và tên</Label>
        <Input className="mb-2" disabled value="NGUYEN THU TRANG"></Input>

        <Label>Nội dung</Label>
        <Input className="mb-3" disabled value={user.username}></Input>

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

export default Momo;
