import React from "react";
import { Modal, ModalHeader, ModalBody } from "reactstrap";

const GuideModal = ({ isOpen, toggle }) => {
  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Hướng dẫn</ModalHeader>
      <ModalBody>
        <p className="font-weight-bold">
          Hệ thống chẵn lẽ game ngọc rồng online
        </p>
        <p className="font-weight-bold">
          Lấy chức năng con số may mắn trong game làm kết quả
        </p>
        <p className="font-weight-bold text-danger">Thể lệ các trò chơi:</p>

        <p className="mb-0">
          -{" "}
          <span className="font-weight-bold text-danger">Dự đoán chẵn lẻ:</span>{" "}
          <span>
            kết quả <b>số chẵn</b> hoặc <b>số lẻ</b>
          </span>
        </p>
        <p className="font-weight-bold text-success">
          Tỷ lệ: x1.9 (đặt 10tr ăn được 19tr vàng)
        </p>

        <p className="mb-0">
          -{" "}
          <span className="font-weight-bold text-danger">Dự đoán tài xỉu:</span>{" "}
          <span>
            kết quả <b>từ 50-99 là tài</b> hoặc <b>từ 0 đến 49 là xỉu</b>
          </span>
        </p>
        <p className="font-weight-bold text-success">
          Tỷ lệ: x1.9 (đặt 10tr ăn được 19tr vàng)
        </p>

        <p className="mb-0">
          -{" "}
          <span className="font-weight-bold text-danger">Dự đoán kết quả:</span>{" "}
          <span>
            kết quả <b>là con số may mắn từ 0-99</b>
          </span>
        </p>
        <p className="font-weight-bold text-success">
          Tỷ lệ: x70 (đặt 10tr ăn được 700tr vàng)
        </p>
      </ModalBody>
    </Modal>
  );
};

export default GuideModal;
