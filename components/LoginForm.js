import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { db, functions } from "../lib/firebase";
import { httpsCallable } from "firebase/functions";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SubmitButton from "./SubmitButton";
import { ButtonStates } from "../lib/enums";


function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [buttonState, setButtonState] = useState(ButtonStates.DEFAULT);

  async function signIn() {
    const loginCallable = httpsCallable(functions, "teacherLogin");
    await loginCallable({ email: email, pass: password })
      .then((response) => {
        if (response.data.responseCode == 1) {
          console.log("saving userData");
          localStorage.setItem("isLoggedIn", true);
          localStorage.setItem("userID", response.data.userID);
          localStorage.setItem("email", email);
          router.reload();
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        toast.error(error.message);
      });
  }
  return (
    <div className="relative w-[300px] mx-auto top-[50%] translate-y-[-50%] text-center text-white items-center">
      <Image
        src="/images/cuq-logo.png"
        className="rounded-3xl"
        width="200px"
        height="200px"
      />

      <p className="font-semibold text-3xl">Log in</p>
      <p className="mt-5 font-light text-xs">
        Welcome to Chandigarh university quiz managament system
      </p>

      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mt-8 rounded-full px-4 py-2 text-black min-w-[300px] outline-none text-sm bg-white bg-opacity-50 border placeholder-[#ddd] border-[#ddd] focus:bg-opacity-100 focus:placeholder-gray-500"
      />

      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter your password"
        className="mt-2 mb-10 rounded-full px-4 py-2 text-black min-w-[300px] outline-none text-sm bg-white bg-opacity-50 border placeholder-[#ddd] border-[#ddd] focus:bg-opacity-100 focus:placeholder-gray-500"
      />

      <SubmitButton
        buttonState={buttonState}
        loadingText="Signing in..."
        onClick={async () => {
          setButtonState(ButtonStates.LOADING);
          await signIn();
          setButtonState(ButtonStates.DEFAULT);
        }}
      >
        Sign in
      </SubmitButton>
    </div>
  );
}

export default LoginForm;
