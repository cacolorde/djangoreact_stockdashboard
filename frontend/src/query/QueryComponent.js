import React from "react";
import {
  Button,
  Container,
  Col,
  Row,
  Card,
  Table,
  Form,
  Spinner,
} from "react-bootstrap";
import { MDBInput } from "mdbreact";
import axios from "axios";
import ReactApexChart from "react-apexcharts";
import { baseURL } from "../global/URL";

class QueryComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      symbol: "",
      Dataset: [],
      Date: [],
      Price: [],
      Options: {},
      Series: [],
      loadedContent: false,
      loadingContent: false,
      Options2: {
        labels: ["Compra", "Neutro", "Venda"],
        chart: {
          type: "donut",
        },
        animations: {
          enabled: true,
          easing: "easeinout",
          speed: 800,
          animateGradually: {
            enabled: true,
            delay: 150,
          },
          dynamicAnimation: {
            enabled: true,
            speed: 350,
          },
        },
        title: {
          text: "Distribuição da carteira",
          align: "center",
          style: {
            fontFamily: "Oswald",
            fontSize: "22px",
          },
        },
        plotOptions: {
          pie: {
            donut: {
              labels: {
                show: true,
                name: {
                  show: true,
                  fontFamily: "Oswald",
                  fontSize: "26px",
                },
                value: {
                  show: true,
                  fontSize: "26px",
                  fontFamily: "Oswald",
                  formatter: function (val) {
                    return `${val} indicadores`;
                  },
                },
              },
            },
          },
        },
        legend: {
          show: true,
          position: "bottom",
        },
        colors: [
          "#2E93fA",
          "#66DA26",
          "#546E7A",
          // "#E91E63",
          // "#FF9800",
          // "#00B746",
          // "#EF403C",
          // "#3D3D3D",
        ],
        dataLabels: {
          enabled: true,
          formatter: function (val) {
            return Math.round(val * 100, 2) / 100 + "%";
          },
        },
        responsive: [
          {
            breakpoint: 1000,
            options: {
              chart: {
                height: 400,
              },
              yaxis: {
                show: false,
              },
              xaxis: {
                labels: {
                  show: false,
                },
              },
            },
          },
        ],
      },
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSymbolChange = this.handleSymbolChange.bind(this);
  }

  componentDidMount() {}

  handleSymbolChange(e) {
    // console.log(e.target.value);
    this.setState({
      symbol: e.target.value,
    });
  }

  handleSubmit(e) {
    this.setState({ loadingContent: true });
    e.preventDefault();
    let dataset = [];
    let series = [];
    let dates = [];
    let closePrices = [];
    let name;
    let indicators;
    let buy = 0;
    let sell = 0;
    let neutral = 0;
    axios
      .get(`${baseURL}/api/query/`, {
        params: {
          symbol: this.state.symbol,
        },
      })
      .then((resp) => resp.data)
      .then((data) => {
        name = this.state.symbol.toLocaleUpperCase();
        indicators = data.indicator;
        indicators.momentum.forEach((item) => {
          if (item.indicator !== "Highs/Lows(14)") {
            if (item.signal === "buy") {
              buy = buy + 1;
            } else if (item.signal === "sell") {
              sell = sell + 1;
            } else {
              neutral = neutral + 1;
            }
          }
        });
        if (indicators.ema_signal === "buy") {
          buy = buy + 1;
        } else if (indicators.ema_signal === "sell") {
          sell = sell + 1;
        } else {
          neutral = neutral + 1;
        }
        console.log(data);
        data.data.historical.forEach((item, index, array) => {
          dates.push(item.date);
          closePrices.push(item.close);
          let change_percent = 0;
          if (index !== array.length - 1) {
            change_percent =
              Math.round(
                (((item.close - array[index + 1].close) * 100) /
                  array[index + 1].close) *
                  100,
                2
              ) / 100;
          }
          series.unshift({
            x: item.date,
            y: [item.open, item.high, item.low, item.close],
          });
          dataset.push({
            date: item.date,
            close: item.close,
            change_percent: change_percent,
          });
        });
        // setLoadingProgress(90);
        // setLoading(false);
      })
      .then(() => {
        console.log(series);
        this.setState({
          Dataset2: [buy, neutral, sell],
          Indicators: indicators,
          Dataset: dataset,
          Date: dates,
          Price: closePrices,
          Series: [{ data: series }],
          Options: {
            chart: {
              type: "candlestick",
              height: 550,
            },
            title: {
              text: name,
              align: "left",
            },
            yaxis: {
              tooltip: {
                enabled: true,
              },
            },
            responsive: [
              {
                breakpoint: 1000,
                options: {
                  chart: {
                    height: 400,
                  },
                  yaxis: {
                    show: true,
                  },
                  xaxis: {
                    labels: {
                      show: false,
                    },
                  },
                },
              },
            ],
          },
        });
      })
      .then(() => {
        this.setState({
          loadedContent: true,
          loadingContent: false,
        });
      });
  }

  render() {
    const content2 =
      this.state.Indicators === undefined ? (
        <div className="d-flex justiy-content-center">
          <Spinner></Spinner>
        </div>
      ) : (
        <Card.Body>
          <Row>
            <Col lg={6} sm={12}>
              <ReactApexChart
                options={this.state.Options2}
                series={this.state.Dataset2}
                type="donut"
                height="500"
              />
            </Col>
            <Col lg={6} sm={12}>
              <Table>
                <thead>
                  <tr>
                    <th className="text-center" style={{ fontSize: "18px" }}>
                      <strong>Limite</strong>
                    </th>
                    <th className="text-center" style={{ fontSize: "18px" }}>
                      <strong>Valor</strong>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.Indicators.resistances.map((value, index) => {
                    return (
                      <tr key={index}>
                        <td className="text-center">Resistencia {index + 1}</td>
                        <td className="text-center">R$ {value}</td>
                      </tr>
                    );
                  })}
                  {this.state.Indicators.supports.map((value, index) => {
                    return (
                      <tr key={index}>
                        <td className="text-center">Suportes {index + 1}</td>
                        <td className="text-center">R$ {value}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </Col>
          </Row>
        </Card.Body>
      );
    const spinner = (
      <Spinner animation="border" role="status">
        <span className="sr-only">Loading...</span>
      </Spinner>
    );
    const content = (
      <Row className="">
        <Col xl={8} lg={9} sm={12}>
          <Row>
            <Col sm={12}>
              <Card id="chart" bg="light" className="mb-2">
                <ReactApexChart
                  options={this.state.Options}
                  series={this.state.Series}
                  type="candlestick"
                  height="500"
                  className=""
                />
              </Card>
            </Col>
          </Row>
          <Row>
            <Col className="mt-2" xs={12}>
              <Card bg="light">
                <Card.Header>Indicadores</Card.Header>
                {content2}
              </Card>
            </Col>
          </Row>
        </Col>
        <Col className="mt-2" xl={4} lg={3} sm={12}>
          <Card bg="light">
            <Table striped>
              <thead>
                <tr className="text-center">
                  <th style={{ width: "20%" }}>Ativo</th>
                  <th style={{ width: "20%" }}>Preço</th>
                  <th style={{ width: "20%" }}>Variação(%)</th>
                </tr>
              </thead>
              <tbody>
                {this.state.Dataset.map((item, index) => {
                  let colorClass =
                    item.change_percent > 0 ? "success" : "danger";
                  return (
                    <tr key={index} className="text-center">
                      <td>{item.date}</td>
                      <td>R$ {item.close}</td>
                      <td className={`text-${colorClass}`}>
                        {item.change_percent}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Card>
        </Col>
      </Row>
    );
    const variant = "dark";
    return (
      <Container fluid>
        <Row className="justify-content-center mt-3">
          <Card
            bg={variant.toLowerCase()}
            text={variant.toLowerCase() === "light" ? "dark" : "white"}
            style={{ width: "65%" }}
            className="mb-2"
          >
            <Card.Header>
              <h3 className="d-flex justify-content-center">Procurar</h3>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={this.handleSubmit}>
                <Form.Group controlId="symbol">
                  <MDBInput
                    label="Insira a sigla da ação a ser visualizada aqui"
                    icon=""
                    style={{ fontSize: "20px", color: "white" }}
                    group
                    type="text"
                    error="wrong"
                    success="right"
                    onChange={this.handleSymbolChange}
                  />
                </Form.Group>
                <div className="d-flex justify-content-center">
                  <Button variant="primary" type="submit">
                    Adicionar
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Row>
        {this.state.loadedContent ? (
          content
        ) : this.state.loadingContent ? (
          <div className="d-flex justify-content-center">{spinner}</div>
        ) : (
          ""
        )}
      </Container>
    );
  }
}

export default QueryComponent;
