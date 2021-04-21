import React, { useEffect, useContext, useState } from "react";
import { UserContext } from "./UserContext";
import { Typography, Snackbar, IconButton, Button } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import axios from "axios";
import Alert from "@material-ui/lab/Alert";
import { IndeterminateCheckBoxOutlined } from "@material-ui/icons";

const Messages = () => {
  const { user } = useContext(UserContext);
  const [messages, setMessages] = useState([]);
  //   Get all messages for this user.
  useEffect(() => {
    axios
      .post("/messages", {
        user_id: parseInt(user.userID),
      })
      .then((res) => {
        console.log(res);
        setMessages(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const deleteMessage = (message) => {
    console.log(message);
    axios
      .delete(`/messages/delete/${message.message_id}`, message)
      .then((res) => {
        let new_messages = messages.filter(
          (mes) => mes.message_id != message.message_id
        );
        console.log("New messages: ", new_messages);
        setMessages(new_messages);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      {messages.length > 0 ? (
        <div style={{ width: "50%" }}>
          {messages.map((mes) => (
            <Alert
              key={mes.message_id}
              onClose={() => {
                deleteMessage(mes);
              }}>
              {mes.message}
            </Alert>
          ))}
        </div>
      ) : (
        <Typography>No Messages</Typography>
      )}
    </>
  );
};

export default Messages;
