import React, { useContext, useEffect, useState } from "react";
import {
  Grid,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Input,
  FormHelperText,
  Snackbar,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { useHistory } from "react-router-dom";
import { UserContext } from "./UserContext";
import { useRouteMatch } from "react-router-dom";
import Link from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core/styles";
import { useFormik } from "formik";
import axios from "axios";

// styling should change a little bit

const useStyles = makeStyles({
  root: {
    padding: "10px",
  },
  title: {
    fontWeight: "bold",
  },
  select: {
    minWidth: 150,
  },
  errMessage: {
    color: "red",
  },
});

function EmployeeProfile() {
  const { user, logout } = useContext(UserContext);

  const classes = useStyles();

  let { url } = useRouteMatch();

  const [employeeInfo, setEmployeeInfo] = useState();
  const [loading, setLoading] = useState(true);
  const [editFields, setEditFields] = useState(false);

  const [snackMsg, setSnackMsg] = useState("");
  const [snackErr, setSnackErr] = useState("");

  const [open, setOpen] = useState(false);

  const validate = (values) => {
    let errors = {};
    if (!values.current_password) {
      errors.current_password = "Required";
    }
    if (!values.new_password.length) {
      errors.new_password = "Required";
    }
    if (values.new_password && values.new_password.length < 4) {
      errors.new_password = "Minimum 4 Characters";
    }
    return errors;
  };

  const profileForm = useFormik({
    initialValues: {
      current_password: "",
      new_password: "",
      user_id: parseInt(user.userID),
    },
    validate,
    onSubmit: (values) => {
      axios
        .post("/employees/change_password", values)
        .then((res) => {
          console.log(res);
          setOpen(true);
          setEditFields(false);
          setSnackMsg("Changed Password");
        })
        .catch((err) => {
          console.log(err);
          setOpen(true);
          setSnackErr("Incorrect current password");
        });
    },
  });

  const history = useHistory();

  useEffect(() => {
    axios
      .get(`/employees/${parseInt(user.userID)}`)
      .then((res) => {
        console.log(res);
        setEmployeeInfo(res.data[0]);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <>
      {loading ? null : (
        <Grid
          container
          spacing={2}
          className={classes.root}
          direction="column"
          alignItems="flex-start">
          <Grid item>
            <Typography>
              <span className={classes.title}>Name </span>
              {user.name}
            </Typography>
          </Grid>
          <Grid item>
            <Typography>
              <span className={classes.title}>Work Location </span>
              {employeeInfo.job_title}
            </Typography>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              onClick={() => {
                setEditFields(true);
              }}>
              Change Password
            </Button>
          </Grid>
          {editFields ? (
            <>
              <Grid item>
                <FormControl>
                  <InputLabel htmlFor="product-name">
                    Current Password
                  </InputLabel>
                  <Input
                    id="product-name"
                    onChange={profileForm.handleChange}
                    name="current_password"
                    type="password"
                    value={profileForm.values.current_password}
                    error={profileForm.errors.current_password}
                    // label="product)name"
                  />
                  <FormHelperText style={{ color: "red" }}>
                    {profileForm.errors.current_password}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item>
                <FormControl>
                  <InputLabel htmlFor="new-password">New Password</InputLabel>
                  <Input
                    id="new-password"
                    onChange={profileForm.handleChange}
                    type="password"
                    name="new_password"
                    value={profileForm.values.new_password}
                    error={profileForm.errors.new_password}
                    // label="product)name"
                  />
                  <FormHelperText style={{ color: "red" }}>
                    {profileForm.errors.new_password}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item>
                <Button
                  onClick={profileForm.handleSubmit}
                  variant="outlined"
                  style={{ marginRight: "10px" }}>
                  Save
                </Button>
                <Button
                  onClick={() => {
                    setEditFields(false);
                  }}
                  variant="outlined">
                  Cancel
                </Button>
              </Grid>
            </>
          ) : null}
        </Grid>
      )}

      <Snackbar
        open={open}
        autoHideDuration={2000}
        onClose={() => {
          setSnackErr("");
          setSnackMsg("");
          setOpen(false);
        }}>
        <div>
          {snackMsg !== "" ? (
            <Alert severity="success">{snackMsg}</Alert>
          ) : (
            <Alert severity="error">{snackErr}</Alert>
          )}
        </div>
      </Snackbar>
    </>
  );
}

export default EmployeeProfile;
