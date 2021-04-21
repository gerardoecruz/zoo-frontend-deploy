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
const EnclosureDetailed = ({ match }) => {
    // console.log(match);

    const { user } = useContext(UserContext);

    let history = useHistory();
    console.log(history);
    const classes = useStyles();

    const [loading, setLoading] = useState(true);

    const [openDialog, setOpenDialog] = useState(false);

    //Modal
    const [currentAnimal, setCurretAnimal] = useState({
        animal_name: "",
    });
    const [open, setOpen] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState(false);

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
            .put("/animals/change_health", currentAnimal)
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
            .get(`/locations/by_id`, {
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
            .get(`/animals/list_by_enclosure/`, {
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
    
    const handleDeleteAnimal = () => {
        axios
            .delete(`/animals/delete/${currentAnimal.animal_id}`)
            .then((res) => {
                setDeleteDialog(false);
                getAnimals();
                console.log(res);
            })
            .catch((err) => {
                console.log(err);
            });
    };
    const openDeleteDialog = (animal) => {
        setCurretAnimal(animal);
        setDeleteDialog(true);
        console.log(animal);
    };

    const closeDeleteDialog = () => {
        setDeleteDialog(false);
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

                                                {user.role == "Employee" ? (
                                                    <TableCell align="right">Health Status</TableCell>
                                                ) : null}
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
                                                    <TableCell align="right">{animal.birth_date.toString().split("T")[0]}</TableCell>
                                                    <TableCell align="right">
                                                        {animal.date_arrived.toString().split("T")[0]}

                                                    </TableCell>
                                                    {user.role == "Employee" ? (
                                                        <TableCell align="right">
                                                            {animal.health_status}
                                                        </TableCell>) : null}
                                                    {user.role == "Employee" ? (
                                                        <TableCell align="right">
                                                            <Button
                                                                variant="outlined"
                                                                onClick={() => {
                                                                    handleModalOpen(animal);
                                                                }}>
                                                                Edit
                            </Button>
                                                            <Button
                                                                variant="outlined"
                                                                onClick={() => {
                                                                    openDeleteDialog(animal);
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
                                                    {`Are you sure you want to remove ${currentAnimal.animal_name}`}
                                                </Typography>
                                                <Grid item xs={12}></Grid>
                                                <Grid item xs={12}></Grid>
                                            </Grid>
                                        </DialogContent>
                                        <DialogActions>
                                            <Button
                                                onClick={handleDeleteAnimal}
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

export default EnclosureDetailed;
