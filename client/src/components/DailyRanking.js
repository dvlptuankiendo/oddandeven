import React, { useEffect, useState, useContext } from "react";
import { Table } from "reactstrap";
import { toast } from "react-toastify";

import { getRanking } from "../services/api";
import { AppContext } from "../contexts/app.context";
import { formatAmount } from "../utils/helpers";

const badges = [
  "images/1.gif",
  "images/2.gif",
  "images/3.gif",
  "images/4.png",
  "images/5.png",
  "images/6.png",
  "images/7.png",
];

const fontSizes = ["h4", "h5", "h6", "", "", "", ""];
const textColors = [
  "text-danger",
  "text-danger",
  "text-danger",
  "",
  "",
  "",
  "",
];

const DailyRanking = () => {
  const { setIsLoading } = useContext(AppContext);
  const [rankings, setRankings] = useState([]);

  const getData = async () => {
    setIsLoading(true);

    try {
      const res = await getRanking();
      setRankings(res.data);
    } catch (err) {
      toast.error((err.response && err.response.data.message) || err.message);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <h4 className="text-center">BẢNG XẾP HẠNG TRONG NGÀY HÔM QUA</h4>
      <Table size="sm" hover striped bordered responsive>
        <thead>
          <tr>
            <th className="text-center align-middle">STT</th>
            <th className="text-center align-middle">Username</th>
            <th className="text-center align-middle">Số vàng đã chơi</th>
            <th className="text-center align-middle">Phần thưởng (vàng)</th>
          </tr>
        </thead>
        <tbody>
          {rankings.map((item, index) => (
            <tr key={index}>
              <td className="d-flex align-items-center justify-content-center">
                <img src={badges[index]} className="badge-icon" />
              </td>
              <td
                className={`text-center align-middle ${fontSizes[index]} ${textColors[index]}`}
              >
                {item.username}
              </td>
              <td
                className={`text-center align-middle ${fontSizes[index]} ${textColors[index]}`}
              >
                {formatAmount(item.amount)}
              </td>
              <td
                className={`text-center align-middle ${fontSizes[index]} ${textColors[index]}`}
              >
                {formatAmount(item.reward)}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default DailyRanking;
