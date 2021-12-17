import React from "react";
import { Card, CardHeader, CardBody } from "reactstrap";

const ContentCard = ({ title, children }) => {
  return (
    <Card className="mb-3">
      <CardHeader className="card-header">{title}</CardHeader>
      <CardBody>{children}</CardBody>
    </Card>
  );
};

export default ContentCard;
