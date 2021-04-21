import React, { useState, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useFormik } from "formik";
import { Typography, Grid, TextField, Button } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { UserContext } from "./UserContext";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(1),
    width: "50ch",
    position: "fixed",
    top: "25%",
    left: "50%",
    textAlign: "center",
    transform: "translate(-50%, -50%)",
    marginTop: theme.spacing(2),
  },
  formTitle: {
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  signUp: {
    float: "left",
  },
}));

function CreateUser(props) {
  const classes = useStyles();

  const { login } = useContext(UserContext);

  const [alertError, setAlertError] = useState(null);
  let history = useHistory();

  const handleSignup = (values) => {
    axios
      .post("/signup", {
        full_name: values.full_name,
        email: values.email,
        password: values.password,
        role_id: "Customer",
      })
      .then((res) => {
        console.log(res);
        //role_id, full_name, user_id
        login(res.data.full_name, res.data.role_id, res.data.user_id);
        history.push("/");
      })
      .catch((err) => {
        //Log In failed.
        console.log(err.response);
        console.log("Errors: ", err.response.data);
        let errors_response = err.response.data.errors;
        let new_errors = { email: "", password: "" };
        if (Array.isArray(errors_response)) {
          errors_response.forEach((error) => {
            new_errors[error.param] = error.msg;
          });
          setErrors(new_errors);
        } else {
          setAlertError(err.response.data.error);
        }
      });
  };
  const validate = (values) => {
    let errors = {};
    if (!values.full_name) {
      errors.password = "Required";
    }
    if (!values.email) {
      errors.email = "Required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
    ) {
      errors.email = "Invalid email address";
    } else if (values.email.length > 25) {
      errors.email = "Max 25 characters";
    }
    if (values.password.length < 4) {
      errors.password = "Minimum 4 characters";
    }
    return errors;
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validate,
    onSubmit: (values) => {
      handleSignup(values);
    },
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  return (
    <Grid container spacing={1} direction="column" className={classes.root}>
      <Typography className={classes.formTitle}>Sign Up</Typography>
      {alertError ? (
        <Alert severity="error" style={{ paddingBottom: "10px" }}>
          {alertError}
        </Alert>
      ) : null}
      <Grid item xs={12}>
        <TextField
          label="Full Name"
          id="full_name"
          onChange={formik.handleChange}
          name="full_name"
          variant="outlined"
          style={{ width: "100%" }}
          error={errors.full_name || formik.errors.full_name}
          helperText={
            errors.full_name !== ""
              ? errors.full_name
              : formik.errors.full_name !== ""
              ? formik.errors.full_name
              : ""
          }
        />
      </Grid>
      {props.createEmployee ? (
        <Grid item xs={12}>
          <TextField
            label="Email"
            id="email"
            onChange={formik.handleChange}
            name="email"
            variant="outlined"
            style={{ width: "100%" }}
            error={errors.email || formik.errors.email}
            helperText={
              errors.email !== ""
                ? errors.email
                : formik.errors.email !== ""
                ? formik.errors.email
                : ""
            }
          />
        </Grid>
      ) : null}
      <Grid item xs={12}>
        <TextField
          label="Email"
          id="email"
          onChange={formik.handleChange}
          name="email"
          variant="outlined"
          style={{ width: "100%" }}
          error={errors.email || formik.errors.email}
          helperText={
            errors.email !== ""
              ? errors.email
              : formik.errors.email !== ""
              ? formik.errors.email
              : ""
          }
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Password"
          id="password"
          name="password"
          type="password"
          onChange={formik.handleChange}
          variant="outlined"
          style={{ width: "100%" }}
          error={errors.password || formik.errors.password}
          helperText={
            errors.password !== ""
              ? errors.password
              : formik.errors.password !== ""
              ? formik.errors.password
              : ""
          }
        />
      </Grid>
      <Button
        onClick={formik.handleSubmit}
        variant="contained"
        size="large"
        color="primary">
        Sign Up
      </Button>
    </Grid>
  );
  // Only customers should be able to create their own accounts
  // We have to make employee accounts beforehand, they should end with "@zoo-staff" to signify they're an employee so we know which table to check in db with our queries
}

export default CreateUser;
