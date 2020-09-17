import React, { useState } from "react";
import { Button, TextField } from "@material-ui/core";
import "./style.css";
import { apiCall } from "../../utilities";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function registerUser() {
    const res = await apiCall('/api/register', {email, password});
    console.log(res);
  }

  return (
    <div className="form">
      <h1>Register</h1>
      <form className="register-fields">
        <TextField
          fullWidth
          placeholder="you@awesome.com"
          label="Your Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          variant="outlined"
        />
        <TextField
          fullWidth
          type="password"
          placeholder="password"
          label="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          variant="outlined"
        />
        <Button color="primary" variant="contained" onClick={registerUser}>
          Register
        </Button>
      </form>
    </div>
  );
}
