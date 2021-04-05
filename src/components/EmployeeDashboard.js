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
  // Modal,
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import axios from "axios";
// import { base_url } from "../config";
import { useFormik } from "formik";
import { makeStyles } from "@material-ui/core/styles";
import { useContext } from "./UserContext";

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

  const [animal, setAnimal] = useState({
    date_arrived: null,
    deceased_date: null,
    birth_day: null,
    location: "",
    animal_name: "",
  });

  const getEnclosureNames = () => {
    axios
      .get(`https://zoo-backend-test.herokuapp.com/enclosures`)
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
    if (!values.birth_day) {
      errors.birth_day = "Required";
    }
    if (!values.species) {
      errors.species = "Required";
    }
    return errors;
  };

  const handleSubmit = (values) => {
    console.log("handleSubmit called");
    axios
      .post(`https://zoo-backend-test.herokuapp.com/animals`, {
        date_arrived: values.date_arrived,
        deceased_date: values.deceased_date,
        birth_day: values.birth_day,
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
      birth_day: "",
      location: "",
      animal_name: "",
      species: "",
    },
    validate,
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

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
                error={formik.errors.birth_day}
                name="birth_day"
              />
              <FormHelperText className={classes.errMessage}>
                {formik.errors.birth_day}
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
    </>
  );
};

export default EmployeeDashboard;
