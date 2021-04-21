import React, { useContext, useEffect, useState } from "react";
import {
  // TextField,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Input,
  Grid,
  FormHelperText,
  TableCell,
  TableRow,
  TableBody,
  TableHead,
  Table,
  TableContainer,
  Paper,
  Card,
  CardContent,
  // Modal,
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import axios from "axios";
// import { base_url } from "../config";
import { useFormik } from "formik";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import Checkbox from "@material-ui/core/Checkbox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { UserContext } from "./UserContext";

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

const useStyles = makeStyles({
  select: {
    minWidth: 150,
  },
  errMessage: {
    color: "red",
  },
});

const UserDashboard = () => {
  const classes = useStyles();
  const { user } = useContext(UserContext);

  //Get all the enclosure names:
  const [shops, setShops] = useState([]);

  const [purchaseItems, setPurchaseItems] = useState([]);

  const [animal, setAnimal] = useState({
    date_arrived: null,
    deceased_date: null,
    birth_day: null,
    location: "",
    animal_name: "",
  });

  const getAllShops = () => {
    axios
      .get(`/locations/all_shops`)
      .then((res) => {
        console.log(res.data);

        setShops(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getAllShops();
  }, []);

  const validate = (values) => {
    console.log("testing...");
    let errors = {};
    if (
      values.amount_spent.length > 0 &&
      !Number.isInteger(Number(values.amount_spent))
    ) {
      errors.amount_spent = "Must be a valid number";
    }
    if (
      values.date_from &&
      values.date_to &&
      values.date_from > values.date_to
    ) {
      errors.date_from = "Date From Cannot be after Date to";
    }
    return errors;
  };

  const reportForm = useFormik({
    initialValues: {
      date_from: "",
      date_to: "",
      shop_name: "",
      amount_spent: "",
      customer_id: user.userID,
    },
    validate,
    onSubmit: (values) => {
      console.log(values);
      axios
        .post("/reports/customer_report", values)
        .then((res) => {
          console.log(res.data);
          setPurchaseItems(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  });

  const [totalSales, setTotalSales] = useState();

  const computeTotalSales = () => {
    let total = 0;
    purchaseItems.forEach((product) => {
      total = total + product.total_purchase_cost;
    });
    setTotalSales(total);
  };

  useEffect(() => {
    computeTotalSales();
  }, [purchaseItems]);

  const classy = theStyles();

  return (
    <div style={{ margin: "10px" }}>
      <div className={classy.root} noValidate autoComplete="off">
        <div>
          <Typography
            style={{
              align: "middle",
              fontSize: "32px",
            }}>
            Report Request
          </Typography>
          <Typography
            align="left"
            style={{
              fontSize: "22px",
              fontWeight: "bold",
            }}></Typography>
        </div>
        <div>
          <FormControl
            spacing={2}
            style={{ marginBottom: "20px", width: "40%" }}
            className={clsx(classy.margin, classy.textField)}
            variant="outlined"></FormControl>
        </div>
        <div>
          <FormControl style={{ paddingRight: "10px" }}>
            <InputLabel id="shop_name">Shop Name</InputLabel>
            <Select
              labelId="shop_name"
              onChange={reportForm.handleChange}
              name="shop_name"
              error={reportForm.errors.shop_name}
              value={reportForm.values.shop_name}
              displayEmpty
              className={classes.select}>
              {shops.map((s, index) => (
                <MenuItem key={index} value={s.location_id}>
                  {s.location_name}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText className={classes.errMessage}>
              {reportForm.errors.shop_name}
            </FormHelperText>
          </FormControl>
          <FormControl
            style={{ marginBottom: "20px", width: "40%" }}
            className={clsx(classy.margin, classy.textField)}
            variant="outlined">
            <InputLabel htmlFor="amount_spent">
              Purchases above this value
            </InputLabel>
            <Input
              id="amount_spent"
              onChange={reportForm.handleChange}
              name="amount_spent"
              value={reportForm.values.amount_spent}
              error={reportForm.errors.amount_spent}
            />
            <FormHelperText style={{ color: "red" }}>
              {reportForm.errors.amount_spent}
            </FormHelperText>
          </FormControl>
        </div>
        <div></div>
        <FormControl style={{ marginBottom: "20px", marginRight: "40px" }}>
          <InputLabel id="date_from" shrink>
            Date From:
          </InputLabel>
          <Input
            labelId="activity-from"
            name="date_from"
            type="date"
            value={reportForm.values.date_from}
            onChange={reportForm.handleChange}
          />
          <FormHelperText style={{ color: "red" }}>
            {reportForm.errors.date_from}
          </FormHelperText>
        </FormControl>
        <FormControl>
          <InputLabel id="date_to" shrink>
            Date To:
          </InputLabel>
          <Input
            labelId="activity-to"
            name="date_to"
            type="date"
            value={reportForm.values.date_to}
            onChange={reportForm.handleChange}
          />
        </FormControl>
        <Button
          variant="contained"
          onClick={reportForm.handleSubmit}
          style={{ marginRight: "10px" }}>
          Get Report
        </Button>
        <Button onClick={reportForm.handleReset} variant="outlined">
          Clear
        </Button>
      </div>

      {/* Table to display the animals */}
      {purchaseItems.length > 0 ? (
        <Grid container id="master" alignItems="flex-start" spacing={2}>
          <Grid item id="left" xs={6}>
            <TableContainer component={Paper} style={{ paddingTop: "10px" }}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Location Bought </TableCell>
                    <TableCell align="right">Item(s) Purchased</TableCell>
                    <TableCell align="right">Amount Spent</TableCell>
                    <TableCell align="right">Date Purchased</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {purchaseItems.map((item) => (
                    <TableRow key={item.customer_id}>
                      <TableCell component="th" scope="row">
                        {item.location_name}
                      </TableCell>
                      <TableCell align="right">
                        {item.quantity_purchased + " " + item.product_name}
                      </TableCell>
                      <TableCell align="right">
                        {"$" + item.total_purchase_cost}
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
          <Grid id="right" item>
            <Grid item>
              <Card>
                <CardContent>
                  <Typography variant="h5" component="h2">
                    Sales Summary
                  </Typography>
                  <Typography color="textSecondary">{`Total Sales $${totalSales}.00`}</Typography>
                  <Typography variant="body2" component="p"></Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      ) : null}
    </div>
  );
};

export default UserDashboard;
