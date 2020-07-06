import React from "react";
// import ReactDOM from "react-dom";
import TopBar from "./global/Navbar";
import DashboardComponent from "./dashboard/Dashboard";
import WalletComponent from "./wallet/Wallet";
// import ForexComponent from "./forex/ForexComponent";
import StockDetailComponent from "./stockdetail/StockDetailComponent";
import AddStockComponent from "./addstock/AddStockComponent";
import QueryComponent from "./query/QueryComponent";
import IbovespaComponent from "./bvsp/IbovespaComponent";
import { BrowserRouter, Switch, Route } from "react-router-dom";
// import ReactDOM from "react-dom";
import "./App.css";

const App = () => {
  return (
    <BrowserRouter>
      <div className="App">
        <TopBar />
        <Switch>
          <Route exact path="/" component={DashboardComponent} />
          <Route exact path="/wallet" component={WalletComponent} />

          {/* <Route exact path="/forex" component={ForexComponent} /> */}
          <Route exact path="/stock/:id" component={StockDetailComponent} />
          <Route exact path="/addStock" component={AddStockComponent} />
          <Route exact path="/query" component={QueryComponent} />
          <Route exact path="/bvsp" component={IbovespaComponent} />
        </Switch>
      </div>
    </BrowserRouter>
  );
};

export default App;
