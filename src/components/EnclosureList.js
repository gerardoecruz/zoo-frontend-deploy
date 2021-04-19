import React, { useEffect, useState, useContext } from "react";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import { makeStyles } from "@material-ui/core/styles";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Link from "@material-ui/core/Link";

//Import images
import Elephant from "../images/Elephant.jpg";
import Giraffe from "../images/Giraffe.jpg";
import Lion from "../images/Lion.jpg";
import Rhinoceros from "../images/Rhinoceros.jpg";
import Tiger from "../images/Tiger.jpg";
import The_Safari from "../images/The_Safari.jpg";

import {
  List,
  ListItem,
  ListItemIcon,
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
  InputLabel,
  Input,
  FormHelperText,
} from "@material-ui/core";

import axios from "axios";
import { base_url } from "../config";
import { TextField } from "@material-ui/core";
import { images_path } from "../config";
import { useRouteMatch } from "react-router-dom";

import { UserContext } from "./UserContext";
import { useFormik } from "formik";
import Alert from "@material-ui/lab/Alert";

const enclosure_data = [
  {
    enclosureName: "Elepant",
    img: Elephant,
    description: "This enclosure consists of Afriran American Elephants",
  },
  {
    enclosureName: "Rhinoceros",
    img: Rhinoceros,
    description: "Come witness on of the most magnificent mammals",
  },
  {
    enclosureName: "Giraffe",
    img: Giraffe,
    description: "Come meet the tallest terrestrial animal",
  },
  {
    enclosureName: "Tiger",
    img: Tiger,
    description: "The Largest and most fierce cat",
  },
  {
    enclosureName: "Lion",
    img: Lion,
    description: "The King of the Junge is here!",
  },
];

const useStyles = makeStyles({
  listCategory: {
    textTransform: "uppercase",
    fontWeight: "bold",
    paddingTop: "10px",
  },
  divider: {
    height: "5px",
    backgroundColor: "green",
    width: "100%",
  },
  grid: {
    padding: "10px",
  },
});

const cardStyles = makeStyles({
  root: {
    width: "280px",
    // height: "300px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  media: {
    height: 140,
  },
});

const EnclosureCard = ({ name, description, image, id }) => {
  let { url } = useRouteMatch();
  const classes = cardStyles();

  return (
    <div>
      <Card className={classes.root}>
        <div>
          <CardActionArea>
            <CardMedia
              className={classes.media}
              image={image}
              title="Contemplative Reptile"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                {name}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                {description}
              </Typography>
            </CardContent>
          </CardActionArea>
        </div>
        <div>
          <Link style={{ textDecoration: "none" }} href={`${url}/${id}`}>
            <CardActions>
              <Button size="small" color="primary">
                Learn More
              </Button>
            </CardActions>
          </Link>
        </div>
      </Card>
    </div>
  );
};

const EnclosureList = () => {
  const classes = useStyles();

  const [enclosures, setEnclosures] = useState([]);

  const getAllEnclosures = () => {
    axios
      .get(`https://zoo-backend-test.herokuapp.com/locations/all_enclosures`)
      .then((res) => {
        console.log(res);

        // console.log(res);
        // const with_image = res.data.map((e) => {
        //   return {
        //     ...e,
        //     location_img: URL.createObjectURL(new Blob(e.image.data, {type: "application/zip"}),
        //   };
        // });
        console.log(res.data);
        setEnclosures(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const { user } = useContext(UserContext);
  const [alertError, setAlertError] = useState(null);

  const [addDialog, setAddDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState(false);
  const openAddDialog = () => {
    setAddDialog(true);
  };

  const closeAddDialog = () => {
    setAddDialog(false);
  };

  const [location_name, setLocationName] = useState("");
  const [location_type, setLocationType] = useState("Enclosure");

  const handleCreateEnclosure = () => {
    const data = new FormData();
    data.append("location_name", location_name);
    data.append("location_type", location_type);
    data.append("location_image", selectedFile);
    axios
      .post("https://zoo-backend-test.herokuapp.com/locations", data)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        //Log In failed.
        console.log(err.response);
        console.log("Errors: ", err.response.data);
        let errors_response = err.response.data.errors;
        // let new_errors = { email: "", password: "" };
        // if (Array.isArray(errors_response)) {
        //   errors_response.forEach((error) => {
        //     new_errors[error.param] = error.msg;
        //   });
        //   setErrors(new_errors);
        // } else {
        //   setAlertError(err.response.data.error);
        // }
      });
  };

  useEffect(() => {
    getAllEnclosures();
    // console.log(enclosures);
  }, []);

  return (
    <div className={classes.categoryContainer}>
      {/* <Navbar></Navbar> */}

      <Typography className={classes.listCategory}>Enclosures</Typography>

      <Grid direction="row" container spacing={2} className={classes.grid}>
        {enclosures.map((enclosure, i) => {
          return (
            <Grid item key={i}>
              <EnclosureCard
                name={enclosure.location_name}
                image={`/uploads/${enclosure.location_image}`}
                id={enclosure.location_id}
              />
            </Grid>
          );
        })}
      </Grid>

      {user.role == "Admin" ? (
        <Grid item>
          <Button variant="contained" onClick={openAddDialog}>
            Add Enclosure
          </Button>
        </Grid>
      ) : null}

      {/* Modal for adding new item to gift shop */}
      <div>
        <Dialog open={addDialog} onClose={closeAddDialog}>
          <DialogTitle>Add New Enclosure</DialogTitle>
          <DialogContent>
            <Grid
              container
              spacing={1}
              direction="column"
              className={classes.root}>
              <Typography className={classes.formTitle}></Typography>
              {alertError ? (
                <Alert severity="error" style={{ paddingBottom: "10px" }}>
                  {alertError}
                </Alert>
              ) : null}
              <Grid item xs={12}>
                <TextField
                  label="Name"
                  id="location_name"
                  onChange={(e) => {
                    setLocationName(e.target.value);
                  }}
                  name="location_name"
                  variant="outlined"
                  style={{ width: "100%" }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" component="label">
                  Upload File
                  <input
                    id="file"
                    name="location_name"
                    type="file"
                    onChange={(event) => {
                      setSelectedFile(event.target.files[0]);
                    }}
                  />
                </Button>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleCreateEnclosure}
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
    </div>
  );
};

export default EnclosureList;
