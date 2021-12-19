import React, { useState, useContext, useEffect } from "react";
import { Row, Col, Button, Container, Table } from "reactstrap";
import { toast } from "react-toastify";
import moment from "moment";

import { AppContext } from "../contexts/app.context";
import ContentContainer from "../layouts/ContentContainer";
import Momo from "../components/Momo";
import TheSieuRe from "../components/TheSieuRe";

import { getHistory } from "../services/api";
import { formatAmount } from "../utils/helpers";

const Deposit = () => {
  const { setIsLoading } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState(1);
  const isDesktop = window.innerWidth >= 768;

  const [history, setHistory] = useState([]);

  const getData = async () => {
    setIsLoading(true);

    try {
      const res = await getHistory();
      setHistory(res.data);
    } catch (err) {
      toast.error((err.response && err.response.data.message) || err.message);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);

  const renderStatus = (item) => {
    if (item.status === "IsProcessing") return "Đang xử lý";
    if (item.status === "IsCompleted") return "Đã hoàn thành";
    return "";
  };

  console.log(isDesktop);

  return (
    <ContentContainer>
      <Container className="h-100">
        <div style={{ minHeight: "100%" }}>
          <Row className="flex-grow-1 mb-3 h-100">
            <Col md={3} className={isDesktop ? "border-right" : ""}>
              <Button
                color="link"
                onClick={() => setActiveTab(1)}
                style={activeTab !== 1 ? { color: "black" } : {}}
              >
                Nạp từ ví Momo
              </Button>
              <Button
                color="link"
                onClick={() => setActiveTab(2)}
                style={activeTab !== 2 ? { color: "black" } : {}}
              >
                Nạp từ ví thesieure.com
              </Button>
            </Col>
            <Col md={9}>
              {activeTab === 1 && <Momo />}
              {activeTab === 2 && <TheSieuRe />}
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <h4 className="text-center">Lịch sử giao dịch</h4>
              <Table size="sm" hover striped bordered responsive>
                <thead>
                  <tr>
                    <th className="text-center align-middle">Thời gian</th>
                    <th className="text-center align-middle">Số tiền</th>
                    <th className="text-center align-middle">Số vàng</th>
                    <th className="text-center align-middle">Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {history && !!history.length ? (
                    history.map((item, index) => (
                      <tr key={index}>
                        <td>
                          {moment(
                            new Date(item.createdAt).format("DD/MM/YYYY HH:mm")
                          )}
                        </td>
                        <td>{formatAmount(item.amount)}</td>
                        <td>{formatAmount(item.goldAmount)}</td>
                        <td>{renderStatus(item)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="text-center align-middle">
                        Bạn chưa thực hiện giao dịch nào
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

export default Deposit;
