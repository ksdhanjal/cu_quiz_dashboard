import React, { useState } from "react";
import NavBar from "../components/NavBar";
import Head from "next/head";
import SubmitButton from "../components/SubmitButton";
import { ButtonStates } from "../lib/enums";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { functions } from "../lib/firebase";
import { httpsCallable } from "firebase/functions";
import DepartmentsDropdown from "../components/DepartmentsDropdown";

async function addStudentToDB(studentData, onsuccess) {
  const addStudent = httpsCallable(functions, "createStudent");

  try {
    await addStudent(studentData).then((result) => {
      const data = result.data;
      if (data.success) {
        toast.success(data.message);
        onsuccess();
      } else toast.error(data.message);
    });
  } catch (err) {
    console.error(err);
  }
}

function AddStudent() {
  const [studentData, setStudentData] = useState({
    name:"",
    uid:"",
    phone:"",
    department:"",
    semester:"",
  });

  const [submitButtonState, setsubmitButtonState] = useState(
    ButtonStates.DEFAULT
  );

  const resetStudentData = () => {
    setStudentData({
      name: "",
      uid: "",
      phone: "",
      department: "",
      semester: "",
    });
  };
  return (
    <div>
      
      <Head>
        <title>Chandigarh University Quiz - Add Student</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <NavBar />

      <div>
        <form onSubmit={(e) => e.preventDefault()}>
          <h3>Add Student Form</h3>
          <label className="mt-5">
            Student Name
            <input
              type="text"
              value={studentData.name}
              onChange={(e) => {
                setStudentData({ ...studentData, name: e.target.value });
              }}
              placeholder="Name of the Student"
            />
          </label>
          <label>
            Student UID
            <input
              type="text"
              value={studentData.uid}
              onChange={(e) => {
                setStudentData({ ...studentData, uid: e.target.value });
              }}
              placeholder="Student UID eg. '19bav1181'"
            />
          </label>

          <label>
            Student Mobile Number
            <input
              type="tel"
              value={studentData.phone}
              onChange={(e) => {
                setStudentData({ ...studentData, phone: e.target.value });
              }}
              placeholder="Enter Student Mobile number eg. '0123456789'"
            />
          </label>

          <DepartmentsDropdown
            value={studentData.department}
            onChange={(event) => {
              setStudentData({
                ...studentData,
                department: event.target.value,
              });
            }}
          />

          <label>
            Semester
            <input
              type="number"
              value={studentData.semester}
              onChange={(e) => {
                setStudentData({ ...studentData, semester: e.target.value });
              }}
              placeholder="student semester eg. 3"
            />
          </label>
          <div className="mt-10 flex justify-between">
            <SubmitButton
              buttonState={submitButtonState}
              loadingText="Adding Student..."
              onClick={async () => {
                setsubmitButtonState(ButtonStates.LOADING);
                await addStudentToDB(studentData, () => {
                  resetStudentData();
                });
                setsubmitButtonState(ButtonStates.DEFAULT);
              }}
              className="form-button-primary"
            >
              Submit
            </SubmitButton>

            <button
              onClick={resetStudentData}
              className="form-button-secondary"
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddStudent;
