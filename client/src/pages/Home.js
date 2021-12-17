import React from "react";
import { Container, Row, Col, Button } from "reactstrap";

import ContentContainer from "../layouts/ContentContainer";
import ChatCard from "../components/ChatCard";
import ResultCard from "../components/ResultCard";
import BetCard from "../components/BetCard";

const Home = ({ isAuth }) => {
  return (
    <ContentContainer isAuth={isAuth}>
      <Container className="p-3">
        <Button color="primary" className="mb-3">
          Hướng dẫn
        </Button>
        <Row>
          <Col md={6}>
            <ResultCard />
            <BetCard />
          </Col>
          <Col md={6}>
            <ChatCard />
          </Col>
        </Row>
      </Container>
    </ContentContainer>
  );
};

export default Home;
