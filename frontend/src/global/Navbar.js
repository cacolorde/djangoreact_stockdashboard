import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

import "./Navbar.css";
import { withRouter } from "react-router-dom";

function TopBar({ location }) {
  const { pathname } = location;

  return (
    <Navbar bg="dark" expand="lg" variant="dark">
      <Navbar.Brand className="" href="/">
        <span>RM</span> INVESTIMENTOS
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link
            className="navbar-link-item"
            href="/"
            active={pathname === "/"}
          >
            DASHBOARD
          </Nav.Link>
          <Nav.Link
            className="navbar-link-item"
            href="/wallet"
            active={pathname.includes("/wallet")}
          >
            CARTEIRA
          </Nav.Link>
          <Nav.Link
            className="navbar-link-item"
            href="/addStock"
            active={pathname.includes("/addStock")}
          >
            ADICIONAR AÇÃO
          </Nav.Link>
          <Nav.Link
            className="navbar-link-item"
            href="/query"
            active={pathname.includes("/query")}
          >
            CONSULTA
          </Nav.Link>
          {/* <Nav.Link
            className="navbar-link-item"
            href="/forex"
            active={pathname.includes("/forex")}
          >
            CÂMBIO
          </Nav.Link> */}
          <Nav.Link
            className="navbar-link-item"
            href="/bvsp"
            active={pathname.includes("/bvsp")}
          >
            IBOVESPA
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
export default withRouter(TopBar);
