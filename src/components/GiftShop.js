import React, { useState, useContext } from "react"; 
import { UserContext } from "./UserContext";
import { useHistory } from "react-router-dom";

function GiftShop(){
    const { user } = useContext(UserContext); 

    return <>
        <div className = 'primary'>
            <div className = 'primary-container'>
                <h4 className = 'title'> Zoovenirs </h4>
            </div>
        </div>
        <br />
        <div className="container">
            <div className="multiline"></div>
                <div> Some Item </div>
                    <button> Purchase </button>
        </div>
    </>
}

export default GiftShop