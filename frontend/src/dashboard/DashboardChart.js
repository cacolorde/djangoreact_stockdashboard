import React from "react";
import ReactApexChart from "react-apexcharts";
import axios from "axios";

class DashboardChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      series: [],
      options: {
        chart: {
          type: "bar",
          height: 350,
        },
        plotOptions: {
          bar: {
            colors: {
              ranges: [
                {
                  from: -100,
                  to: 0,
                  color: "#F15B46",
                },
                {
                  from: 0.00000001,
                  to: 100,
                  color: "#10a11f",
                },
              ],
            },
            columnWidth: "100%",
          },
        },
        dataLabels: {
          enabled: true,
        },
        yaxis: {
          title: {
            text: "Variação",
          },
          labels: {
            formatter: function (y) {
              return y.toFixed(2) + "%";
            },
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
    axios
      .get("http://localhost:8000/api/stock/")
      .then((resp) => resp.data)
      .then((data) => {
        let ser = [];
        let lab = [];
        data.forEach((stock, index) => {
          ser.push(stock.change_percent);
          lab.push(stock.symbol);
        });
        this.setState({
          series: [{ name: "Variação", data: ser }],
          options: {
            labels: lab,
          },
        });
      });
  }
  render() {
    return (
      <div id="chart">
        <ReactApexChart
          series={this.state.series}
          options={this.state.options}
          type="bar"
        />
      </div>
    );
  }
}

export default DashboardChart;
