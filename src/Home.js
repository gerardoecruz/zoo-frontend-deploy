import React from "react";
// import Navbar from "./components/Navbar.js";
import background from "./images/zoo.jpg";
import Button from "@material-ui/core/Button";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import { Link } from "react-router-dom";

function Home() {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };
  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };
  function handleListKeyDown(event) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    }
  }
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }
    prevOpen.current = open;
  }, [open]);

  // temporary home page
  // need to figure out loggin in

  return (
    <div>
      <div>
        <div
          style={{
            backgroundImage: `url(${background})`,
            backgroundPosition: "cover",
            width: "100%",
            height: "888px", // this needs to be fixed into something more modular but 100% doesn't work
            padding: "20",
          }}>
          <Button
            style={{
              borderRadius: 5,
              backgroundColor: "white",
              padding: "7px 26px",
              fontSize: "16px",
            }}
            variant="contained"
            color="white"
            ref={anchorRef}
            onClick={handleToggle}>
            menu
          </Button>

          <Popper
            open={open}
            anchorEl={anchorRef.current}
            transition
            disablePortal>
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                style={{
                  backgroundColor: "white",
                  transformOrigin:
                    placement === "bottom" ? "center top" : "center bottom",
                }}>
                <Paper>
                  <ClickAwayListener onClickAway={handleClose}>
                    <MenuList
                      autoFocusItem={open}
                      onKeyDown={handleListKeyDown}>
                      <MenuItem component={Link} to="/ticket">
                        Tickets
                      </MenuItem>
                      <MenuItem component={Link} to="/enclosure">
                        Enclosures
                      </MenuItem>
                      <MenuItem component={Link} to="/giftshops">
                        Gift Shops
                      </MenuItem>
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
        </div>
      </div>
    </div>
  );
}

export default Home;
