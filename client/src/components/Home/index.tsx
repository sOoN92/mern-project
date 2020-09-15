import React from "react";
import { Button } from "@material-ui/core";
import { Link } from "react-router-dom";
import "./style.css";

export default function Home() {
  return (
    <div className="App">
      <header className="App-Header">
        <p>Simple Chat Room App</p>
        <div className="buttons">
          <Button
            color="secondary"
            variant="contained"
            component={Link}
            to="/login"
          >
            Login
          </Button>
          <Button
            color="primary"
            variant="contained"
            component={Link}
            to="/register"
          >
            Register
          </Button>
        </div>
      </header>
    </div>
  );
}
