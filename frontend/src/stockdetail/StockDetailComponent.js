import React from "react";
import { Table, Row, Col, Card, Container, Spinner } from "react-bootstrap";
import ReactApexChart from "react-apexcharts";
import axios from "axios";

class StockDetailComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Indicators: undefined,
      Dataset2: [],
      Dataset: [],
      Date: [],
      Price: [],
      Options: {},
      Series: [],
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
  }

  componentDidMount() {
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
      .get(`http://localhost:8000/api/stock/get/${this.props.match.params.id}`)
      .then((resp) => resp.data)
      .then((data) => {
        name = data.name;
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
            xaxis: {
              type: "datetime",
            },
            yaxis: {
              tooltip: {
                enabled: true,
              },
            },
          },
        });
      });
  }

  render() {
    const content =
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
                    <th style={{ fontSize: "18px" }}>
                      <strong>Limite</strong>
                    </th>
                    <th style={{ fontSize: "18px" }}>
                      <strong>Valor</strong>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.Indicators.resistances.map((value, index) => {
                    return (
                      <tr key={index}>
                        <td>Resistencia {index + 1}</td>
                        <td>R$ {value}</td>
                      </tr>
                    );
                  })}
                  {this.state.Indicators.supports.map((value, index) => {
                    return (
                      <tr key={index}>
                        <td>Suportes {index + 1}</td>
                        <td>R$ {value}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </Col>
          </Row>
        </Card.Body>
      );
    return (
      <Container fluid>
        <Row className="mt-4">
          <Col xl={8} lg={9} sm={12} className="mb-4">
            <Row>
              <Col sm={12}>
                <Card bg="light" id="chart">
                  <ReactApexChart
                    options={this.state.Options}
                    series={this.state.Series}
                    type="candlestick"
                    height="500"
                  />
                </Card>
              </Col>
            </Row>
            <Row>
              <Col className="mt-4" xs={12}>
                <Card bg="light">
                  <Card.Header>Indicadores</Card.Header>
                  {content}
                </Card>
              </Col>
            </Row>
          </Col>
          <Col xl={4} lg={3} sm={12}>
            <Card bg="light">
              <Table>
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
      </Container>
    );
  }
}

export default StockDetailComponent;
