import React, { useContext, useEffect, useState } from "react";
import { GiGoldBar } from "react-icons/gi";
import { BsFillCheckCircleFill } from "react-icons/bs";
import Select from "react-select";
import { Row, Col, Button, Label, Input } from "reactstrap";

import ContentCard from "./ContentCard";
import { AppContext } from "../contexts/app.context";
import { formatAmount } from "../utils/helpers";
import { getActiveBetting, createBet } from "../services/api";
import {
  BET_TYPES,
  EVENODDHIGHLOW_OPTIONS,
  XIEN_OPTIONS,
} from "../utils/constants";
import { toast } from "react-toastify";

const colors = ["primary", "warning", "success", "danger"];

const options = [
  {
    label: "Chẵn lẽ - Tài xỉu (10tr ăn 19tr)",
    value: BET_TYPES.EVENODDHIGHLOW,
  },
  { label: "Xiên (10tr ăn 32tr)", value: BET_TYPES.XIEN },
  { label: "Dự đoán kết quả (10tr ăn 700tr)", value: BET_TYPES.LO },
];

const btnTexts = {
  EVENODDHIGHLOW: ["CHẴN", "LẺ", "TÀI", "XỈU"],
  XIEN: ["CHẴN - TÀI", "CHẴN - XỈU", "LẺ - TÀI", "LẺ - XỈU"],
};

const btnValues = {
  EVENODDHIGHLOW: [
    EVENODDHIGHLOW_OPTIONS.EVEN,
    EVENODDHIGHLOW_OPTIONS.ODD,
    EVENODDHIGHLOW_OPTIONS.HIGH,
    EVENODDHIGHLOW_OPTIONS.LOW,
  ],
  XIEN: [
    XIEN_OPTIONS.EVENHIGH,
    XIEN_OPTIONS.EVENLOW,
    XIEN_OPTIONS.ODDHIGH,
    XIEN_OPTIONS.ODDLOW,
  ],
};

const BetCard = () => {
  const { user, setUser, setIsLoading } = useContext(AppContext);
  const [existedBetting, setExistedBetting] = useState(null);

  const [type, setType] = useState(BET_TYPES.EVENODDHIGHLOW);
  const [chosenTextOption, setChosenTextOption] = useState(null);
  const [chosenNumberOption, setChosenNumberOption] = useState(null);
  const [amount, setAmount] = useState(0);

  const isUnauthenticated = !user;

  const checkBlocking = async () => {
    if (!user) return;

    const res = await getActiveBetting();
    if (res.data) setExistedBetting(res.data);
  };

  useEffect(() => {
    checkBlocking();
  }, [user]);

  useEffect(() => {
    setChosenNumberOption(null);
    setChosenTextOption(null);
  }, [type]);

  useEffect(() => {
    if (existedBetting) {
      setType(existedBetting.type);
      setAmount(existedBetting.amount);
      existedBetting.chosenTextOption &&
        setChosenTextOption(existedBetting.chosenTextOption);
      existedBetting.chosenNumberOption &&
        setChosenNumberOption(existedBetting.chosenNumberOption);
    }
  }, [existedBetting]);

  const option = options.find((item) => item.value === type);

  const isBlocked = !!existedBetting;

  const onClickBtn = (index) => {
    setChosenTextOption(btnValues[type][index]);
  };

  const validate = () => {
    try {
      if (
        ![BET_TYPES.EVENODDHIGHLOW, BET_TYPES.XIEN, BET_TYPES.LO].includes(type)
      )
        throw new Error();

      if (type === BET_TYPES.EVENODDHIGHLOW) {
        if (
          ![
            EVENODDHIGHLOW_OPTIONS.ODD,
            EVENODDHIGHLOW_OPTIONS.EVEN,
            EVENODDHIGHLOW_OPTIONS.HIGH,
            EVENODDHIGHLOW_OPTIONS.LOW,
          ].includes(chosenTextOption)
        )
          throw new Error();
      }

      if (type === BET_TYPES.XIEN) {
        if (
          ![
            XIEN_OPTIONS.EVENHIGH,
            XIEN_OPTIONS.EVENLOW,
            XIEN_OPTIONS.ODDHIGH,
            XIEN_OPTIONS.ODDLOW,
          ].includes(chosenTextOption)
        )
          throw new Error();
      }

      if (type === BET_TYPES.LO) {
        if (
          typeof chosenNumberOption !== "number" ||
          chosenNumberOption < 0 ||
          chosenNumberOption > 99 ||
          chosenNumberOption % 1 !== 0
        )
          throw new Error();
      }

      if (
        typeof amount !== "number" ||
        amount < 1000000 ||
        amount > user?.amount ||
        amount % 1 !== 0
      )
        throw new Error();

      return true;
    } catch {
      return false;
    }
  };

  const submit = async () => {
    setIsLoading(true);
    try {
      const passed = validate();
      if (!passed) throw new Error("Vui lòng chọn đủ thông tin");
      const data = {
        type,
        chosenNumberOption,
        chosenTextOption,
        amount,
      };

      await createBet(data);
      await getActiveBetting();
      setUser({
        ...user,
        amount: user.amount - amount,
      });
    } catch (err) {
      toast.error(err.message);
    }

    setIsLoading(false);
  };

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
          <span className="font-weight-bold">{formatAmount(user?.amount)}</span>
        </div>
        <div className="mb-2">
          <Select
            options={options}
            value={option}
            onChange={(e) => setType(e.value)}
            isDisabled={isBlocked}
          />
        </div>
        {[BET_TYPES.EVENODDHIGHLOW, BET_TYPES.XIEN].includes(type) && (
          <div className="mb-2">
            <Row>
              {[0, 1, 2, 3].map((item) => (
                <Col md={6} key={item} className="mb-2">
                  <Button
                    color={colors[item]}
                    size="sm"
                    className="w-100 font-weight-bold"
                    disabled={isBlocked}
                    style={{
                      opacity:
                        chosenTextOption !== btnValues[type][item] ? 0.5 : 1,
                    }}
                    onClick={() => onClickBtn(item)}
                  >
                    {btnTexts[type][item]}
                    {chosenTextOption === btnValues[type][item] && (
                      <BsFillCheckCircleFill className="ml-2" />
                    )}
                  </Button>
                </Col>
              ))}
            </Row>
          </div>
        )}

        {type === BET_TYPES.LO && (
          <div className="mb-2">
            <Label>Kết quả dự đoán</Label>
            <Input
              placeholder="Nhập kết quả dự đoán bằng số"
              disabled={isBlocked}
              value={chosenNumberOption}
              onChange={(e) => setChosenNumberOption(parseInt(e.target.value))}
            />
          </div>
        )}

        <div className="mb-2">
          <Label>
            Đặt cược{" "}
            <span className="text-danger">
              (nhỏ nhất là {formatAmount(1000000)})
            </span>
          </Label>
          <Input
            placeholder="Nhập số tiền đặt cược"
            type="number"
            disabled={isBlocked}
            value={amount}
            onChange={(e) => setAmount(parseInt(e.target.value))}
          />
        </div>

        <div className="mb-2">
          <Button
            color="warning"
            block
            disabled={isBlocked || !validate()}
            onClick={submit}
          >
            ĐẶT CƯỢC
          </Button>
          {isBlocked && <p className="text-danger">Vui lòng chờ kết quả</p>}
        </div>
      </div>
    </ContentCard>
  );
};

export default BetCard;
