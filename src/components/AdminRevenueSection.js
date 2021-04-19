import React, { useEffect, useState } from "react";
import {
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Input,
  OutlinedInput,
  Grid,
  Paper,
} from "@material-ui/core";

import clsx from "clsx";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Button from "@material-ui/core/Button";

import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import { useFormik } from "formik";

const theStyles = makeStyles((theme) => ({
  root: {
    width: "900px",
    variant: "contained",
    position: "right",
    border: "3px solid #4A90E2",
    borderColor: "gray",
    color: "black",
    align: "right",
    minWidth: 50,
    "& .MuiTextField-root": {
      margin: theme.spacing(4),
      width: "10ch",
    },
  },
}));

const AdminRevenueSection = () => {
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [total, setTotal] = useState();

  const reportForm = useFormik({
    initialValues: {
      product_name: "",
      from_date: "",
      to_date: "",
      shop: "",
      amount_spent: "",
    },
    onSubmit: (values) => {
      console.log(values);
      axios
        .post("https://zoo-backend-test.herokuapp.com/reports/admin_report", values)
        .then((res) => {
          console.log(res);
          setPurchaseHistory(res.data.purchase_history);
          //   setTotal(res.data.total);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  });

  const [shops, setShops] = useState([]);

  useEffect(() => {
    axios
      .get("https://zoo-backend-test.herokuapp.com/locations/all_shops")
      .then((res) => {
        console.log(res);
        setShops(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const classes = theStyles();

  return (
    <div style={{ padding: "10px" }}>
      <form>
        <div className={classes.root} noValidate autoComplete="off">
          <div style={{ paddingTop: "10px" }}>
            <FormControl
              variant="outlined"
              style={{
                marginBottom: "20px",
                width: "40%",
                marginRight: "10px",
              }}>
              <InputLabel htmlFor="product-name">Product Name</InputLabel>
              <OutlinedInput
                id="product-name"
                onChange={reportForm.handleChange}
                name="product_name"
                // label="product)name"
              />
            </FormControl>
            <FormControl
              style={{
                marginBottom: "20px",
                width: "40%",
                marginRight: "10px",
              }}
              className={clsx(classes.margin, classes.textField)}
              variant="outlined">
              <InputLabel id="shops">Shops</InputLabel>
              <Select
                labelId="shops"
                onChange={reportForm.handleChange}
                name="shop"
                className={classes.select}>
                {shops.map((shop, index) => (
                  <MenuItem key={index} value={shop.location_id}>
                    {shop.location_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <FormControl style={{ marginBottom: "20px", marginRight: "40px" }}>
            <InputLabel id="from_date" shrink>
              Date From:
            </InputLabel>
            <Input
              labelId="activity-from"
              name="from_date"
              type="date"
              onChange={reportForm.handleChange}
            />
          </FormControl>
          <FormControl>
            <InputLabel id="to_date" shrink>
              Date To:
            </InputLabel>
            <Input
              labelId="activity-to"
              name="to_date"
              type="date"
              onChange={reportForm.handleChange}
            />
          </FormControl>
          <Button variant="contained" onClick={reportForm.handleSubmit}>
            Get Report
          </Button>
        </div>
      </form>

      <Grid container direction="column" alignItems="flex-start" spacing={2}>
        <Grid item>
          <TableContainer
            component={Paper}
            style={{ width: 800, paddingTop: "10px" }}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="right">Transaction ID</TableCell>
                  <TableCell align="right">Product Name</TableCell>
                  <TableCell align="right">Location Sold</TableCell>
                  <TableCell align="right">Quantity Purchased</TableCell>
                  <TableCell align="right">Amount Spent</TableCell>
                  <TableCell align="right">Transaction Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {purchaseHistory.map((item) => (
                  <TableRow key={item.transaction_id}>
                    <TableCell align="right">{item.transaction_id}</TableCell>
                    <TableCell align="right">{item.product_name}</TableCell>
                    <TableCell align="right">{item.location_name}</TableCell>
                    <TableCell align="right">
                      {item.quantity_purchased}
                    </TableCell>
                    <TableCell align="right">
                      {item.total_purchase_cost}
                    </TableCell>
                    <TableCell align="right">
                      {item.purchase_time.toString().split("T")[0]}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </div>
  );
};

export default AdminRevenueSection;
