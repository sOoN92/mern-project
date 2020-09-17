import React, { useState } from "react";
import { Button, TextField } from "@material-ui/core";
import "./style.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function loginUser() {
    const res = await fetch("http://localhost:1337/api/login", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password,
      }),
    }).then(t => t.json());

    if (res.status === 'ok') {
      localStorage.setItem('token', res.data);
      alert('You are logged in')
    } else {
      alert(res.error);
    }
  }

  return (
    <div className="form">
      <h1>Login</h1>
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
        <Button color="primary" variant="contained" onClick={loginUser}>
          Login
        </Button>
      </form>
    </div>
  );
}
