import React, { useContext } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import HomeIcon from "@material-ui/icons/Home";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import Button from "@material-ui/core/Button";
import { useHistory } from "react-router-dom";
import { UserContext } from "./UserContext";

// styling should change a little bit
function Navbar() {
  const { user, login, logout } = useContext(UserContext);

  const history = useHistory();

  const goBackToHomePage = () => {
    let path = "/";
    history.push(path);
  };

  const goToLogInPage = () => {
    let path = "/login";
    history.push(path);
  };

  const goToSignUpPage = () => {
    let path = "/create";
    history.push(path);
  };

  // needs to go to account page/purchase history when it's created.
  const goToAccountPage = () => {
    let path = "/";
    history.push(path);
  };

  const goToDashboard = (role) => {
    if (role == "Admin") {
      history.push("/employee_dashboard");
    } else {
      history.push("/admin_dashboard");
    }
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar variant="dense" style={{ padding: 0 }}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={goBackToHomePage}>
            <HomeIcon />
          </IconButton>
          <Typography variant="h6">Better Houston Zoo</Typography>
          {!user.auth && (
            <div>
              <Button onClick={goToLogInPage}>Log in</Button>
              <Button onClick={goToSignUpPage}>Sign up</Button>
            </div>
          )}

          {user.auth && (
            <div>
              <Button>Welcome, {user.name}</Button>
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={goToAccountPage}>
                <AccountCircleIcon />
              </IconButton>

              <Button
                onClick={() => {
                  history.push("/");
                  logout();
                }}>
                Sign out
              </Button>
              {user.role == "Admin" || user.role == "Employee" ? (
                <Button onClick={goToDashboard}>Dash Board</Button>
              ) : null}
            </div>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default Navbar;
