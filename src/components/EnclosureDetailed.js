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

const EnclosureDetailed = ({ match }) => {
  // console.log(match);

  const { user } = useContext(UserContext);

  let history = useHistory();
  console.log(history);

  const [loading, setLoading] = useState(true);

  const [openDialog, setOpenDialog] = useState(false);

  //Modal
  const [currentAnimal, setCurretAnimal] = useState({
    animal_name: "",
  });
  const [open, setOpen] = useState(false);

  const handleModalOpen = (animal) => {
    console.log("Animal", animal);
    setCurretAnimal(animal);
    setOpenDialog(true);
  };

  const handleModalClose = () => {
    setOpenDialog(false);
  };

  const handleHealthStatusChange = (e) => {
    setCurretAnimal({
      ...currentAnimal,
      health_status: e.target.value,
    });
  };

  const handleSave = () => {
    axios
      .put("https://zoo-backend-test.herokuapp.com/animals/change_health", currentAnimal)
      .then((res) => {
        setOpenDialog(false);
        console.log(res);
      })
      .catch((err) => {
        setOpenDialog(true);
        console.log(err);
      });
  };

  const handleCancel = () => {
    setOpenDialog(false);
  };

  //Get animals in the Enclosure.

  const [animals, setAnimals] = useState([]);

  const [enclosure, setEnclosure] = useState({});

  const getEnclosure = () => {
    axios
      .get(`https://zoo-backend-test.herokuapp.com/locations/enclosure/by_id`, {
        params: { location: match.params.id },
      })
      .then((res) => {
        console.log("Enclosure: ", res);
        setEnclosure(res.data[0]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getAnimals = () => {
    axios
      .get(`https://zoo-backend-test.herokuapp.com/animals/list_by_enclosure/`, {
        params: { location: match.params.id },
      })
      .then((res) => {
        console.log(res);
        setAnimals(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getEnclosure();
    getAnimals();
  }, []);

  return (
    <div style={{ padding: "10px" }}>
      {loading ? (
        <LinearProgress color="primary" />
      ) : (
        <>
          {animals.length > 0 ? (
            <>
              <Typography>{`Animals in ${enclosure.location_name} Enclosure`}</Typography>
              <TableContainer
                component={Paper}
                style={{ width: 800, paddingTop: "10px" }}>
                <Table aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Name </TableCell>
                      <TableCell align="right">Species</TableCell>
                      <TableCell align="right">Date of Birth</TableCell>
                      <TableCell align="right">Date Arrived</TableCell>
                      <TableCell align="right">Health Status</TableCell>
                      {user.role == "Employee" ? (
                        <TableCell align="right">Actions</TableCell>
                      ) : null}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {animals.map((animal) => (
                      <TableRow key={animal.animal_id}>
                        <TableCell component="th" scope="row">
                          {animal.animal_name}
                        </TableCell>
                        <TableCell align="right">
                          {animal.species_name}
                        </TableCell>
                        <TableCell align="right">{animal.birth_day}</TableCell>
                        <TableCell align="right">
                          {animal.date_arrived}
                        </TableCell>
                        <TableCell align="right">
                          {animal.health_status}
                        </TableCell>
                        {user.role == "Employee" ? (
                          <TableCell align="right">
                            <Button
                              variant="outlined"
                              onClick={() => {
                                handleModalOpen(animal);
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
                    Change the Health of {currentAnimal.animal_name}
                  </DialogTitle>
                  <DialogContent>
                    <Select
                      id="health_status"
                      value={currentAnimal.health_status}
                      onChange={handleHealthStatusChange}>
                      <MenuItem value={"Healthy"}>Healthy</MenuItem>
                      <MenuItem value={"Sick"}>Sick</MenuItem>
                      <MenuItem value={"Deceased"}>Deceased</MenuItem>
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

export default EnclosureDetailed;
