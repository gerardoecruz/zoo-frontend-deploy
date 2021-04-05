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

const useStyles = makeStyles({
  select: {
    minWidth: 150,
  },
  errMessage: {
    color: "red",
  },
});

const AdminDashboard = () => {
  const classes = useStyles();

  const [employees, setEmployees] = useState([]);

  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const [currentEmployee, setCurrentEmployee] = useState({
    full_name: "",
    work_location: "",
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

  const handleWorkLocationChange = (e) => {
    let newEmployee = {
      ...currentEmployee,
      work_location: e.target.value,
    };
    setCurrentEmployee(newEmployee);
  };

  const handleSave = () => {
    axios
      .put("https://zoo-backend-test.herokuapp.com/employees/change_work_location", {
        new_location: currentEmployee.work_location,
        employee_id: currentEmployee.employee_id,
      })
      .then((res) => {
        console.log(res);
        setOpenDialog(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleCancel = () => {
    setOpenDialog(false);
  };

  const handleModalOpen = (employee) => {
    setCurrentEmployee(employee);
    setOpenDialog(true);
  };

  return (
    <div style={{ padding: "10px" }}>
      {loading ? (
        <LinearProgress color="primary" />
      ) : (
        <>
          {employees.length > 0 && locations.length > 0 ? (
            <>
              <Typography>{`All Employees`}</Typography>
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
                              variant="outlined"
                              onClick={() => {
                                handleModalOpen(employee);
                              }}>
                              Edit
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
                  <DialogTitle>
                    Change the Work location of {currentEmployee.full_name}
                  </DialogTitle>
                  <DialogContent>
                    <Select
                      id="health_status"
                      value={currentEmployee.work_location}
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
                      onClick={handleSave}
                      variant="contained"
                      color="secondary">
                      Save
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
            <Typography style={{ padding: "10px" }}>No Animals</Typography>
          )}
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
