import React from "react";
import ReactApexChart from "react-apexcharts";

class WalletYield extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      options: {
        chart: {
          type: "bar",
          height: 250,
        },
        plotOptions: {
          bar: {
            horizontal: false,
            dataLabels: {
              position: "top",
            },
          },
        },
        dataLabels: {
          enabled: true,
          offsetX: -6,
          formatter: function (val) {
            return Math.round(val * 100, 2) / 100 + "%";
          },
          style: {
            fontSize: "12px",
            colors: ["#fff"],
          },
        },
        stroke: {
          show: true,
          width: 1,
          colors: ["#fff"],
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
          text: "Comparativo - Ibovespa/Carteira",
          align: "center",
          style: {
            fontFamily: "Oswald",
            fontSize: "22px",
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
    var ser1 = [];
    var ser2 = [];
    this.props.data.forEach((item) => {
      ser1.push(item.change_percent);
      ser2.push(item.ibovespa_change);
      lab.push(item.stock.symbol);
    });
    this.setState({
      series: [
        { name: "Rendimento", data: ser1 },
        { name: "Ibovespa", data: ser2 },
      ],
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
          type="bar"
        />
      </div>
    );
  }
}

export default WalletYield;
