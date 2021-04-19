import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Home from "./Home";
import Ticket from "./components/Ticket";
import EnclosureList from "./components/EnclosureList";
import CreateUser from "./components/CreateUser";
import UserLogin from "./components/UserLogin";
import EmployeeDashboard from "./components/EmployeeDashboard";
import EnclosureDetailed from "./components/EnclosureDetailed";
import Navbar from "./components/Navbar";
import PurchaseHistory from "./components/PurchaseHistory";
import GiftShop from "./components/GiftShop";
import "./App.css";
import GiftShopList from "./components/GiftShopList";
import GiftShopDetailed from "./components/GiftShopDetailed";
import AdminDashboard from "./components/AdminDashboard";
import UserDashboard from "./components/UserDashboard";
import Messages from "./components/Messages";
// NEED TO "npm install" @material-ui dependencies
// npm install @material-ui/core
// npm install @material-ui/pickers
// npm install date-fns @date-io/date-fns@1
// npm install --save moment
// there may be other material uis too
// there may be other material uis too

function App() {
  // to initialize session storage if not created yet
  if (sessionStorage.getItem("auth") === null) {
    sessionStorage.setItem("auth", false);
  }

  if (sessionStorage.getItem("username") === null) {
    sessionStorage.setItem("username", "guest");
  }

  if (sessionStorage.getItem("role") === null) {
    sessionStorage.setItem("role", null);
  }

  if (sessionStorage.getItem("userID") === null) {
    sessionStorage.setItem("userID", null);
  }

  return (
    <div className="App">
      {/* add your pages here  */}

      <BrowserRouter>
        <Navbar></Navbar>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/ticket" component={Ticket} />
          <Route exact path="/giftshops" component={GiftShopList} />
          <Route exact path="/giftshops/:id" component={GiftShopDetailed} />
          <Route exact path="/enclosure" component={EnclosureList} />
          <Route exact path="/enclosure/:id" component={EnclosureDetailed} />
          <Route exact path="/create" component={CreateUser} />
          <Route exact path="/login" component={UserLogin} />
          <Route
            exact
            path="/employee_dashboard"
            component={EmployeeDashboard}
          />
          <Route exact path="/admin_dashboard" component={AdminDashboard} />
          <Route exact path="/user_dashboard" component={UserDashboard} />
          <Route exact path="/history" component={PurchaseHistory} />
          <Route exact path="/shop" component={GiftShop} />
          <Route exact path="/messages" component={Messages} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
