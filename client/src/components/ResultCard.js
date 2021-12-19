import React, { useContext, useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import socketIOClient from "socket.io-client";

import ContentCard from "./ContentCard";

import { getResults } from "../services/api";
import { AppContext } from "../contexts/app.context";
import { host } from "../utils/constants";

const backgrounds = {
  T: "success",
  X: "danger",
  C: "primary",
  L: "warning",
};

const ResultCard = () => {
  const socketRef = useRef();
  const [count, setCount] = useState(null);

  useEffect(() => {
    socketRef.current = socketIOClient.connect(host);

    socketRef.current.on("newresult", () => {
      getData();
    });

    socketRef.current.on("countdown", ({ count }) => {
      setCount(count);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const { setIsLoading } = useContext(AppContext);
  const [results, setResults] = useState({
    lastResult: null,
    lowHighs: [],
    evenOdds: [],
  });

  const getData = async () => {
    setIsLoading(true);
    try {
      const res = await getResults();
      setResults(res.data);
    } catch (err) {
      toast.error((err.response && err.response.data.message) || err.message);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <ContentCard title="KẾT QUẢ">
      <div className="mb-2">
        Phiên: <b className="text-danger">{results.activeResultId}</b>
      </div>
      <div className="mb-2">
        Kết quả trước đó: <b className="text-danger">{results.lastResult}</b>
      </div>
      <div className="mb-2">
        Thời gian còn: <b className="text-danger">{count} giây</b>
      </div>
      <div className="d-flex align-items-center mb-2">
        <span className="mr-2">CL:</span>
        {results.evenOdds.map((item, index) => (
          <div
            key={index}
            className={`d-flex align-items-center justify-content-center text-white bg-${backgrounds[item]} mr-1 result-item`}
          >
            {item}
          </div>
        ))}
      </div>
      <div className="d-flex align-items-center">
        <span className="mr-2">TX:</span>
        {results.lowHighs.map((item, index) => (
          <div
            key={index}
            className={`d-flex align-items-center justify-content-center text-white bg-${backgrounds[item]} mr-1 result-item`}
          >
            {item}
          </div>
        ))}
      </div>
    </ContentCard>
  );
};

export default ResultCard;
