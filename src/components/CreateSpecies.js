import React, { useState } from "react";
import {
  Grid,
  FormLabel,
  InputLabel,
  Input,
  FormHelperText,
  Button,
  FormControl,
  Snackbar,
} from "@material-ui/core";

import Alert from "@material-ui/lab/Alert";

import axios from "axios";
import { useFormik } from "formik";
const CreateSpecies = (props) => {
  const [successMesage, setSuccessMessage] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const validate = (values) => {
    console.log(values);
    let errors = {};
    if (values.name == "") {
      errors.name = "Required";
    }
    return errors;
  };

  const formik = useFormik({
    initialValues: {
      name: "",
    },
    validate,
    onSubmit: (values) => {
      axios
        .post("/species/create", {
          species_name: values.name,
        })
        .then((res) => {
          props.getSpecies();
          console.log(res);
          setSuccessMessage("Successfully Added New Species");
          setOpen(true);
        })
        .catch((err) => {
          console.log(err);
          setErrMsg(err.response.data.error);
          setOpen(true);
        });
    },
  });
  const [open, setOpen] = useState(false);
  return (
    <Grid container style={{ marginLeft: "10px" }}>
      <Grid item>
        <FormControl>
          <InputLabel htmlFor="name">Species Name</InputLabel>
          <Input
            id="name"
            onChange={formik.handleChange}
            name="name"
            error={formik.errors.name}
          />
          <FormHelperText style={{ color: "red" }}>
            {formik.errors.name}
          </FormHelperText>
        </FormControl>
      </Grid>
      <Grid item>
        <Button variant="outlined" onClick={formik.handleSubmit} type="submit">
          Add Species
        </Button>
      </Grid>

      <Snackbar
        open={open}
        autoHideDuration={2000}
        onClose={() => {
          setSuccessMessage("");
          setErrMsg("");
          setOpen(false);
        }}>
        <div>
          {successMesage !== "" ? (
            <Alert severity="success">{successMesage}</Alert>
          ) : (
            <Alert severity="error">{errMsg}</Alert>
          )}
        </div>
      </Snackbar>
    </Grid>
  );
};

export default CreateSpecies;
