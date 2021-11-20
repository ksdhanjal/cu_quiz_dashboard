import React, { useState, useEffect } from "react";
import Head from "next/head";
import NavBar from "../components/NavBar";
import { useRouter } from "next/router";
import { db } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
function Dashboard() {
  const [teacherName, setTeacherName] = useState("");
  useEffect(() => {

    async function getTeacherName() {
      const userID = localStorage.getItem("userID");
      const _teacherRef = doc(db, "teachers", userID);
      const _teacherDoc = await getDoc(_teacherRef);
      if (_teacherDoc.exists) {
        setTeacherName(_teacherDoc.data()?.name ?? "");
        console.log("teacher name:-", teacherName);
      }
    }

    try {
      getTeacherName();
    } catch (e) {
      console.error("error caught while fetching teacher name",e);
    }
  }, [teacherName]);
  const router = useRouter();
  return (
    <div>
      <Head>
        <title>Chandigarh University Quiz</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <NavBar />
      <div className="mt-4 mx-auto max-w-lg px-2">
        <p className="text-center text-2xl ">
          Welcome {`${teacherName}!`} What would you like to do today?
        </p>

        <div className="mt-10 flex flex-col space-y-3 max-w-xs m-auto px-2">
          <Button
            text="Add a student"
            onClick={() => {
              router.push("/add-student");
            }}
          />
          <Button
            text="Create a test"
            onClick={() => {
              router.push("/create-test");
            }}
          />
          <Button
            text="Assign test to class"
            onClick={() => {
              router.push("/assign-test-class");
            }}
          />
          <Button
            text="View Student Marks"
            onClick={() => {
              router.push("/view-marks");
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

function Button({ text, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-primary text-white rounded-md py-2 hover:scale-105 active:scale-95 duration-150"
    >
      {text}
    </button>
  );
}
