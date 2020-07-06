import React, { Component } from "react";
import StockTable from "./StockTable";
import FavoriteCard from "./FavoriteCard";
import SubNavbar from "./SubNavbar";
import DashboardChart from "./DashboardChart";

// Grid Layout
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

// Card Layout
import Card from "react-bootstrap/Card";

class DashboardComponent extends Component {
  render() {
    return (
      <Container fluid>
        <Container fluid className="px-4">
          <SubNavbar />
        </Container>
        <Row className="mt-4">
          {/* <Card style={{ width: "100vw" }}>
                <Card.Header>
                  <h3>Seus Favoritos</h3>
                </Card.Header>
                <Card.Body> */}
          <FavoriteCard favorite={true} />
          {/* </Card.Body>
              </Card> */}
        </Row>
        <Row className="mt-4">
          <Col sm={5} className="">
            <Card className="mt-2" bg="light" text="dark">
              <Card.Header>
                <h3>Outras ações</h3>
              </Card.Header>
              <Card.Body>
                <StockTable favorite={false} />
              </Card.Body>
            </Card>
          </Col>
          <Col sm={7}>
            <Card className="mt-2" bg="light" text="dark">
              <DashboardChart />
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default DashboardComponent;
