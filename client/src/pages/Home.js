import React, { useState } from "react";
import { Container, Row, Col, Button } from "reactstrap";

import ContentContainer from "../layouts/ContentContainer";
import ChatCard from "../components/ChatCard";
import ResultCard from "../components/ResultCard";
import BetCard from "../components/BetCard";
import GuideModal from "../components/GuideModal";
import DailyRanking from "../components/DailyRanking";

const Home = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

  return (
    <ContentContainer>
      <GuideModal isOpen={isOpen} toggle={toggle} />
      <Container className="p-3">
        <Button color="primary" className="mb-3" onClick={toggle}>
          Hướng dẫn
        </Button>
        <Row className="mb-3">
          <Col md={6}>
            <ResultCard />
            <BetCard />
          </Col>
          <Col md={6}>
            <ChatCard />
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <DailyRanking />
          </Col>
        </Row>
      </Container>
    </ContentContainer>
  );
};

export default Home;
