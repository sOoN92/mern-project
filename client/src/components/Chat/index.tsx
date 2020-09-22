import {
  Avatar,
  Button,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
  Typography,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

type Message = {
  user: string;
  message: string;
  intent: "chat";
  date: Date;
};

function processMessage(payload: string) {
  try {
    return JSON.parse(payload);
  } catch (error) {
    return null;
  }
}

export default function Chat() {
  const [chatMessage, setChatMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<Message[]>([]);

  const [wsRef, setWsRef] = useState<null | WebSocket>(null);

  const history = useHistory();

  function sendMessage() {
    if (wsRef?.readyState !== WebSocket.OPEN) {
      return;
    }
    wsRef.send(JSON.stringify({ message: chatMessage, intent: "chat" }));
    setChatMessage("");
  }

  useEffect(() => {
    const ws = new WebSocket(
      `ws://localhost:1338/${localStorage.getItem("token")}`
    );

    ws.addEventListener(
      "open",
      () => {
        ws.send(
          JSON.stringify({
            intent: "old-messages",
            count: 10
          })
        );
      },
      { once: true }
    );

    ws.addEventListener("error", () => {
      alert("Please login first");
      history.replace("/login");
    });

    ws.addEventListener("message", (e) => {
      const data = e.data;

      const message: any = processMessage(data);

      if (!message) return;

      if (message.intent === "chat") {
        setChatMessages((oldMessages) => [...oldMessages, message as Message]);
      } else if (message.intent === 'old-messages') {
        setChatMessages(message.data.map((item: any) => ({
          user: item.email,
          message: item.message,
          date: item.date
        })));
      }
    });

    setWsRef(ws);
    return () => ws.close();
  }, []);

  // ADD ANOTHER ACTION "MORE MESSAGES"
  // 1. another click handler
  // 2. extract smallest date of current messages
  // 3. send a new ws request with old-message but with date as prop

  return (
    <div>
      <h1>Chat Page</h1>
      <div className="chat-box">
        {chatMessages.map((m, index) => {
          return (
            <ListItem alignItems="flex-start" key={index}>
              <ListItemAvatar>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
              </ListItemAvatar>
              <ListItemText
                primary={m.user}
                secondary={
                  <React.Fragment>
                    <Typography
                      component="span"
                      variant="body2"
                      color="textPrimary"
                    >
                      {m.message}
                    </Typography>
                  </React.Fragment>
                }
              ></ListItemText>
            </ListItem>
          );
        })}
      </div>
      <TextField
        onChange={(e) => setChatMessage(e.target.value)}
        value={chatMessage}
        multiline
        rows={2}
        variant="outlined"
        color="primary"
      />
      <Button variant="outlined" color="primary" onClick={sendMessage}>
        Send Message
      </Button>
    </div>
  );
}
