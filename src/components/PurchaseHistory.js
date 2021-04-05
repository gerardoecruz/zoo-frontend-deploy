import React from "react";
import './PurchaseHistory.css';
import axios from "axios";

//const express = require('express');
//const bodyParser = require('body-parser');
//const mysql = require('mysql');

const URL = 'database-1.cmkw6xcxraqi.us-east-1.rds.amazonaws.com'

/*const connection = mysql.createPool({
  host     : 'database-1.cmkw6xcxraqi.us-east-1.rds.amazonaws.com',
  user     : 'admin',
  password : 'admin1234',
  database : 'zoo_db'
});*/

const PurchaseHistory = () => {
    const [customers, setCustomers] = React.useState([])

    React.useEffect(() => {
        getData()
    }, [])

    const getData = async () => {

        const response = await axios.get(URL)
        setCustomers(response.data)
    }

    const renderHeader = () => {
        let headerElement = ['id', 'name', 'purchase date', 'item', 'quantity', 'total cost']

        return headerElement.map((key, index) => {
            return <th key={index}>{key.toUpperCase()}</th>
        })
    }

    const renderBody = () => {
        return customers && customers.map(({ id, name, date, item, quantity, cost }) => {
            return (
                <tr key={id}>
                    <td>{id}</td>
                    <td>{name}</td>
                    <td>{date}</td>
                    <td>{item}</td>
                    <td>{quantity}</td>
                    <td>{cost}</td>
                </tr>
            )
        })
    }

    return (
        <>
            <h1 id='title'>Purchase History</h1>
            <table id='customer'>
                <thead>
                    <tr>{renderHeader()}</tr>
                </thead>
                <tbody>
                    {renderBody()}
                </tbody>
            </table>
        </>
    )
}


export default PurchaseHistory;