import React from "react";
import {
  Row,
  Card,
  Spinner,
  Container,
  Form,
  Col,
  Tab,
  Nav,
} from "react-bootstrap";
import { MDBContainer, MDBRow, MDBCol, MDBInput, MDBBtn } from "mdbreact";
import InfoCard from "./InfoCard";
import WalletTable from "./WalletTable";
import TransactionsTable from "./TransactionsTable";
import WalletAllocationChart from "./WalletAllocationChart";
import WalletYield from "./WalletYield";
import axios from "axios";
// import { MDBBtn } from "mdbreact";

class WalletComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Loading: false,
      Wallet: [],
      Owner: "",
      TotalAmount: 0,
      TotalInvestment: 0,
      TotalChangePct: 0,
      MaxStockChange: {},
      MinStockChange: {},
      noData: false,
      stockAmout: 0,
      investment: 0,
      stock: "",
      broker: "",
      buy_date: "",
      updateRun: true,
      stockData: [],
    };

    this.handleOwnerChange = this.handleOwnerChange.bind(this);
    this.walletChangeCallback = this.walletChangeCallback.bind(this);
    this.submitWalletItem = this.submitWalletItem.bind(this);
  }

  // var total_money_amount = 0;
  // var total_investment = 0;
  // var total_change_pct = 0;
  // const [Loading, setLoading] = useState(false);
  // const [Wallet, setWallet] = useState([]);
  // const [Owner, setOwner] = useState("");

  handleOwnerChange = (e) => {
    this.setState({
      Owner: e.target.value,
    });
    // console.log(this.state.Owner);
    this.setState({
      Loading: true,
    });
    axios
      .get("http://localhost:8000/api/wallet/", {
        params: {
          owner: e.target.value,
        },
      })
      .then((resp) => resp.data)
      .then((data) => {
        // console.log(data);
        //calculating higher
        var higher = Math.max.apply(
          Math,
          data.map(function (obj) {
            return obj.change_percent;
          })
        );
        var object = data.find(function (o) {
          return o.change_percent === higher;
        });

        // ... and min
        var min = Math.min.apply(
          Math,
          data.map(function (obj) {
            return obj.change_percent;
          })
        );
        var object2 = data.find(function (o) {
          return o.change_percent === min;
        });

        //calculating totals
        let amount = data.reduce((sum, currentValue) => {
          return currentValue.money_amount + sum;
        }, 0);
        let investment = data.reduce((sum, currentValue) => {
          return currentValue.investment + sum;
        }, 0);
        let change =
          Math.round((10000 * (amount - investment)) / investment, 2) / 100;

        // setting states
        this.setState({
          Wallet: data,
          TotalAmount: amount,
          TotalInvestment: investment,
          TotalChangePct: change,
          MaxStockChange: object,
          MinStockChange: object2,
        });
        return data;
      })
      .then((data) => {
        if (data.length > 0) {
          this.setState({
            Loading: false,
            noData: false,
          });
        } else {
          this.setState({
            Loading: false,
            noData: true,
          });
        }
      });
  };

  walletChangeCallback = (msg) => {
    this.setState({
      Loading: true,
    });
    axios
      .get("http://localhost:8000/api/wallet/", {
        params: {
          owner: this.state.Owner,
        },
      })
      .then((resp) => resp.data)
      .then((data) => {
        //calculating higher
        var higher = Math.max.apply(
          Math,
          data.map(function (obj) {
            return obj.change_percent;
          })
        );
        var object = data.find(function (o) {
          return o.change_percent === higher;
        });

        // ... and min
        var min = Math.min.apply(
          Math,
          data.map(function (obj) {
            return obj.change_percent;
          })
        );
        var object2 = data.find(function (o) {
          return o.change_percent === min;
        });

        //calculating totals
        let amount = data.reduce((sum, currentValue) => {
          return currentValue.money_amount + sum;
        }, 0);
        let investment = data.reduce((sum, currentValue) => {
          return currentValue.investment + sum;
        }, 0);
        let change =
          Math.round((10000 * (amount - investment)) / investment, 2) / 100;

        // setting states
        this.setState({
          Wallet: data,
          TotalAmount: amount,
          TotalInvestment: investment,
          TotalChangePct: change,
          MaxStockChange: object,
          MinStockChange: object2,
        });
        return data;
      })
      .then((data) => {
        if (data.length > 0) {
          this.setState({
            Loading: false,
            noData: false,
          });
        } else {
          this.setState({
            Loading: false,
            noData: true,
          });
        }
      });
  };

  submitWalletItem = (e) => {
    e.preventDefault();
    // console.log(Stock, Amount, Investment, Broker, props.owner);
    axios
      .post("http://localhost:8000/api/wallet/", {
        stock_amount: this.state.stockAmount,
        symbol: this.state.stock,
        investment: this.state.investment,
        broker: this.state.broker,
        owner: this.state.Owner,
        buy_date: this.state.buy_date,
      })
      .then((resp) => {
        console.log(resp);
        if (resp.status === 201) {
          alert("Ação adicionada ao sua carteira");
        }
      })
      .then(() => {
        this.walletChangeCallback("item adicionado");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  componentDidUpdate() {
    if (this.state.updateRun) {
      axios
        .get(`http://localhost:8000/api/wallet/stocks/${this.state.Owner}`)
        .then((resp) => resp.data)
        .then((data) => {
          this.setState({
            stockData: data,
          });
        });
      this.setState({
        updateRun: false,
      });
    }
  }

  render() {
    const spinner = (
      <div className="d-flex justify-content-center">
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      </div>
    );

    const noDataContent = (
      <Container>
        <Row className="d-flex justify-content-center mt-2">
          <Card style={{ width: "65%" }} bg="dark" text="light">
            <Card.Header>
              <h3 className="d-flex justify-content-center">
                Ops, parece que não há itens nesta carteira, adicione seu
                primeiro item abaixo!
              </h3>
            </Card.Header>
            <Card.Body>
              <MDBContainer>
                <MDBRow className="d-flex justify-content-center">
                  <MDBCol md="6">
                    <form onSubmit={this.submitWalletItem}>
                      <div className="grey-text">
                        <MDBInput
                          label="Ativo Comprado"
                          icon=""
                          group
                          style={{ fontSize: "20px" }}
                          type="text"
                          onChange={(e) => {
                            this.setState({
                              stock: e.target.value.toUpperCase(),
                            });
                          }}
                        />
                        <div className="md-form">
                          <input
                            type="date"
                            name="transaction-date"
                            className="form-control"
                            id="transaction-date"
                            onChange={(e) =>
                              this.setState({ buy_date: e.target.value })
                            }
                            required
                          />
                        </div>
                        <MDBInput
                          label="Quantidade de Ações"
                          icon=""
                          style={{ fontSize: "20px" }}
                          group
                          type="text"
                          error="wrong"
                          success="right"
                          onChange={(e) => {
                            this.setState({ stockAmount: e.target.value });
                          }}
                        />
                        <MDBInput
                          label="Capital Investido"
                          icon=""
                          style={{ fontSize: "20px" }}
                          group
                          type="text"
                          onChange={(e) => {
                            this.setState({ investment: e.target.value });
                          }}
                        />

                        <Form.Group controlId="formBasicCheckbox">
                          <Form.Control
                            as="select"
                            custom
                            defaultValue=""
                            onChange={(e) => {
                              this.setState({ broker: e.target.value });
                            }}
                          >
                            <option value="" disabled>
                              Corretora da Operação
                            </option>
                            <option value="Ágora - Bradesco">Ágora</option>
                            <option value="Banco do Brasil">
                              Banco do Brasil
                            </option>
                            <option value="Itaú">Itaú</option>
                          </Form.Control>
                        </Form.Group>
                      </div>
                      <div className="text-center">
                        <MDBBtn type="submit">Enviar</MDBBtn>
                      </div>
                    </form>
                  </MDBCol>
                </MDBRow>
              </MDBContainer>
            </Card.Body>
          </Card>
        </Row>
      </Container>
    );

    const variant = "dark";
    const { Owner } = this.state;
    const { noData } = this.state;
    const { Loading } = this.state;
    const notChosen = Owner === "";

    return Owner === "" ? (
      <>
        <Container>
          <Row className="d-flex justify-content-center mt-2">
            <Card
              bg={variant.toLowerCase()}
              text={variant.toLowerCase() === "light" ? "dark" : "white"}
              style={{ width: "65%" }}
              className="mb-2"
            >
              <Card.Header>
                <h3 className="d-flex justify-content-center">
                  Selecionar Carteira
                </h3>
              </Card.Header>
              <Card.Body>
                {/* <Card.Title>{variant} Card Title </Card.Title> */}
                <Form>
                  <Form.Group controlId="formOwnerSelect">
                    <Form.Label>Proprietário</Form.Label>
                    <Form.Control
                      as="select"
                      custom
                      onChange={this.handleOwnerChange}
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Selecionar Carteira a ser mostrada
                      </option>
                      <option value="Ricardo">Ricardo</option>
                      <option value="Itala">Itala</option>
                      <option value="Thayssa">Thayssa</option>
                    </Form.Control>
                  </Form.Group>
                  {/* <Form.Group controlId="formSubmitBtn">
                    <div className="d-flex justify-content-center">
                      <MDBBtn type="submit" color="elegant">
                        Ver Carteira
                      </MDBBtn>
                    </div>
                  </Form.Group> */}
                </Form>
              </Card.Body>
            </Card>
          </Row>
        </Container>
      </>
    ) : notChosen ? (
      <div></div>
    ) : Loading ? (
      spinner
    ) : noData ? (
      noDataContent
    ) : (
      <Tab.Container id="left-tabs-example" defaultActiveKey="data-table">
        <Container fluid className="p-4">
          <Row>
            <Col sm={3}>
              <Row>
                <Col sm={12}>
                  <Card className="mb-3" bg="light" text="dark">
                    <Card.Body>
                      <Nav variant="pills" className="flex-column">
                        <Nav.Item>
                          <Nav.Link
                            style={{ color: "black", fontSize: "16px" }}
                            eventKey="highlights"
                          >
                            Destaques
                          </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                          <Nav.Link
                            style={{ color: "black", fontSize: "16px" }}
                            eventKey="data-table"
                          >
                            Itens da Carteira
                          </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                          <Nav.Link
                            style={{ color: "black", fontSize: "16px" }}
                            eventKey="transactions"
                          >
                            Transações
                          </Nav.Link>
                        </Nav.Item>
                      </Nav>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
              <Row>
                <Col sm={12}>
                  {this.state.stockData.length < 0 ? (
                    spinner
                  ) : (
                    <Card bg="light" text="dark" className="mb-3">
                      <Card.Body>
                        {this.state.stockData.map((item, index) => {
                          let colorClass =
                            item.change_percent > 0 ? "success" : "danger";
                          return (
                            <div key={index} className="mb-2">
                              <div className="d-flex w-100 justify-content-between">
                                <h5 className="mb-1">{item.symbol}</h5>
                                <p className="mb-1">
                                  R$ {item.price.toFixed(2)}
                                  <span
                                    className={`badge badge-${colorClass} ml-1 badge-pill`}
                                  >
                                    {item.change_percent.toFixed(2)} %
                                  </span>
                                </p>
                              </div>
                              <div className="d-flex w-100 justify-content-between">
                                <p className="mb-1">
                                  <small className="text-muted">
                                    {item.name}
                                  </small>
                                </p>
                                <p className="mb-1">
                                  <small className="text-muted">
                                    <a
                                      href={`/stock/${item.pk}`}
                                      className="text-muted"
                                    >
                                      Gráfico
                                      <i className="align-center ml-1 fas fa-external-link-alt fa-sm"></i>
                                    </a>
                                  </small>
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </Card.Body>
                    </Card>
                  )}
                </Col>
              </Row>
            </Col>
            <Col sm={9}>
              <Card className="mb-3" bg="light" text="dark">
                <Tab.Content>
                  <Tab.Pane eventKey="highlights">
                    <Row className="m-4">
                      <Col lg={4} xs={12}>
                        <InfoCard
                          title="Patrimônio"
                          description="Capital Investido: "
                          descriptionValue={this.state.TotalInvestment.toLocaleString(
                            "en-US",
                            {
                              style: "currency",
                              currency: "BRL",
                            }
                          )}
                          value={this.state.TotalAmount.toLocaleString(
                            "en-US",
                            {
                              style: "currency",
                              currency: "BRL",
                            }
                          )}
                          percentage={`${this.state.TotalChangePct} %`}
                          percentageValue={this.state.TotalChangePct}
                        />
                      </Col>
                      <Col lg={4} xs={12}>
                        <InfoCard
                          title="Maior Lucro"
                          description={this.state.MaxStockChange.stock.name.substr(
                            0,
                            18
                          )}
                          descriptionValue={`(${this.state.MaxStockChange.stock.symbol})`}
                          value={(
                            Math.round(
                              100 *
                                (this.state.MaxStockChange.money_amount -
                                  this.state.MaxStockChange.investment),
                              2
                            ) / 100
                          ).toLocaleString("en-US", {
                            style: "currency",
                            currency: "BRL",
                          })}
                          percentage={`
                  ${
                    Math.round(
                      10000 *
                        ((this.state.MaxStockChange.money_amount -
                          this.state.MaxStockChange.investment) /
                          this.state.MaxStockChange.investment),
                      2
                    ) / 100
                  } %`}
                          percentageValue={
                            Math.round(
                              10000 *
                                ((this.state.MaxStockChange.money_amount -
                                  this.state.MaxStockChange.investment) /
                                  this.state.MaxStockChange.investment),
                              2
                            ) / 100
                          }
                        />
                      </Col>
                      <Col lg={4} xs={12}>
                        <InfoCard
                          title="Maior Prejuízo"
                          description={this.state.MinStockChange.stock.name.substr(
                            0,
                            18
                          )}
                          descriptionValue={`(${this.state.MinStockChange.stock.symbol})`}
                          value={(
                            Math.round(
                              100 *
                                (this.state.MinStockChange.money_amount -
                                  this.state.MinStockChange.investment),
                              2
                            ) / 100
                          ).toLocaleString("en-US", {
                            style: "currency",
                            currency: "BRL",
                          })}
                          percentage={`
                  ${
                    Math.round(
                      10000 *
                        ((this.state.MinStockChange.money_amount -
                          this.state.MinStockChange.investment) /
                          this.state.MinStockChange.investment),
                      2
                    ) / 100
                  } %`}
                          percentageValue={
                            Math.round(
                              10000 *
                                ((this.state.MinStockChange.money_amount -
                                  this.state.MinStockChange.investment) /
                                  this.state.MinStockChange.investment),
                              2
                            ) / 100
                          }
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col sm={12} lg={5}>
                        <WalletAllocationChart
                          owner={this.state.Owner}
                          data={this.state.Wallet}
                        />
                      </Col>
                      <Col sm={12} lg={7}>
                        <WalletYield
                          owner={this.state.Owner}
                          data={this.state.Wallet}
                        />
                      </Col>
                    </Row>
                  </Tab.Pane>
                  <Tab.Pane eventKey="data-table">
                    <Col lg={12} xs={12}>
                      <WalletTable
                        cb={this.walletChangeCallback}
                        owner={this.state.Owner}
                        data={this.state.Wallet}
                      />
                    </Col>
                  </Tab.Pane>
                  <Tab.Pane eventKey="transactions">
                    <Col lg={12} xs={12}>
                      <TransactionsTable
                        cb={this.walletChangeCallback}
                        owner={this.state.Owner}
                        data={this.state.Wallet}
                      />
                    </Col>
                  </Tab.Pane>
                </Tab.Content>
              </Card>
            </Col>
          </Row>
        </Container>
      </Tab.Container>
    );
  }
}

export default WalletComponent;
