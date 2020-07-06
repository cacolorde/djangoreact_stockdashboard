import React from "react";
import { Row, Col, Table, Card, Container } from "react-bootstrap";
import ReactApexChart from "react-apexcharts";
import axios from "axios";

class IbovespaComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Dataset: [],
      Date: [],
      Price: [],
      Options: {},
      Series: [],
    };
  }

  componentDidMount() {
    let dataset = [];
    let series = [];
    let dates = [];
    let closePrices = [];
    // let name;
    axios
      .get(`http://localhost:8000/api/index/historical/`, {
        params: {
          name: "Bovespa",
        },
      })
      .then((resp) => resp.data)
      .then((data) => {
        // name = data.name;
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
          Dataset: dataset,
          Date: dates,
          Price: closePrices,
          Series: [{ data: series }],
          Options: {
            chart: {
              type: "candlestick",
              height: 550,
            },
            // title: {
            //   text: "Ibovespa",
            //   align: "center",
            // },
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
    return (
      <Container fluid>
        <Row className="mt-4">
          <Col xl={8} lg={9} sm={12}>
            <Card bg="light" id="chart" className="mb-4">
              <Card.Header style={{ fontSize: "20px" }}>
                Gráfico histórico do índice Ibovespa
              </Card.Header>
              <Card.Body>
                <ReactApexChart
                  options={this.state.Options}
                  series={this.state.Series}
                  type="candlestick"
                  height="500"
                />
              </Card.Body>
            </Card>
          </Col>
          <Col xl={4} lg={3} sm={12}>
            <Card bg="light">
              <Card.Header style={{ fontSize: "20px" }}>
                Tabela com os valores do gráfico
              </Card.Header>
              <Card.Body>
                <Table>
                  <thead>
                    <tr className="text-center">
                      <th style={{ width: "20%" }}>Ibovespa</th>
                      <th style={{ width: "20%" }}>Índice</th>
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
                          <td>{item.close} Pts</td>
                          <td className={`text-${colorClass}`}>
                            {item.change_percent}%
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default IbovespaComponent;
