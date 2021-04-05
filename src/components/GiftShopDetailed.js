import React, { useEffect, useState, useContext } from "react";
import {
  List,
  ListItem,
  Divider,
  ListItemIcon,
  Typography,
  Grid,
  Chip,
  ListItemText,
  LinearProgress,
  Paper,
  Modal,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Select,
  MenuItem,
} from "@material-ui/core";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Button from "@material-ui/core/Button";

import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";

import { useHistory } from "react-router-dom";

import { UserContext } from "./UserContext";
import { CloudQueueRounded, LensOutlined } from "@material-ui/icons";

const GiftShopDetailed = ({ match }) => {
  // console.log(match);

  let quantities = Array.from({ length: 10 }, (_, index) => {
    return {
      value: index + 1,
    };
  });

  console.log(quantities);

  const { user } = useContext(UserContext);

  let history = useHistory();

  const [loading, setLoading] = useState(true);

  const [openDialog, setOpenDialog] = useState(false);

  //Modal
  const [currentProduct, setCurrentProduct] = useState({});

  const [open, setOpen] = useState(false);

  const handleModalOpen = (product) => {
    // console.log("Animal", animal);
    setCurrentProduct(product);
    setOpenDialog(true);
  };

  const handleModalClose = () => {
    setOpenDialog(false);
  };

  const handleCancel = () => {
    setOpenDialog(false);
  };

  //Get animals in the Enclosure.

  const [products, setProducts] = useState([]);

  const [giftShop, setGiftShop] = useState({});

  const getGiftShop = () => {
    axios
      .get(`https://zoo-backend-test.herokuapp.com/locations/by_id`, {
        params: { location: match.params.id },
      })
      .then((res) => {
        setGiftShop(res.data[0]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getProducts = () => {
    axios
      .get(`https://zoo-backend-test.herokuapp.com/merchandise/all_products/`, {
        params: { location: match.params.id },
      })
      .then((res) => {
        console.log(res);
        let products = res.data.map((each) => {
          return {
            ...each,
            quantity_selected: 0,
            amount_due: 0,
          };
        });
        setProducts(products);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSelectQuantity = (e, product) => {
    const index = products.findIndex((elem) => elem.item_id == product.item_id);
    let newProducts = [...products];
    newProducts[index] = {
      ...newProducts[index],
      quantity_selected: e.target.value,
      amount_due: e.target.value * product.price,
    };
    setProducts(newProducts);
  };

  const handleConfirm = () => {
    axios
      .post("https://zoo-backend-test.herokuapp.com/merchandise/buy", {
        user_id: user.userID,
        ...currentProduct,
      })
      .then((res) => {
        setOpenDialog(false);
        console.log(res);
      })
      .catch((err) => {
        setOpenDialog(true);
        console.log(err);
      });
  };

  useEffect(() => {
    getGiftShop();
    getProducts();
  }, []);

  return (
    <div style={{ padding: "10px" }}>
      {loading ? (
        <LinearProgress color="primary" />
      ) : (
        <>
          {products.length > 0 ? (
            <>
              <Typography>{`Products in ${giftShop.location_name} Enclosure`}</Typography>
              <TableContainer
                component={Paper}
                style={{ width: 800, paddingTop: "10px" }}>
                <Table aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Product Name </TableCell>
                      <TableCell align="right">Product Price</TableCell>
                      <TableCell align="right">Select Quntity</TableCell>
                      {user.role == "Customer" ? (
                        <TableCell align="right">Actions</TableCell>
                      ) : null}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.product_id}>
                        <TableCell component="th" scope="row">
                          {product.product_name}
                        </TableCell>
                        <TableCell align="right">{product.price}</TableCell>
                        <TableCell align="right">
                          <Select
                            name="quantity_selected"
                            style={{ width: "75px" }}
                            value={product.quantity_selected}
                            onChange={(e) => {
                              handleSelectQuantity(e, product);
                            }}>
                            {quantities.map((q) => {
                              return (
                                <MenuItem key={q.value} value={q.value}>
                                  {q.value}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        </TableCell>
                        {user.role == "Customer" ? (
                          <TableCell align="right">
                            <Button
                              variant="outlined"
                              disabled={product.quantity_selected == 0}
                              onClick={() => {
                                handleModalOpen(product);
                              }}>
                              Buy
                            </Button>
                          </TableCell>
                        ) : null}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Modal for changing health status */}
              <div>
                <Dialog open={openDialog}>
                  <DialogTitle>Transaction Details</DialogTitle>
                  <DialogContent>
                    <Typography>{`The Total Cost of ${currentProduct.product_name} is $${currentProduct.amount_due}`}</Typography>
                    <Typography>Are you sure you want to buy?</Typography>
                  </DialogContent>
                  <DialogActions>
                    <Button
                      onClick={handleConfirm}
                      variant="contained"
                      color="secondary">
                      CONFIRM
                    </Button>
                    <Button
                      onClick={handleCancel}
                      variant="contained"
                      color="secondary">
                      CANCEL
                    </Button>
                  </DialogActions>
                </Dialog>
              </div>
            </>
          ) : (
            <Typography style={{ padding: "10px" }}>No Products</Typography>
          )}
        </>
      )}
    </div>
  );
};

export default GiftShopDetailed;
