import React from "react";
import LoginForm from "../components/LoginForm";


function Login() {
  return (
    <main>
      <div className="bg-login bg-center h-[100vh] w-full]">
        <div className="bg-black bg-opacity-40 backdrop-blur-[10px] h-[100vh] w-full relative">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}

export default Login;
