import React, { useEffect, useState } from "react";
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

import axios from "axios";
import { base_url } from "../config";
import { TextField } from "@material-ui/core";
import { images_path } from "../config";
import { useRouteMatch } from "react-router-dom";

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
      .get(`https://zoo-backend-test.herokuapp.com/locations/all_enclsoures`)
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
    </div>
  );
};

export default EnclosureList;
