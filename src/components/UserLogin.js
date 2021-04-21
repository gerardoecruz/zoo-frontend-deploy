import React, { useState, useContext } from "react";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Typography, Button } from "@material-ui/core";
// import { AlternateEmail, DriveEtaTwoTone } from "@material-ui/icons";
import axios from "axios";
import { useFormik } from "formik";
import { useHistory } from "react-router-dom";
import Alert from "@material-ui/lab/Alert";
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

const UserLogin = (props) => {
  const classes = useStyles();

  const { login } = useContext(UserContext);

  let history = useHistory();

  const [alertError, setAlertError] = useState(null);

  const validate = (values) => {
    let errors = {};
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

  const handleLogin = (values) => {
    axios
      .post("/login", {
        email: values.email,
        password: values.password,
      })
      .then((res) => {
        console.log(res);
        login(res.data.full_name, res.data.role_id, res.data.user_id);
        console.log("Login successful");
        history.push("/");
      })
      .catch((err) => {
        //Log In failed.
        console.log(err.response);
        setAlertError(err.response.data.error);
      });
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validate,
    onSubmit: (values) => {
      handleLogin(values);
    },
  });

  return (
    <>
      <Grid container spacing={1} direction="column" className={classes.root}>
        <Typography className={classes.formTitle}>Log In</Typography>
        {alertError ? (
          <Alert severity="error" style={{ paddingBottom: "10px" }}>
            {alertError}
          </Alert>
        ) : null}
        <Grid item xs={12}>
          <TextField
            label="Username"
            id="email"
            onChange={formik.handleChange}
            name="email"
            variant="outlined"
            style={{ width: "100%" }}
            error={formik.errors.email}
            helperText={formik.errors.email !== "" ? formik.errors.email : ""}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Password"
            id="password"
            type="password"
            name="password"
            onChange={formik.handleChange}
            variant="outlined"
            style={{ width: "100%" }}
            error={formik.errors.password}
            helperText={
              formik.errors.password !== "" ? formik.errors.password : ""
            }
          />
        </Grid>
        <Button
          onClick={formik.handleSubmit}
          variant="contained"
          size="large"
          color="primary">
          Log In
        </Button>
      </Grid>
    </>
  );
};

export default UserLogin;
