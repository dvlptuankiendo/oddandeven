import React, { useState, useContext, useEffect } from "react";
import { Row, Col, Button, Container, Table, Label, Input } from "reactstrap";
import { toast } from "react-toastify";
import moment from "moment";

import ContentContainer from "../layouts/ContentContainer";
import { AppContext } from "../contexts/app.context";
import { getWithDrawRequest, requestWithDraw, getInfo } from "../services/api";
import { formatAmount } from "../utils/helpers";
import { PROVIDERS } from "../utils/constants";

const { MOMO, THESIEURE } = PROVIDERS;

const min = 10000000;

const WithDraw = () => {
  const { setIsLoading, setUser } = useContext(AppContext);
  const [provider, setProvider] = useState(MOMO);
  const [amount, setAmount] = useState(0);
  const [address, setAddress] = useState("");

  const isDesktop = window.innerWidth >= 768;
  const [requests, setRequests] = useState([]);

  const getData = async () => {
    setIsLoading(true);

    try {
      const res = await getWithDrawRequest();
      setRequests(res.data);
    } catch (err) {
      toast.error((err.response && err.response.data.message) || err.message);
    }

    setIsLoading(false);
  };

  const request = async () => {
    setIsLoading(true);

    try {
      if (!amount) throw new Error("Vui lòng nhập số dư");
      if (amount < min) throw new Error("Số tiền rút tối thiểu là 10,000,000");
      if (!address || !address.trim())
        throw new Error("Vui lòng nhập địa chỉ ví");

      await requestWithDraw({ provider, amount, address });
      const res = await getInfo();
      setUser(res.data);
      getData();
      setAmount(0);
      setAddress("");
      toast.success("Gửi yêu cầu rút thành công");
    } catch (err) {
      toast.error((err.response && err.response.data.message) || err.message);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);

  const renderStatus = (status) => {
    if (status === "IsProcessing") return "Đang xử lý";
    if (status === "Approved") return "Đã chấp nhận";
    if (status === "Cancelled") return "Đã hủy";
    return "";
  };

  return (
    <ContentContainer>
      <Container className="h-100">
        <div style={{ minHeight: "100%" }}>
          <Row className="flex-grow-1 mb-3 h-100">
            <Col md={3} className={isDesktop ? "border-right" : ""}>
              <Button
                color="link"
                onClick={() => setProvider(MOMO)}
                style={provider !== MOMO ? { color: "black" } : {}}
              >
                Rút về ví Momo
              </Button>
              <Button
                color="link"
                onClick={() => setProvider(THESIEURE)}
                style={provider !== THESIEURE ? { color: "black" } : {}}
              >
                Rút về ví thesieure.com
              </Button>
            </Col>
            <Col md={9} className="p-3">
              <h4>RÚT VỀ VÍ {provider === MOMO ? "MOMO" : "THESIEURE"}</h4>
              <Label>Số tiền rút</Label>
              <Input
                type="number"
                className="mb-2"
                min={min}
                value={amount || ""}
                onChange={(e) => setAmount(Number(e.target.value))}
                placeholder="Số tiền rút"
              />
              <Label>Địa chỉ ví</Label>
              <Input
                className="mb-3"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Địa chỉ ví"
              />
              <Button
                color="primary"
                size="sm"
                block
                className="font-weight-bold"
                onClick={request}
              >
                GỬI YÊU CẦU RÚT
              </Button>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <h4 className="text-center">Lịch sử rút tiền</h4>
              <Table size="sm" hover striped bordered responsive>
                <thead>
                  <tr>
                    <th className="text-center align-middle">Thời gian</th>
                    <th className="text-center align-middle">Số vàng rút</th>
                    <th className="text-center align-middle">Rút về ví</th>
                    <th className="text-center align-middle">Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {requests && !!requests.length ? (
                    requests.map((item, index) => (
                      <tr key={index}>
                        <td className="text-center align-middle">
                          {moment(new Date(item.createdAt)).format(
                            "DD/MM/YYYY HH:mm"
                          )}
                        </td>
                        <td className="text-center align-middle">
                          {formatAmount(item.amount)}
                        </td>
                        <td className="text-center align-middle">
                          {item.provider}
                        </td>
                        <td className="text-center align-middle">
                          {renderStatus(item.status)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="text-center align-middle">
                        Bạn chưa thực hiện yêu cầu rút tiền nào
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Col>
          </Row>
        </div>
      </Container>
    </ContentContainer>
  );
};

export default WithDraw;
