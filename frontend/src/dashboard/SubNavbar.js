import React, { Component } from "react";
import { Card, Col, Badge } from "react-bootstrap";
import axios from "axios";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { baseURL } from "../global/URL";

class SubNavbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      indexes: [
        {
          name: "Bovespa",
          country: "brazil",
        },
        {
          name: "S&P 500",
          country: "united states",
        },
        {
          name: "Nasdaq",
          country: "united states",
        },
        {
          name: "Dow 30",
          country: "united states",
        },
      ],
      data2: [],
      forexes: [
        {
          name: "USD",
        },
        {
          name: "EUR",
        },
        {
          name: "GBP",
        },
      ],
    };
  }

  componentDidMount() {
    var itemsProcessed = 0;
    var itemsProcessed2 = 0;
    var data1 = [];
    var data2 = [];
    this.state.indexes.forEach((item, index, array) => {
      axios
        .get(`${baseURL}/api/index/get/`, {
          params: { name: item.name, country: item.country },
        })
        .then((resp) => {
          itemsProcessed = itemsProcessed + 1;
          // console.log(resp.data.object);
          data1.push(resp.data.object);
        })
        .then(() => {
          if (itemsProcessed === array.length) {
            this.setState({ data: data1 });
          }
        });
    });
    this.state.forexes.forEach((item, index, array) => {
      axios
        .get(`${baseURL}/api/forex/get/`, {
          params: { name: item.name },
        })
        .then((resp) => {
          itemsProcessed2 = itemsProcessed2 + 1;
          // console.log(resp.data.object);
          data2.push(resp.data.object);
        })
        .then(() => {
          if (itemsProcessed2 === array.length) {
            this.setState({ data2: data2 });
          }
        });
    });
  }

  render() {
    const settings = {
      className: "mt-2",
      dots: true,
      infinite: true,
      speed: 1500,
      slidesToShow: 4,
      slidesToScroll: 3,
      // autoplay: false,
      autoplaySpeed: 3200,
      responsive: [
        {
          breakpoint: 1600,
          settings: {
            slidesToShow: 3,
          },
        },
        {
          breakpoint: 1000,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            autoplaySpeed: 1500,
            speed: 500,
          },
        },
      ],
    };

    return (
      <Slider {...settings}>
        {this.state.data.map((object, index) => {
          let colorClass = object.change_percent > 0 ? "success" : "danger";
          return (
            <Col key={`${index}`}>
              <Card
                bg="light"
                text="dark"
                className="z-depth-4 default-color mb-2"
              >
                <Card.Body>
                  <div className="d-flex justify-content-around">
                    <h5 className="float-left">{object.name}</h5>
                    <div className="d-flex justify-content-end">
                      <h5>
                        {object.price}
                        <Badge pill variant={colorClass} className="ml-2">
                          {object.change_percent}%
                        </Badge>
                      </h5>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
        {this.state.data2.map((object, index) => {
          let colorClass = object.change_percent > 0 ? "success" : "danger";
          return (
            <Col key={`${index}`}>
              <Card
                bg="light"
                text="dark"
                className="z-depth-4 default-color mb-2"
              >
                <Card.Body>
                  <div className="d-flex justify-content-around">
                    <h5 className="float-left">{object.name}</h5>
                    <div className="d-flex justify-content-end">
                      <h5>
                        R$ {object.price.toFixed(3)}
                        <Badge pill variant={colorClass} className="ml-2">
                          {object.change_percent}%
                        </Badge>
                      </h5>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Slider>
    );
  }
}

export default SubNavbar;
