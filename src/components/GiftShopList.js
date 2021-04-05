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

import axios from "axios";
import { base_url } from "../config";
import { TextField } from "@material-ui/core";
import { images_path } from "../config";
import { useRouteMatch } from "react-router-dom";

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

const GiftShopCard = ({ name, description, image, id }) => {
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

const GiftShopList = () => {
  const classes = useStyles();

  const [giftShops, setGiftShops] = useState([]);

  const getAllGiftShops = () => {
    axios
      .get(`https://zoo-backend-test.herokuapp.com/locations/all_gift_shops`)
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
        setGiftShops(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getAllGiftShops();
    // console.log(enclosures);
  }, []);

  return (
    <div className={classes.categoryContainer}>
      {/* <Navbar></Navbar> */}
      <Typography className={classes.listCategory}>Gift Shops</Typography>
      <Grid direction="row" container spacing={2} className={classes.grid}>
        {giftShops.map((shop, i) => {
          return (
            <Grid item key={i}>
              <GiftShopCard
                name={shop.location_name}
                image={`/uploads/${shop.location_image}`}
                id={shop.location_id}
              />
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
};

export default GiftShopList;
