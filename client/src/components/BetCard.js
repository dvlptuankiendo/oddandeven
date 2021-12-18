import React, { useContext, useState } from "react";
import { GiGoldBar } from "react-icons/gi";
import Select from "react-select";
import { Row, Col, Button, Label, Input } from "reactstrap";

import ContentCard from "./ContentCard";
import { AppContext } from "../contexts/app.context";

const options = [
  { label: "Chẵn lẽ - Tài xỉu (10tr ăn 19tr)", value: 1 },
  { label: "Xiên (10tr ăn 32tr)", value: 2 },
  { label: "Dự đoán kết quả (10tr ăn 700tr)", value: 3 },
];

const btnTexts = {
  1: ["CHẴN", "LẺ", "TÀI", "XỈU"],
  2: ["CHẴN - TÀI", "CHẴN - XỈU", "LẺ - TÀI", "LẺ - XỈU"],
};

const BetCard = () => {
  const { user } = useContext(AppContext);
  const [value, setValue] = useState(1);

  const isUnauthenticated = !user;

  const option = options.find((item) => item.value === value);

  return (
    <ContentCard title="ĐẶT CƯỢC">
      <div className="bet-container">
        {isUnauthenticated && (
          <div className="d-flex align-items-center justify-content-center bet-overlay">
            <h5 className="text-white font-weight-bold">
              Đăng nhập để đặt cược
            </h5>
          </div>
        )}
        <div className="d-flex align-items-center mb-2">
          <GiGoldBar size={30} color="yellow" className="mr-2" />
          <span className="font-weight-bold">{user?.amount}</span>
        </div>
        <div className="mb-2">
          <Select
            options={options}
            value={option}
            onChange={(e) => setValue(e.value)}
          />
        </div>
        {[1, 2].includes(value) && (
          <div className="mb-2">
            <Row className="mb-2">
              <Col xs={6}>
                <Button
                  color="primary"
                  size="sm"
                  className="w-100 font-weight-bold"
                >
                  {btnTexts[value][0]}
                </Button>
              </Col>
              <Col xs={6}>
                <Button
                  color="warning"
                  size="sm"
                  className="w-100 font-weight-bold"
                >
                  {btnTexts[value][1]}
                </Button>
              </Col>
            </Row>
            <Row className="mb-2">
              <Col xs={6}>
                <Button
                  color="success"
                  size="sm"
                  className="w-100 font-weight-bold"
                >
                  {btnTexts[value][2]}
                </Button>
              </Col>
              <Col xs={6}>
                <Button
                  color="danger"
                  size="sm"
                  className="w-100 font-weight-bold"
                >
                  {btnTexts[value][3]}
                </Button>
              </Col>
            </Row>
          </div>
        )}

        {value === 3 && (
          <div className="mb-2">
            <Label>Kết quả dự đoán</Label>
            <Input placeholder="Nhập kết quả dự đoán bằng số" />
          </div>
        )}

        <div className="mb-2">
          <Label>Đặt cược</Label>
          <Input placeholder="Nhập số tiền đặt cược" type="number" />
        </div>

        <div className="mb-2">
          <Button color="warning" block>
            ĐẶT CƯỢC
          </Button>
        </div>
      </div>
    </ContentCard>
  );
};

export default BetCard;
