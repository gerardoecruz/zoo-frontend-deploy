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
  TextField,
  FormHelperText,
  InputLabel,
} from "@material-ui/core";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Button from "@material-ui/core/Button";
import Alert from "@material-ui/lab/Alert";

import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";

import { useHistory } from "react-router-dom";

import { UserContext } from "./UserContext";
import { SubdirectoryArrowLeftSharp } from "@material-ui/icons";
import { useFormik } from "formik";

const useStyles = makeStyles({
  select: {
    minWidth: 150,
  },
  errMessage: {
    color: "red",
  },
});

const AdminEmployeeSection = () => {
  const classes = useStyles();

  let history = useHistory();
  const { login } = useContext(UserContext);

  const [employees, setEmployees] = useState([]);

  const [deleteDialog, setDeleteDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [addDialog, setAddDialog] = useState(false);
  const [alertError, setAlertError] = useState(null);
  const [loading, setLoading] = useState(false);

  const [currentEmployee, setCurrentEmployee] = useState({
    full_name: "",
    work_location: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [locations, setLocations] = useState([]);

  const { user } = useContext(UserContext);

  const getAllEmployees = () => {
    axios
      .get(`https://zoo-backend-test.herokuapp.com/employees/all`)
      .then((res) => {
        console.log(res.data);
        setEmployees(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getLocations = () => {
    axios
      .get(`https://zoo-backend-test.herokuapp.com/locations`)
      .then((res) => {
        console.log(res.data);
        setLocations(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getAllEmployees();
    getLocations();
  }, []);

  //Edit Dialog functions.
  const openEditDialog = (employee) => {
    setCurrentEmployee(employee);
    setEditDialog(true);
  };

  const handleWorkLocationChange = (e) => {
    let newEmployee = {
      ...currentEmployee,
      work_location: e.target.value,
    };
    setCurrentEmployee(newEmployee);
  };

  const handleEditConfirm = () => {
    axios
      .put("https://zoo-backend-test.herokuapp.com/employees/change_work_location", {
        new_location: currentEmployee.work_location,
        employee_id: currentEmployee.employee_id,
      })
      .then((res) => {
        console.log(res);
        setEditDialog(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleEditCancel = () => {
    setEditDialog(false);
  };

  const closeEditDialog = () => {
    setEditDialog(false);
  };

  //Adding new Employee functions.
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
    if (values.full_name == "") {
      errors.full_name = "Required";
    }
    if (values.worK_location == "") {
      errors.work_location = "Required";
    }
    return errors;
  };

  const handleCreateEmployee = (values) => {
    axios
      .post("https://zoo-backend-test.herokuapp.com/signup", {
        full_name: values.full_name,
        email: values.email,
        password: values.password,
        role_id: "Employee",
        work_location: values.work_location,
      })
      .then((res) => {
        console.log(res);
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

  const formik = useFormik({
    initialValues: {
      full_name: "",
      email: "",
      password: "",
      work_location: 0,
    },
    validate,
    onSubmit: (values) => {
      handleCreateEmployee(values);
    },
  });

  const openAddDialog = () => {
    setAddDialog(true);
  };

  const closeAddDialog = () => {
    setAddDialog(false);
  };

  const openDeleteDialog = (employee) => {
    setCurrentEmployee(employee);
    setDeleteDialog(true);
    console.log(employee);
  };

  const closeDeleteDialog = () => {
    setDeleteDialog(false);
  };
  const handleDeleteEmployee = () => {
    axios
      .delete(`https://zoo-backend-test.herokuapp.com/employees/delete/${currentEmployee.employee_id}`)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });

    // console.log(currentEmployee);
  };

  return (
    <div style={{ padding: "10px" }}>
      {loading ? (
        <LinearProgress color="primary" />
      ) : (
        <>
          <Typography>{`All Employees`}</Typography>
          <Button variant="contained" onClick={openAddDialog}>
            Add Employee
          </Button>
          {employees.length > 0 && locations.length > 0 ? (
            <>
              <Grid
                container
                direction="column"
                alignItems="flex-start"
                spacing={2}>
                <Grid item></Grid>
                <Grid item>
                  <TableContainer
                    component={Paper}
                    style={{ width: 800, paddingTop: "10px" }}>
                    <Table aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell>Name </TableCell>
                          <TableCell align="right">Job Title</TableCell>
                          <TableCell align="right">Wage</TableCell>
                          <TableCell align="right">Work Location</TableCell>
                          {user.role == "Admin" ? (
                            <TableCell align="right">Actions</TableCell>
                          ) : null}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {employees.map((employee) => (
                          <TableRow key={employee.employee_id}>
                            <TableCell component="th" scope="row">
                              {employee.full_name}
                            </TableCell>
                            <TableCell align="right">
                              {employee.job_title}
                            </TableCell>
                            <TableCell align="right">{employee.wage}</TableCell>
                            <TableCell align="right">
                              {employee.location_name}
                            </TableCell>
                            {user.role == "Admin" ? (
                              <TableCell align="right">
                                <Button
                                  style={{ marginRight: "10px" }}
                                  variant="contained"
                                  onClick={() => {
                                    openEditDialog(employee);
                                  }}>
                                  Edit
                                </Button>
                                <Button
                                  variant="outlined"
                                  onClick={() => {
                                    openDeleteDialog(employee);
                                  }}>
                                  Delete
                                </Button>
                              </TableCell>
                            ) : null}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>

              {/* Modal for changing work Location */}
              <div>
                <Dialog open={editDialog} onClose={closeEditDialog}>
                  <DialogTitle>
                    Change the Work location of {currentEmployee.full_name}
                  </DialogTitle>
                  <DialogContent>
                    <Select
                      id="health_status"
                      value={currentEmployee.health_status}
                      onChange={handleWorkLocationChange}>
                      {locations.map((location) => {
                        return (
                          <MenuItem
                            value={location.location_id}
                            key={location.location_id}>
                            {location.location_name}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </DialogContent>
                  <DialogActions>
                    <Button
                      onClick={handleEditConfirm}
                      variant="contained"
                      color="secondary">
                      Save
                    </Button>
                    <Button
                      onClick={handleEditCancel}
                      variant="contained"
                      color="secondary">
                      CANCEL
                    </Button>
                  </DialogActions>
                </Dialog>
              </div>

              {/* Modal for adding new employee */}
              <div>
                <Dialog open={addDialog} onClose={closeAddDialog}>
                  <DialogTitle>Add New Employee</DialogTitle>
                  <DialogContent>
                    <Grid
                      container
                      spacing={1}
                      direction="column"
                      className={classes.root}>
                      <Typography className={classes.formTitle}>
                        Add New Employee
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
                          label="Full Name"
                          id="full_name"
                          onChange={formik.handleChange}
                          name="full_name"
                          variant="outlined"
                          style={{ width: "100%" }}
                          error={formik.errors.full_name}
                          helperText={
                            formik.errors.full_name !== ""
                              ? formik.errors.full_name
                              : ""
                          }
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          label="Email"
                          id="email"
                          onChange={formik.handleChange}
                          name="email"
                          variant="outlined"
                          style={{ width: "100%" }}
                          error={formik.errors.email}
                          helperText={
                            formik.errors.email !== ""
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
                          onChange={formik.handleChange}
                          variant="outlined"
                          style={{ width: "100%" }}
                          error={formik.errors.password}
                          helperText={
                            formik.errors.password !== ""
                              ? formik.errors.password
                              : ""
                          }
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <InputLabel>Work Location</InputLabel>
                        <Select
                          id="work_location"
                          style={{ width: "100%" }}
                          name="work_location"
                          onChange={formik.handleChange}>
                          {locations.map((location) => {
                            return (
                              <MenuItem
                                value={location.location_id}
                                key={location.location_id}>
                                {location.location_name}
                              </MenuItem>
                            );
                          })}
                        </Select>
                        {formik.errors.work_location !== "" ? (
                          <FormHelperText>
                            {formik.errors.work_location}
                          </FormHelperText>
                        ) : null}
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

              {/* Modal for deleting employee */}
              <div>
                <Dialog open={deleteDialog} onClose={closeDeleteDialog}>
                  {/* <DialogTitle>Delete Employee</DialogTitle> */}
                  <DialogContent>
                    <Grid
                      container
                      spacing={1}
                      direction="column"
                      className={classes.root}>
                      <Typography className={classes.formTitle}>
                        {`Are you sure you want to remove ${currentEmployee.full_name}`}
                      </Typography>
                      <Grid item xs={12}></Grid>
                      <Grid item xs={12}></Grid>
                    </Grid>
                  </DialogContent>
                  <DialogActions>
                    <Button
                      onClick={handleDeleteEmployee}
                      variant="contained"
                      color="secondary">
                      YES
                    </Button>
                    <Button
                      onClick={closeDeleteDialog}
                      variant="contained"
                      color="secondary">
                      NO
                    </Button>
                  </DialogActions>
                </Dialog>
              </div>
            </>
          ) : (
            <Typography style={{ padding: "10px" }}>No Animals</Typography>
          )}
        </>
      )}
    </div>
  );
};

export default AdminEmployeeSection;
