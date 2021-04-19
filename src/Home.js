import React from "react";
import Grid from '@material-ui/core/Grid';
import background from "./images/zoo.jpg";
import elephant from "./images/home_elephant.jpg";
import bird from "./images/home_bird.jpg";
import monkey from "./images/home_monkey.jpg";
import penguin from "./images/home_penguin.jpg";
import tiger from "./images/home_tiger.jpg";
import Button from "@material-ui/core/Button";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import { Link } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';

function Home() {
    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef(null);
    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };
    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    };
    function handleListKeyDown(event) {
        if (event.key === "Tab") {
            event.preventDefault();
            setOpen(false);
        }
    }
    const prevOpen = React.useRef(open);
    React.useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }
        prevOpen.current = open;
    }, [open]);

    // temporary home page
    // need to figure out loggin in
    const tileData = [
        {
            img: background,
            // title: ,
            cols: 2,

            featured: true
        },
        {
            img: bird,

            cols: 2,
            // featured: true
        },
        {
            img: elephant,

            cols: 2,

            // featured: true
        },
        {
            img: monkey,

            cols: 2,

            // featured: true
        },
        {
            img: penguin,

            cols: 2,

            //  featured: true
        },
        {
            img: tiger,

            cols: 2,

            // featured: true
        },
    ];
    const theStyles = makeStyles((theme) => ({
        root: {
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-around',
            overflow: 'hidden',
            backgroundColor: 'transparent',
            position: 'absolute',
            width: '80%',
            height: '400%',
            fontColor: '#194d33',
            fontSize: '27px',
        },
        paper: {
            width: '350px',
            padding: theme.spacing(2),
            textAlign: 'left',
            color: theme.palette.text.secondary,
        },
    }));
    const useStyles = makeStyles((theme) => ({
        root: {

            display: 'flex',
            justify: 'center',
            flexWrap: 'wrap',
            justifyContent: 'space-around',
            overflow: 'hidden',
            backgroundColor: theme.palette.background.paper,
        },
        gridList: {
            width: '80%',
            height: '350%',
        },
        icon: {
            color: 'rgba(255, 255, 255, 0.54)',
        },
    }));
    const theclasses = theStyles();
    const classes = useStyles();
    return (
        <div>
            <div>
                <div>

                    {/* <Button component={Link} to="/ticket"
                        style={{
                            position: 'relative',
                            width: '25%',
                            borderRadius: 5,
                            backgroundColor: "white",
                            padding: "7px 26px",
                            fontSize: "16px",
                            fontWeight: 'bold'
                        }}
                        variant="contained"
                        color="white"
                        ref={anchorRef}
                        onClick={handleToggle}>
                        Ticket
          </Button> */}
                    <Button component={Link} to="/enclosure"
                        style={{
                            position: 'relative',
                            width: '25%',
                            borderRadius: 5,
                            backgroundColor: "white",
                            padding: "7px 26px",
                            fontSize: "16px",
                            fontWeight: 'bold'

                        }}
                        variant="contained"
                        color="white"
                        ref={anchorRef}
                        onClick={handleToggle}>
                        Enclosures
          </Button>
                    {/* <Button component={Link} to="/giftshops"
                        style={{
                            position: 'relative',
                            width: '25%',
                            borderRadius: 5,
                            backgroundColor: "white",
                            padding: "7px 26px",
                            fontSize: "16px",
                            fontWeight: 'bold'

                        }}
                        variant="contained"
                        color="white"
                        ref={anchorRef}
                        onClick={handleToggle}>
                        GiftShop
          </Button> */}

                    <div className={classes.root}>

                        <GridList cellHeight={350} className={classes.gridList}>
                            <GridListTile key="Subheader" cols={1} style={{ height: 'auto' }}>
                                <ListSubheader component="div"></ListSubheader>
                            </GridListTile>
                            {tileData.map((tile) => (
                                <GridListTile key={tile.img} cols={tile.cols || 1}>
                                    <img src={tile.img} alt={tile.title} />
                                    <GridListTileBar
                                        style={{

                                            backgroundColor: 'transparent'
                                        }}
                                        title={tile.title}
                                    // subtitle={<span>by: {tile.author}</span>}
                                    // actionIcon={
                                    //<IconButton aria-label={`info about ${tile.title}`} className={classes.icon}>
                                    //<InfoIcon />
                                    //</IconButton>
                                    //}
                                    />
                                </GridListTile>
                            ))}
                        </GridList>

                  </div>
                </div>
            </div>
        </div>

    );
}

export default Home;
