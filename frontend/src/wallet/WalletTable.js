import React, { Fragment } from "react";
import { Form, Table } from "react-bootstrap";
import {
  MDBBtn,
  MDBModal,
  MDBModalBody,
  MDBModalHeader,
  MDBModalFooter,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBInput,
} from "mdbreact";
import axios from "axios";

const WalletTable = (props) => {
  const [ModalEdit, setModalEdit] = React.useState(false);
  const [ModalAdd, setModalAdd] = React.useState(false);
  const [Stock, setStock] = React.useState("");
  const [Amount, setAmount] = React.useState(0);
  const [Investment, setInvestment] = React.useState(0);
  const [Broker, setBroker] = React.useState("");
  const [EditId, setEditId] = React.useState(0);
  const [BuyDate, setBuyDate] = React.useState("");

  React.useEffect(() => {}, []);
  const handleStockAmountChange = (e) => {
    setAmount(parseInt(e.target.value));
  };

  const handleStockChange = (e) => {
    setStock(e.target.value.toUpperCase());
  };

  const handleInvestmentChange = (e) => {
    setInvestment(parseFloat(e.target.value));
  };

  const handleBrokerChange = (e) => {
    setBroker(e.target.value);
  };

  const toggleModalAdd = () => {
    setModalAdd(!ModalAdd);
  };

  const toggleModalEdit = (e) => {
    let id = parseInt(e.target.getAttribute("id"));
    // var obj = props.data.find(function (o) {
    //   return o.pk === id;
    // });
    setEditId(id);
    setModalEdit(!ModalEdit);
    // ModalEdit ? console.log("closed") : console.log("opened");
  };

  const deleteWalletItem = (e) => {
    let id = parseInt(e.target.getAttribute("id"));
    var object = props.data.find(function (o) {
      return o.pk === id;
    });
    window.confirm(
      `Deseja mesmo excluir o item ${object.stock.name} (${object.stock.symbol}) da sua carteira?`
    )
      ? axios
          .delete("http://localhost:8000/api/wallet/", {
            params: {
              pk: e.target.getAttribute("id"),
            },
          })
          .then((resp) => {
            resp.status === 201
              ? alert("Ativo deletado com sucesso")
              : alert("Ops, houve algum erro");
          })
          .then(() => {
            props.cb("item excluído");
          })
      : console.log("Cancelado");
  };

  const editWalletItem = (e) => {
    e.preventDefault();
    axios
      .put("http://localhost:8000/api/wallet/", {
        pk: EditId,
        stock_amount: Amount,
        investment: Investment,
      })
      .then((resp) => {
        alert("Item Editado com sucesso");
        console.log(resp);
        props.cb("item editado");
      });
  };

  const submitWalletItem = (e) => {
    e.preventDefault();
    // console.log(Stock, Amount, Investment, Broker, props.owner);
    axios
      .post("http://localhost:8000/api/wallet/", {
        stock_amount: Amount,
        symbol: Stock,
        investment: Investment,
        broker: Broker,
        owner: props.owner,
        buy_date: BuyDate,
      })
      .then((resp) => {
        console.log(resp);
        if (resp.status === 201) {
          alert("Ação adicionada ao sua carteira");
        }
      })
      .then(() => {
        props.cb("item adicionado");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <div className="d-flex justify-content-between mb-2">
        <h4 className="d-flex flex-column justify-content-center">
          Ativos na carteira
        </h4>
        <Fragment>
          <MDBBtn onClick={toggleModalAdd} color="elegant">
            Adicionar Ativo
          </MDBBtn>
        </Fragment>
      </div>
      <Table className="text-dark" size="sm" striped responsive>
        <thead>
          <tr className="text-center">
            <th></th>
            <th>Corretora</th>
            <th>Proprietário</th>
            <th>Ativo</th>
            <th>Preço de Compra</th>
            <th>Quantidade</th>
            <th>Investimento</th>
            <th>Preço Atual</th>
            <th>Patrimônio</th>
            <th>Desempenho(%)</th>
            <th>Desempenho(R$)</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {props.data.map((item, index, array) => {
            let change_percent =
              Math.round(
                ((item.money_amount - item.investment) * 10000) /
                  item.investment
              ) / 100;
            let colorClass = change_percent > 0 ? "success" : "danger";
            return (
              <tr
                key={index}
                className="text-center"
                // onClick={editWalletItem}
              >
                <td className="align-middle">
                  <i
                    style={{ cursor: "pointer" }}
                    onClick={toggleModalEdit}
                    id={item.pk}
                    className="fas fa-edit align-middle"
                  ></i>
                </td>
                <td className="align-middle">{item.broker}</td>
                <td className="align-middle">{item.owner}</td>
                <td className="align-middle">{`${item.stock.name} (${item.stock.symbol})`}</td>
                <td className="align-middle">
                  {item.buy_price.toLocaleString("en-US", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </td>
                <td className="align-middle">{item.stock_amount}</td>
                <td className="align-middle">
                  {item.investment.toLocaleString("en-US", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </td>
                <td className="align-middle">
                  {item.stock.price.toLocaleString("en-US", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </td>
                <td className="align-middle">
                  {item.money_amount.toLocaleString("en-US", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </td>
                <td className="align-middle">
                  <span className={`badge-pill badge-${colorClass}`}>
                    {change_percent} %
                  </span>
                </td>
                <td className={`align-middle text-${colorClass}`}>
                  {(item.money_amount - item.investment).toLocaleString(
                    "en-US",
                    {
                      style: "currency",
                      currency: "BRL",
                    }
                  )}
                </td>
                <td className="align-middle">
                  <i
                    style={{ cursor: "pointer" }}
                    id={item.pk}
                    onClick={deleteWalletItem}
                    className="align-middle fas fa-times"
                  ></i>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>

      {/* ADD MODAL */}

      <MDBModal isOpen={ModalAdd} toggle={toggleModalAdd}>
        <MDBModalHeader toggle={toggleModalAdd}>
          Custódia de Ações
        </MDBModalHeader>
        <MDBModalBody>
          <MDBContainer>
            <MDBRow className="d-flex justify-content-center">
              <MDBCol md="6">
                <form onSubmit={submitWalletItem}>
                  <div className="grey-text">
                    <MDBInput
                      label="Ativo Comprado"
                      icon=""
                      group
                      style={{ fontSize: "20px" }}
                      type="text"
                      onChange={handleStockChange}
                    />
                    <div className="md-form">
                      <input
                        type="date"
                        name="transaction-date"
                        className="form-control"
                        id="transaction-date"
                        onChange={(e) => setBuyDate(e.target.value)}
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
                      onChange={handleStockAmountChange}
                    />
                    <MDBInput
                      label="Capital Investido"
                      icon=""
                      style={{ fontSize: "20px" }}
                      group
                      type="text"
                      onChange={handleInvestmentChange}
                    />

                    <Form.Group controlId="formBasicCheckbox">
                      <Form.Control
                        as="select"
                        custom
                        defaultValue=""
                        onChange={handleBrokerChange}
                      >
                        <option value="" disabled>
                          Corretora da Operação
                        </option>
                        <option value="Ágora - Bradesco">Ágora</option>
                        <option value="Banco do Brasil">Banco do Brasil</option>
                        <option value="Itaú">Itaú</option>
                      </Form.Control>
                    </Form.Group>
                  </div>
                  <div className="text-center">
                    <MDBBtn type="submit" onClick={toggleModalAdd}>
                      Adicionar
                    </MDBBtn>
                  </div>
                </form>
              </MDBCol>
            </MDBRow>
          </MDBContainer>
        </MDBModalBody>
        <MDBModalFooter>
          <MDBBtn
            type="button"
            color="outline-elegant"
            onClick={toggleModalAdd}
          >
            Fechar
          </MDBBtn>
        </MDBModalFooter>
      </MDBModal>

      {/* EDIT MODAL */}
      <MDBModal isOpen={ModalEdit} toggle={toggleModalEdit}>
        <MDBModalHeader id="editModalHeader" toggle={toggleModalEdit}>
          Editando item da carteira
        </MDBModalHeader>
        <MDBModalBody>
          <MDBContainer>
            <MDBRow className="d-flex justify-content-center">
              <MDBCol md="6">
                <form onSubmit={editWalletItem}>
                  <div className="grey-text">
                    <MDBInput
                      label="Quantidade de Ações"
                      icon=""
                      style={{ fontSize: "20px" }}
                      group
                      type="text"
                      error="wrong"
                      success="right"
                      onChange={handleStockAmountChange}
                    />
                    <MDBInput
                      label="Capital Investido"
                      icon=""
                      style={{ fontSize: "20px" }}
                      group
                      type="text"
                      onChange={handleInvestmentChange}
                    />
                  </div>
                  <div className="text-center">
                    <MDBBtn type="submit">Confirmar Edição</MDBBtn>
                  </div>
                </form>
              </MDBCol>
            </MDBRow>
          </MDBContainer>
        </MDBModalBody>
        <MDBModalFooter>
          <MDBBtn
            type="button"
            color="outline-elegant"
            onClick={toggleModalEdit}
          >
            Fechar
          </MDBBtn>
        </MDBModalFooter>
      </MDBModal>
    </>
  );
};

export default WalletTable;
