"use client";
import { useState } from "react";

export default function Auth() {
  const [signUp, setSignUp] = useState(true);
  setSignUp(false);

  return (
    <div>
      <h2>{signUp ? "Signin" : "Login"} </h2>
      <input type="text" />
      <input type="password" />
      <button type="submit"></button>
    </div>
  );
}
