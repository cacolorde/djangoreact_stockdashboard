import React, { useState } from "react";
import { Col, Card, Container, Row, Form, Button } from "react-bootstrap/";
import axios from "axios";
import { MDBInput } from "mdbreact";

const AddStockComponent = () => {
  const [symbol, setSymbol] = useState("");
  const [isETF, setETF] = useState(false);
  const [isFund, setFund] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:8000/api/stock/", {
        symbol: symbol.toUpperCase(),
        is_etf: isETF,
        is_fund: isFund,
      })
      .then((resp) => {
        console.log(resp);
        resp.status === 201
          ? alert(
              `${resp.data.name}(${resp.data.symbol}) adicionado ao portfólio`
            )
          : alert("Ops, algum erro ocorreu");
      })
      .catch((err) => {
        console.log(err);
      });

    // console.log(symbol);
    // console.log(isETF);
    // console.log(isFund);
  };

  // cuida do textinput
  const handleSymbolChange = (e) => {
    setSymbol(e.target.value);
    // console.log(symbol);
  };

  // cuida da checkbox ETF
  const handleETFChange = (e) => {
    // atualiza o stateHook para o contrário do seu valor anterior
    setETF(!isETF);
    // console.log(isETF);
  };

  // cuida da checkbox FUND
  const handleFundChange = (e) => {
    // atualiza o stateHook para o contrário do seu valor anterior
    setFund(!isFund);
    // console.log(isFund);
  };

  const variant = "dark";
  return (
    <Container>
      <Row className="justify-content-center mt-3">
        <Card
          bg={variant.toLowerCase()}
          text={variant.toLowerCase() === "light" ? "dark" : "white"}
          style={{ width: "65%" }}
          className="mb-2"
        >
          <Card.Header>
            <h3 className="d-flex justify-content-center ">Adicionar Ação</h3>
          </Card.Header>
          <Card.Body>
            {/* <Card.Title>{variant} Card Title </Card.Title> */}
            <Form onSubmit={handleSubmit}>
              <MDBInput
                label="Insira a sigla da ação que deseja adicionar ao seu portfolio"
                icon=""
                group
                style={{ fontSize: "20px", color: "white" }}
                type="text"
                error="wrong"
                success="right"
                onChange={handleSymbolChange}
              />
              <Form.Group controlId="etfCheckBox">
                <Col className="">
                  <Form.Check
                    checked={isETF}
                    onChange={handleETFChange}
                    type="checkbox"
                    className=""
                    label="ETF"
                  />
                </Col>
              </Form.Group>
              <Form.Group controlId="fundCheckBox">
                <Col>
                  <Form.Check
                    checked={isFund}
                    onChange={handleFundChange}
                    type="checkbox"
                    className=""
                    label="Fundo Imobiliário"
                  />
                </Col>
              </Form.Group>
              <Button variant="primary" type="submit">
                Adicionar
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Row>
    </Container>
  );
};

export default AddStockComponent;
