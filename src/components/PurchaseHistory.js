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
    const { user } = useContext(UserContext);
    let id = user.userID;

    let history = useHistory();

    //Get purchase history.
    const [purchases, setPurchases] = useState([]);

    const getPurchases = () => {
        axios
            .get(`/purchaseHistory/history`, {
                params: { userID: id },
            })
            .then((res) => {
                console.log(res);
                setPurchases(res.data);
                // setLoading(false);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    useEffect(() => {
        getPurchases();
    }, []);

    console.log(purchases); 

    return (
        <div style={{ padding: "10px" }}>
             
                    <>
                        {purchases.length > 0 ? (
                            <>
                                <Typography>{`Purchase History`}</Typography>
                                <TableContainer
                                    component={Paper}
                                    style={{ width: 800, paddingTop: "10px" }}>
                                    <Table aria-label="simple table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Name </TableCell>
                                                <TableCell align="right">Purchase Date</TableCell>
                                                
                                                <TableCell align="right">Quantity</TableCell>
                                                <TableCell align = "right">Total Cost</TableCell>

                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {purchases.map((purchase) => (
                                                <TableRow key={purchase.transaction_id}>
                                                    <TableCell component="th" scope="row">
                                                        {purchase.product_name}
                                                    </TableCell>
                                                    <TableCell align="right">
                                                    {purchase.purchase_time.toString().split("T")[0]}
                                                    </TableCell>
                                                    
                                                    <TableCell align="right">{purchase.quantity_purchased}</TableCell>
                                                    <TableCell align="right">
                                                        {"$" + purchase.total_purchase_cost}

                                                    </TableCell>
                                                    

                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </>
                        ) : (
                                <Typography style={{ padding: "10px" }}>No Purchases</Typography>
                            )}
                    </>
                
        </div>
    );
};

export default EnclosureDetailed;
