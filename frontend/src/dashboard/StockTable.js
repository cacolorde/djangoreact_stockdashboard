import React, { Component } from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import "./StockTable.css";
import axios from "axios";
import ProgressBarComponent from "./ProgressBarComponent";
import { baseURL } from "../global/URL";

// Função que atualiza as informações do ativo dado um ID

class StockTable extends Component {
  constructor(props) {
    super(props);
    // creating States
    this.state = {
      isLoading: true,
      stocks: [],
      loadingProgress: 0,
      stocksId: [],
    };
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
      .put(`${baseURL}/api/stock/`, {
        pk: parseInt(e.target.getAttribute("stockid")),
      })
      .then((resp) => {
        console.log(resp);
      });
  }

  componentDidMount() {
    this.setState({
      isLoading: true,
    });
    axios
      .get(`${baseURL}/api/stock/`)
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
        } else {
          data.forEach((stock) => {
            if (!stock.favorite) {
              stocksId.push(stock.pk);
              // console.log(stock);
            }
          });
        }
        stocksId.forEach((id, index, array) => {
          // console.log(id);
          axios
            .get(`${baseURL}/api/stock/update/${id}`)
            .then((resp) => resp.data.updated_stock)
            .then((stock) => {
              // console.log(stock);
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
    const content = this.state.isLoading ? (
      <ProgressBarComponent loadingProgress={this.state.loadingProgress} />
    ) : (
      <Table className="text-dark" size="sm" striped responsive>
        <thead>
          <tr className="text-center">
            <th style={{ width: "20%" }}>Ativo</th>
            <th style={{ width: "20%" }}>Preço</th>
            <th style={{ width: "20%" }}>Variação(%)</th>
            <th style={{ width: "20%" }}>Variação(R$)</th>
            <th style={{ width: "15%" }}></th>
            <th style={{ width: "5%" }}></th>
          </tr>
        </thead>
        <tbody>
          {this.state.stocks.map((stock) => {
            let price = stock.price.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            });
            let change = (
              stock.price *
              (stock.change_percent / 100)
            ).toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            });

            let colorClass;
            stock.change_percent > 0
              ? (colorClass = "success")
              : (colorClass = "danger");

            return (
              <tr className="text-center" key={stock.pk}>
                <td style={{ fontSize: "18px" }} className="align-middle">
                  {stock.symbol}
                </td>
                <td style={{ fontSize: "18px" }} className="align-middle">
                  {price}
                </td>
                <td className="align-middle">
                  <span
                    style={{ fontSize: "15px" }}
                    className={`badge-${colorClass} badge-pill align-middle`}
                  >
                    {stock.change_percent}%
                  </span>
                </td>
                <td style={{ fontSize: "15px" }} className={`align-middle`}>
                  {change}
                </td>
                <td style={{ fontSize: "15px" }} className="align-middle">
                  <Link to={`/stock/${stock.pk}`}>
                    <Button size="sm" variant="outline-info">
                      Gráfico
                    </Button>
                  </Link>
                </td>
                <td style={{ fontSize: "18px" }}>
                  <Button
                    className="float-left"
                    onClick={this.favoriteHandler}
                    size="sm"
                    stockid={stock.pk.toString()}
                    variant={stock.favorite ? "outline-info" : "info"}
                  >
                    {stock.favorite ? "Desfavoritar" : "Favoritar"}
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    );
    return <>{content}</>;
  }
}

export default StockTable;
