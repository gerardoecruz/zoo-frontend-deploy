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
  InputLabel,
  Input,
  TextField,
  FormHelperText,
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
import Alert from "@material-ui/lab/Alert";
import { useFormik } from "formik";


const useStyles = makeStyles({
  select: {
    minWidth: 150,
  },
  errMessage: {
    color: "red",
  },
});

const GiftShopDetailed = ({ match }) => {
  // console.log(match);

  let quantities = Array.from({ length: 10 }, (_, index) => {
    return {
      value: index + 1,
    };
  });

  console.log(quantities);
  const classes = useStyles();

  const { user } = useContext(UserContext);

  let history = useHistory();

  const [loading, setLoading] = useState(true);

  const [openDialog, setOpenDialog] = useState(false);

  const [openDialogedit, setOpenDialogedit] = useState(false);

  const [openDialogRemove, setOpenDialogRemove] = useState(false); 

  const [addDialog, setAddDialog] = useState(false);

  //Modal
  const [currentProduct, setCurrentProduct] = useState({});

  const [open, setOpen] = useState(false);

  const [alertError, setAlertError] = useState(null);

  const handleModalOpen = (product) => {
    // console.log("Animal", animal);
    setCurrentProduct(product);
    setOpenDialog(true);
  };
  const handleModalOpenEdit = (product) => {
    // console.log("Animal", animal);
    setCurrentProduct(product);
    setOpenDialogedit(true);
  };

  const handleModalRemove = (product) => {
    setCurrentProduct(product);
    setOpenDialogRemove(true);
  }

  const handleModalCloseRemove = () => {
    setOpenDialogRemove(false); 
  }

  const handleModalCloseEdit = () => {
    setOpenDialogedit(false);
  };

  const handleModalClose = () => {
    setOpenDialog(false);
  };

  const handleCancelEdit = () => {
    setOpenDialogedit(false);
  };

  const handleCancel = () => {
    setOpenDialog(false);
  };

  const handleHealthStatusChange = (e) => {
    setCurrentProduct({
      ...currentProduct,
      stock_amount: e.target.value,
    });
  };

  // const [errors, setErrors] = useState({
  //   email: "",
  //   password: "",
  // });

  const validate = (values) => {
    let errors = {};
    if (!values.stock_amount) {
      errors.stock_amount = "Required";
    } //else if (
    //   !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
    // ) {
    //   errors.email = "Invalid email address";
    // } else if (values.email.length > 25) {
    //   errors.email = "Max 25 characters";
    // }
    // if (values.password.length < 4) {
    //   errors.password = "Minimum 4 characters";
    // }
    if (values.price == "") {
      errors.price = "Required";
    }
    if (values.product_name == "") {
      errors.product_name = "Required";
    }
    
    // if (values.worK_location == "") {
    //   errors.work_location = "Required";
    // }
    return errors;
  };

  const handleCreateEmployee = (values) => {
    axios
      .post("https://zoo-backend-test.herokuapp.com/merchandise/additem", {
        stock_amount: values.stock_amount,
        price: values.price,
        product_name: values.product_name,
        location_sold: 24,
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        //Log In failed.
        console.log(err.response);
        console.log("Errors: ", err.response.data);
        let errors_response = err.response.data.errors;
        // let new_errors = { email: "", password: "" };
        // if (Array.isArray(errors_response)) {
        //   errors_response.forEach((error) => {
        //     new_errors[error.param] = error.msg;
        //   });
        //   setErrors(new_errors);
        // } else {
        //   setAlertError(err.response.data.error);
        // }
      });
  };

  const closeAddDialog = () => {
    setAddDialog(false);
  };

  const formik = useFormik({
    initialValues: {
      stock_amount: "",
      price: "",
      product_name: "",
      location_sold: 24,
    },
    validate,
    onSubmit: (values) => {
      handleCreateEmployee(values);
      setAddDialog(false);
    },
  });

  const openAddDialog = () => {
    setAddDialog(true);
  };

  const handleRemove = (product_name) => {
    axios
      .post("https://zoo-backend-test.herokuapp.com/merchandise/removeItem", { product: product_name })
      .then((res) => {
        setOpenDialogRemove(false);
        console.log(res);
        window.location.reload(false); 
      })
      .catch((err) => {
        setOpenDialogRemove(true);
        console.log(err);
      });
  }


  const handleSave = () => {
    axios
      .post("https://zoo-backend-test.herokuapp.com/merchandise/change_stock", currentProduct)
      .then((res) => {
        setOpenDialogedit(false);
        console.log(res);
      })
      .catch((err) => {
        setOpenDialogedit(true);
        console.log(err);
      });
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
              
              {user.role == "Admin" ? (
                          <Grid item>
                          <Button variant="contained" onClick={openAddDialog}>
                            Add Item
                          </Button>
                        </Grid>
                        ) : null}
              
              
              <TableContainer
                component={Paper}
                style={{ width: 800, paddingTop: "10px" }}>
                <Table aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Product Name </TableCell>
                      <TableCell align="right">Product Stock</TableCell>
                      <TableCell align="right">Product Price</TableCell>

                      {user.role == "Customer" ? (
                          <TableCell align="right">Select Quantity</TableCell>
                        ) : null}
                      
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
                        <TableCell align="right">{product.stock_amount}</TableCell>
                        <TableCell align="right">{"$" + product.price}</TableCell>

                        {user.role == "Customer" ? (
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
                        ) : null}

                        
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
                        {user.role == "Admin" ? (
                        <TableCell align="right">
                           <Button
                              variant="outlined"
                              onClick={() => {
                                handleModalOpenEdit(product);
                              }}>
                              Edit Stock
                            </Button>
                            <Button
                              variant="outlined"
                              onClick={() => {
                                handleModalRemove(product);
                              }}>
                              REMOVE
                            </Button>
                        </TableCell>):null}
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

              {/* Modal for adding new item to gift shop */}
              <div>
                <Dialog open={addDialog} onClose={closeAddDialog}>
                  <DialogTitle>Add New Item</DialogTitle>
                  <DialogContent>
                    <Grid
                      container
                      spacing={1}
                      direction="column"
                      className={classes.root}>
                      <Typography className={classes.formTitle}>
                        Add New Item
                      </Typography>
                      {alertError ? (
                        <Alert
                          severity="error"
                          style={{ paddingBottom: "10px" }}>
                          {alertError}
                        </Alert>
                      ) : null}
                      <Grid item xs={12}>
                        <TextField
                          label="Stock Amount"
                          id="stock_amount"
                          onChange={formik.handleChange}
                          name="stock_amount"
                          variant="outlined"
                          style={{ width: "100%" }}
                          // error={formik.errors.full_name}
                          // helperText={
                          //   formik.errors.full_name !== ""
                          //     ? formik.errors.full_name
                          //     : ""
                          // }
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          label="Price"
                          id="email"
                          onChange={formik.handleChange}
                          name="price"
                          variant="outlined"
                          style={{ width: "100%" }}
                          // error={formik.errors.email}
                          // helperText={
                          //   formik.errors.email !== ""
                          //     ? formik.errors.email
                          //     : ""
                          // }
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          label="Product Name"
                          id="product_name"
                          name="product_name"
                          onChange={formik.handleChange}
                          variant="outlined"
                          style={{ width: "100%" }}
                          // error={formik.errors.password}
                          // helperText={
                          //   formik.errors.password !== ""
                          //     ? formik.errors.password
                          //     : ""
                          // }
                        />
                      </Grid>
                      
                    </Grid>
                  </DialogContent>
                  <DialogActions>
                    <Button
                      onClick={formik.handleSubmit}
                      variant="contained"
                      color="secondary">
                      Save
                    </Button>
                    <Button
                      onClick={closeAddDialog}
                      variant="contained"
                      color="secondary">
                      CANCEL
                    </Button>
                  </DialogActions>
                </Dialog>
              </div>

              {/* Modal for removing item */}
              <div>
                <Dialog open={openDialogRemove}>
                  <DialogTitle>
                    Remove {currentProduct.product_name}
                  </DialogTitle>
                  <DialogContent>
                  <Typography className={classes.formTitle}>
                    Are you sure?
                  </Typography>
                  </DialogContent>
                  <DialogActions>
                    <Button
                      onClick={() =>  {handleRemove(currentProduct.product_name);} }
                      variant="contained"
                      color="secondary">
                      Yes
                    </Button>
                    <Button
                      onClick={handleModalCloseRemove}
                      variant="contained"
                      color="secondary">
                      CANCEL
                    </Button>
                  </DialogActions>
                </Dialog>
              </div>

              {/* Modal for changing stock amount */}
              <div>
                <Dialog open={openDialogedit}>
                  <DialogTitle>
                    Change the Stock of {currentProduct.product_name}
                  </DialogTitle>
                  <DialogContent>
                  <InputLabel htmlFor="amount_spent">
                    Increase by how much
                  </InputLabel>
                    <Input
                      id="stock_amount"
                      value={currentProduct.stock_amount}
                      onChange={handleHealthStatusChange}>
                      
                    </Input>
                  </DialogContent>
                  <DialogActions>
                    <Button
                      onClick={handleSave}
                      variant="contained"
                      color="secondary">
                      Save
                    </Button>
                    <Button
                      onClick={handleCancelEdit}
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
