import React, { Component } from "react";
import { Row, Col, Button, Card } from "react-bootstrap";
import ProgressBarComponent from "./ProgressBarComponent";
import { Link } from "react-router-dom";
import "./StockTable.css";
import axios from "axios";
import Container from "react-bootstrap/Container";

// Função que atualiza as informações do ativo dado um ID

class FavoriteCard extends Component {
  constructor(props) {
    super(props);
    // creating States
    this.state = {
      isLoading: true,
      stocks: [],
      loadingProgress: 0,
      stocksId: [],
    };
    this.deleteHandler = this.deleteHandler.bind(this);
    this.favoriteHandler = this.favoriteHandler.bind(this);
  }

  favoriteHandler(e) {
    e.persist();

    if (e.target.classList.contains("btn-outline-info")) {
      e.target.classList.replace("btn-outline-info", "btn-info");
      e.target.firstChild.data = "Favoritar";
    } else {
      e.target.classList.replace("btn-info", "btn-outline-info");
      e.target.firstChild.data = "Desfavoritar";
    }
    axios
      .put("http://localhost:8000/api/stock/", {
        pk: parseInt(e.target.getAttribute("stockid")),
      })
      .then((resp) => {
        console.log(resp);
      });
  }

  deleteHandler(e) {
    axios
      .delete("http://localhost:8000/api/stock/", {
        pk: e.target.getAttribute("id"),
        hello: "hahah",
        asdhasi: "asoidhasu",
      })
      .then((resp) => {
        resp.status === 201
          ? alert("Ativo deletado com sucesso")
          : alert("Ops, houve algum erro");
      });
  }
  componentDidMount() {
    this.setState({
      isLoading: true,
    });
    axios
      .get("http://localhost:8000/api/stock/")
      .then((resp) => resp.data)
      .then((data) => {
        var itemsProcessed = 0;
        var stocksId = [];
        var stocks = [];

        if (this.props.favorite) {
          // CASO EM QUE QUEREMOS A TABELA DOS FAVORITOS
          data.forEach((stock) => {
            if (stock.favorite) {
              stocksId.push(stock.pk);
            }
          });
        }
        stocksId.forEach((id, index, array) => {
          axios
            .get(`http://localhost:8000/api/stock/update/${id}`)
            .then((resp) => resp.data.updated_stock)
            .then((stock) => {
              itemsProcessed++;
              stocks.push(stock);
              this.setState({
                loadingProgress: (100 * itemsProcessed) / array.length,
              });
            })
            .then(() => {
              if (itemsProcessed === array.length) {
                this.setState({
                  isLoading: false,
                  stocks: stocks,
                });
              }
            });
        });
      });
  }

  render() {
    // const size = this.props.favorite ? "xl" : "sm";
    const content = this.state.isLoading ? (
      // <Row className="mt-2">
      <Container>
        <Col style={{ width: "100%" }} sm={12}>
          <ProgressBarComponent loadingProgress={this.state.loadingProgress} />
        </Col>
      </Container>
    ) : // </Row>
    this.state.stocks.length > 0 ? (
      this.state.stocks.map((stock) => {
        let price = stock.price.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });
        // let change = (
        //   stock.price *
        //   (stock.change_percent / 100)
        // ).toLocaleString("pt-BR", {
        //   style: "currency",
        //   currency: "BRL",
        // });

        let colorClass;
        stock.change_percent > 0
          ? (colorClass = "success")
          : (colorClass = "danger");

        return (
          <div
            className="col-xl-3 col-lg-4 col-md-6 col-sm-12 p-3"
            key={stock.pk}
          >
            <Card className="">
              <Card.Body style={{ padding: "5px" }}>
                <Row>
                  <Col>
                    <Row>
                      <Col sm={12}>
                        <div
                          className={`badge bg-info z-depth-4 py-1 px-4 ml-4 mt-n2 rounded`}
                        >
                          <h4 className="text-white">{stock.symbol}</h4>
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col sm={12} className="d-flex justify-content-start">
                        <Button
                          size="sm"
                          variant="outline-info"
                          id={stock.pk}
                          onClick={this.deleteHandler}
                        >
                          <i className="fas fa-times fa-lg"></i>
                        </Button>
                        <Link className="" to={`/stock/${stock.pk}`}>
                          <Button size="sm" variant="outline-info">
                            <i className="fas fa-chart-line fa-lg"></i>
                          </Button>
                        </Link>
                      </Col>
                    </Row>
                    <Row>
                      <Col sm={12}>
                        <Button
                          className="ml-4"
                          size="sm"
                          onClick={this.favoriteHandler}
                          stockid={stock.pk}
                          variant={stock.favorite ? "outline-info" : "info"}
                        >
                          {stock.favorite ? "Desfavoritar" : "Favoritar"}
                        </Button>
                      </Col>
                    </Row>
                  </Col>
                  <Col>
                    <Row>
                      <Col sm={12}>
                        <p className="float-right text-uppercase text-white">
                          <small>{stock.name.substr(0, 32)}</small>
                        </p>
                      </Col>
                    </Row>
                    <Row>
                      <Col sm={12}>
                        <p className="float-right text-uppercase text-muted">
                          <small>Cotação</small>
                        </p>
                      </Col>
                    </Row>
                    <Row>
                      <Col sm={12}>
                        <h4 className="d-flex font-weight-bold float-right text-uppercase text-white">
                          {price}
                          <span
                            className={`badge badge-pill ml-1 badge-${colorClass}`}
                          >
                            {stock.change_percent}%
                          </span>
                        </h4>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </div>
        );
      })
    ) : (
      <div> Você não possui ações favoritas</div>
    );
    return <>{content}</>;
  }
}

export default FavoriteCard;
