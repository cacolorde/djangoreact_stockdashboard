import React from "react";
import ReactApexChart from "react-apexcharts";

class WalletAllocationChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      options: {
        chart: {
          type: "donut",
          height: "250px",
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
                    let amount = parseFloat(val).toLocaleString("en-US", {
                      style: "currency",
                      currency: "BRL",
                    });
                    return `${amount}`;
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
          "#E91E63",
          "#FF9800",
          "#00B746",
          "#EF403C",
          "#3D3D3D",
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
      series: [],
    };
  }

  componentDidMount() {
    var lab = [];
    var ser = [];
    this.props.data.forEach((item) => {
      ser.push(item.money_amount);
      lab.push(item.stock.symbol);
    });
    this.setState({
      series: ser,
      options: {
        labels: lab,
      },
    });
  }

  render() {
    return (
      <div id="chart">
        <ReactApexChart
          options={this.state.options}
          series={this.state.series}
          type="donut"
        />
      </div>
    );
  }
}

export default WalletAllocationChart;
