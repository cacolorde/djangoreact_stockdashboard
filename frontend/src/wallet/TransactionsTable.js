import React, { Fragment } from "react";
import {
  MDBBtn,
  MDBBadge,
  MDBInput,
  MDBModal,
  MDBModalBody,
  MDBModalHeader,
  MDBRow,
  MDBCol,
  MDBContainer,
  MDBModalFooter,
} from "mdbreact";
import { Form, Table } from "react-bootstrap";
import axios from "axios";
import { baseURL } from "../global/URL";

class TransactionsTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Broker: "",
      Operation: "",
      Stock: "",
      Date: "",
      Document: "",
      Data: "",
      ModalAdd: false,
    };
    this.submitTransactionItem = this.submitTransactionItem.bind(this);
    this.deleteTransactionItem = this.deleteTransactionItem.bind(this);
  }
  deleteTransactionItem = (e) => {
    var id = parseInt(e.target.getAttribute("id"));
    if (!window.confirm("Deseja mesmo excluir essa transação?")) {
      return 0;
    }
    axios
      .delete(`${baseURL}/api/transaction/`, {
        params: {
          pk: id,
        },
      })
      .then((resp) => resp.data)
      .then((data) => {
        this.props.cb("item deletado");
      });
  };
  submitTransactionItem = (e) => {
    e.preventDefault();
    const uploadData = new FormData();
    uploadData.append("broker", this.state.Broker);
    uploadData.append("operation", this.state.Operation);
    uploadData.append("date", this.state.Date);
    uploadData.append("document", this.state.Document);
    uploadData.append("stock", this.state.Stock.toUpperCase());
    uploadData.append("owner", this.props.owner);

    axios
      .post(`${baseURL}/api/transaction/`, uploadData)
      .then((resp) => resp.data)
      .then((data) => {
        console.log(data);
      })
      .then(() => {
        this.props.cb("item adicionado");
      });
  };
  componentDidMount() {
    axios
      .get(`${baseURL}/api/transaction/`, {
        params: {
          owner: this.props.owner,
        },
      })
      .then((resp) => resp.data)
      .then((data) => {
        console.log(data);
        this.setState({
          Data: data,
        });
      });
  }
  render() {
    const content =
      this.state.Data.length === 0 ? (
        <tr>
          <td>Loading</td>
        </tr>
      ) : (
        this.state.Data.map((item, index) => {
          let colorClass =
            item.operation === "Compra"
              ? "default"
              : item.operation === "Venda"
              ? "secondary"
              : "primary";
          return (
            <tr key={index}>
              <td className="text-center align-middle">{item.date}</td>
              <td className="text-center align-middle">{item.broker}</td>
              <td className="text-center align-middle">
                <MDBBadge color={colorClass}>
                  <span style={{ fontWeight: "normal", fontSize: "14.4px" }}>
                    {item.operation}
                  </span>
                </MDBBadge>
              </td>
              <td className="text-center align-middle">{item.stock}</td>
              <td className="text-center align-middle">
                <a href={`http://localhost:8000${item.document}`} download>
                  <i className="text-center align-middle fas fa-file-download fa-2x"></i>
                </a>
              </td>
              <td>
                <i
                  id={item.pk}
                  onClick={this.deleteTransactionItem}
                  className="fas fa-times fa-2x"
                ></i>
              </td>
            </tr>
          );
        })
      );
    return (
      <>
        <div className="d-flex justify-content-between mb-2">
          <h4 className="d-flex flex-column justify-content-center">
            Ativos na carteira
          </h4>
          <Fragment>
            <MDBBtn
              onClick={() => this.setState({ ModalAdd: !this.state.ModalAdd })}
              color="elegant"
            >
              Adicionar Ativo
            </MDBBtn>
          </Fragment>
        </div>
        <Table responsive>
          <thead>
            <tr>
              <th className="text-center">Data</th>
              <th className="text-center">Corretora</th>
              <th className="text-center">Operação</th>
              <th className="text-center">Ativo</th>
              <th className="text-center">Nota de Corretagem</th>
            </tr>
          </thead>
          <tbody>{content}</tbody>
        </Table>
        <MDBModal
          isOpen={this.state.ModalAdd}
          toggle={() => this.setState({ ModalAdd: !this.state.ModalAdd })}
        >
          <MDBModalHeader
            toggle={() => this.setState({ ModalAdd: !this.state.ModalAdd })}
          >
            Custódia de Ações
          </MDBModalHeader>
          <MDBModalBody>
            <MDBContainer>
              <MDBRow className="d-flex justify-content-center">
                <MDBCol md="6">
                  <form
                    encType="multipart/form-data"
                    onSubmit={this.submitTransactionItem}
                  >
                    <div className="grey-text">
                      <MDBInput
                        label="Ativo Comprado"
                        icon=""
                        group
                        style={{ fontSize: "20px" }}
                        type="text"
                        onChange={(e) =>
                          this.setState({ Stock: e.target.value.toUpperCase() })
                        }
                      />
                      <div className="md-form">
                        <input
                          type="date"
                          name="transaction-date"
                          className="form-control"
                          id="transaction-date"
                          onChange={(e) =>
                            this.setState({ Date: e.target.value })
                          }
                          required
                        />
                      </div>

                      <Form.Group controlId="formBasicCheckbox">
                        <Form.Control
                          as="select"
                          custom
                          defaultValue=""
                          onChange={(e) =>
                            this.setState({ Broker: e.target.value })
                          }
                        >
                          <option value="" disabled>
                            Corretora da Operação
                          </option>
                          <option value="Ágora - Bradesco">Ágora</option>
                          <option value="Banco do Brasil">
                            Banco do Brasil
                          </option>
                          <option value="Itaú">Itaú</option>
                        </Form.Control>
                      </Form.Group>

                      <Form.Group controlId="formBasicCheckbox">
                        <Form.Control
                          as="select"
                          custom
                          defaultValue=""
                          onChange={(e) =>
                            this.setState({ Operation: e.target.value })
                          }
                        >
                          <option value="" disabled>
                            Operação
                          </option>
                          <option value="Compra">Compra</option>
                          <option value="Venda">Venda</option>
                          <option value="Compra e Venda">Compra e Venda</option>
                        </Form.Control>
                      </Form.Group>
                      <Form.File
                        id="custom-file"
                        label="Nota de Corretagem"
                        onChange={(e) =>
                          this.setState({ Document: e.target.files[0] })
                        }
                        custom
                      />
                    </div>
                    <div className="text-center">
                      <MDBBtn
                        type="submit"
                        onClick={() =>
                          this.setState({ ModalAdd: !this.state.ModalAdd })
                        }
                      >
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
              onClick={() => this.setState({ ModalAdd: !this.state.ModalAdd })}
            >
              Fechar
            </MDBBtn>
          </MDBModalFooter>
        </MDBModal>
      </>
    );
  }
}

export default TransactionsTable;
