import Head from "next/head";
import { useEffect, useState } from "react";
import Login from "./login";
import Dashboard from "./dashboard";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
  }, [isLoggedIn]);

  function getHomeComponent() {
    if (isLoggedIn) {
      console.log("logged in is true");
      return <Dashboard />;
    } else {
      return <Login />;
    }
  }
  return (
    <div className="">
      <Head>
        <title>Chandigarh University Quiz</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      {getHomeComponent()}
    </div>
  );
}
