import React, { useEffect, useState } from "react";
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
  TableRow,
  TableCell,
  Table,
  Paper,
  TableContainer,
  TableHead,
  TableBody,
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

const EmployeeDashboard = () => {
  const classes = useStyles();

  //Get all the enclosure names:
  const [enclosureNames, setEnclosureNames] = useState([]);
  const [species, setSpecies] = useState([]);
  const [animals, setAnimals] = useState([]);

  const [animal, setAnimal] = useState({
    date_arrived: null,
    deceased_date: null,
    birth_date: null,
    location: "",
    animal_name: "",
  });

  const getEnclosureNames = () => {
    axios
      .get(`https://zoo-backend-test.herokuapp.com/locations/all_enclosures`)
      .then((res) => {
        console.log(res.data);

        setEnclosureNames(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getAllSpecies = () => {
    axios
      .get(`https://zoo-backend-test.herokuapp.com/species`)
      .then((res) => {
        console.log(res.data);
        setSpecies(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getEnclosureNames();
    getAllSpecies();
  }, []);

  const validate = (values) => {
    let errors = {};
    if (!values.animal_name) {
      errors.animal_name = "Required";
    }
    if (!values.location) {
      errors.location = "Required";
    }
    if (!values.date_arrived) {
      errors.date_arrived = "Required";
    }
    if (!values.birth_date) {
      errors.birth_date = "Required";
    }
    if (!values.species) {
      errors.species = "Required";
    }
    return errors;
  };
  const [values, setValues] = useState({
    investigator: "",
    checked: true,
    purchase: "",
    enclosure: "",
    animal: "",
    customer: "",
    dateFrom: "",
    dateTo: "",
  });
  const handleReport = (values) => {
    console.log("handleReport called");
    axios
      .post("https://zoo-backend-test.herokuapp.com/values", {
        investigator: values.investigator,
        checked: true,
        purchase: values.purchase,
        enclosure: values.ensloure,
        animal: values.animal,
        customer: values.customer,
        dateFrom: values.dateFrom,
        dateTo: values.dateTo,
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };
  const handlecheck = (event) => {
    setValues({ ...values, [event.target.name]: event.target.checked });
  };

  const handleSubmit = (values) => {
    console.log("handleSubmit called");
    axios
      .post(`https://zoo-backend-test.herokuapp.com/animals`, {
        date_arrived: values.date_arrived,
        deceased_date: values.deceased_date,
        birth_date: values.birth_date,
        location: values.location,
        animal_name: values.animal_name,
        species: values.species,
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const formik = useFormik({
    initialValues: {
      date_arrived: "",
      deceased_date: null,
      birth_date: "",
      location: "",
      animal_name: "",
      species: "",
    },
    validate,
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

  const reportForm = useFormik({
    initialValues: {
      date_from: "",
      date_to: "",
      species: "",
      health_status: "",
    },
    onSubmit: (values) => {
      // console.log(values);
      axios
        .post("https://zoo-backend-test.herokuapp.com/reports/employee_report", values)
        .then((res) => {
          setAnimals(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  });
  const classy = theStyles();

  return (
    <>
      <form className="form">
        <Typography>Add Animal to Zoo</Typography>
        <Grid container spacing={2} style={{ padding: "10px" }}>
          <Grid item>
            <FormControl>
              <InputLabel htmlFor="name">Name</InputLabel>
              <Input
                id="name"
                onChange={formik.handleChange}
                name="animal_name"
                error={formik.errors.animal_name}
              />
              <FormHelperText className={classes.errMessage}>
                {formik.errors.animal_name}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid item>
            <FormControl>
              <InputLabel id="enclosureName">Enclosure Name</InputLabel>
              <Select
                labelId="enclosureName"
                onChange={formik.handleChange}
                name="location"
                error={formik.errors.location}
                className={classes.select}>
                {enclosureNames.map((e, index) => (
                  <MenuItem key={index} value={e.location_id}>
                    {e.location_name}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText className={classes.errMessage}>
                {formik.errors.location}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid item>
            <FormControl>
              <InputLabel id="species">Species</InputLabel>
              <Select
                labelId="species"
                onChange={formik.handleChange}
                name="species"
                error={formik.errors.species}
                className={classes.select}>
                {species.map((s, index) => (
                  <MenuItem key={index} value={s.species_id}>
                    {s.species_name}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText className={classes.errMessage}>
                {formik.errors.species}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid item>
            <FormControl>
              <InputLabel id="dob" shrink>
                Date of Birth
              </InputLabel>
              <Input
                labelId="dob"
                type="date"
                onChange={formik.handleChange}
                error={formik.errors.birth_date}
                name="birth_date"
              />
              <FormHelperText className={classes.errMessage}>
                {formik.errors.birth_date}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid item>
            <FormControl>
              <InputLabel id="dob" shrink>
                Arrival Date
              </InputLabel>
              <Input
                labelId="dob"
                type="date"
                defaultValue={new Date().toDateString()}
                onChange={formik.handleChange}
                error={formik.errors.date_arrived}
                name="date_arrived"
              />
              <FormHelperText className={classes.errMessage}>
                {formik.errors.date_arrived}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              onClick={formik.handleSubmit}
              type="submit">
              Add Animal
            </Button>
          </Grid>
        </Grid>
      </form>

      <form>
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
              }}>
             
            </Typography>
          </div>
          <div>
            <FormControl
              spacing={2}
              style={{ marginBottom: "20px", width: "40%" }}
              className={clsx(classy.margin, classy.textField)}
              variant="outlined">
              
            </FormControl>

            
          </div>

          <Typography
            align="left"
            style={{
              fontSize: "18px",
            }}>
            Select atleast one item:{" "}
          </Typography>
          <div>
            <FormControl
              style={{
                marginBottom: "20px",
                width: "40%",
                marginRight: "10px",
              }}
              className={clsx(classy.margin, classy.textField)}
              variant="outlined">
              <InputLabel id="species">Species</InputLabel>
              <Select
                labelId="species"
                onChange={reportForm.handleChange}
                name="species"
                className={classes.select}>
                {species.map((s, index) => (
                  <MenuItem key={index} value={s.species_id}>
                    {s.species_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl
              style={{ marginBottom: "20px", width: "40%" }}
              className={clsx(classy.margin, classy.textField)}
              variant="outlined">
              <InputLabel id="health_status">Health Status</InputLabel>
              <Select
                labelId="health_status"
                onChange={reportForm.handleChange}
                name="health_status"
                className={classes.select}>
                <MenuItem value="Healthy">Healthy</MenuItem>
                <MenuItem value="Sick">Sick</MenuItem>
                <MenuItem value="Deceased">Deceased</MenuItem>
              </Select>
            </FormControl>
          </div>
          <FormControl style={{ marginBottom: "20px", marginRight: "40px" }}>
            <InputLabel id="date_from" shrink>
              Date From:
            </InputLabel>
            <Input
              labelId="activity-from"
              name="date_from"
              type="date"
              onChange={reportForm.handleChange}
            />
          </FormControl>
          <FormControl>
            <InputLabel id="date_to" shrink>
              Date To:
            </InputLabel>
            <Input
              labelId="activity-to"
              name="date_to"
              type="date"
              onChange={reportForm.handleChange}
            />
          </FormControl>
          <Button variant="contained" onClick={reportForm.handleSubmit}>
            Get Report
          </Button>
        </div>
      </form>

      {/* Table to display the animals */}
      <>
        {
          animals.length > 0 ? (
            <>
              <Typography>{`Report Result`}</Typography>
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
                        <TableCell align="right">
                          {animal.birth_date.toString().split("T")[0]}
                        </TableCell>
                        <TableCell align="right">
                          {animal.date_arrived.toString().split("T")[0]}
                        </TableCell>
                        <TableCell align="right">
                          {animal.health_status}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          ) : null
          //   <Typography style={{ padding: "10px" }}>No Animals</Typography>
        }
      </>
    </>
  );
};

export default EmployeeDashboard;
