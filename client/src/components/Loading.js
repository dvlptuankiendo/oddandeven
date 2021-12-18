import React, { useContext } from "react";

import { AppContext } from "../contexts/app.context";

const Loading = ({ loading }) => {
  const { isLoading } = useContext(AppContext);

  if (!isLoading && !loading) return null;

  return (
    <div className="vh-100 vw-100 d-flex align-items-center justify-content-center loading-container">
      <div className="spinner-border text-primary" role="status">
        <span className="sr-only">Đang lấy dữ liệu...</span>
      </div>
    </div>
  );
};

export default Loading;
