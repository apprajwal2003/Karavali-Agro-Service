import { useState } from "react";

export default async function Auth() {
  const [signUp, setSignUp] = useState(true);

  return (
    <div>
      <h2>{signUp ? "Signin" : "Login"} </h2>
      <input type="text" />
      <input type="password" />
      <button type="submit"></button>
    </div>
  );
}
