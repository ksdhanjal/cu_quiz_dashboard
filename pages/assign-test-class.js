import React, { useEffect, useState } from "react";
import Head from "next/head";
import NavBar from "../components/NavBar";
import DepartmentsDropdown from "../components/DepartmentsDropdown";
import SubmitButton from "../components/SubmitButton";
import { ButtonStates } from "../lib/enums";
import {
  collection,
  query,
  where,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { db, functions } from "../lib/firebase";
import { httpsCallable } from "firebase/functions";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

async function assignTest(assignedTestData, onSuccess, onError) {
  const callable = httpsCallable(functions, "assignTestToClass");

  console.log("assignTest", assignedTestData);

  await callable(assignedTestData)
    .then((res) => {
      if (res.data.success) {
        toast.success(res.data.message);
        onSuccess();
      } else {
        toast.error(res.data.message);
        onError();
      }
    })
    .catch(() => {
      toast.error("Something went wrong, Please try agin later!");
      onError();
    });
}

function AssignTestToClass() {
  const [assignedTestData, setassignedTestData] = useState({
    department: "",
    semester: "",
    subject: "",
    testDate: "",
    testTime: "",
    testName: "",
    testID: "",
  });

  useEffect(() => {
    const date = new Date(
      assignedTestData.testDate + " " + assignedTestData.testTime
    );
    const timestamp = Timestamp.fromDate(date);
    setassignedTestData({
      ...assignedTestData,
      testDateTime: timestamp,
    });
  }, [assignedTestData.testDate, assignedTestData.testTime]);

  const [buttonState, setButtonState] = useState(ButtonStates.DEFAULT);

  const [allTests, setAllTests] = useState([]);

  async function getAllTests() {
    const q = query(
      collection(db, "tests"),
      where("department", "==", assignedTestData.department),
      where("semester", "==", assignedTestData.semester)
    );
    const querySnapshot = await getDocs(q);

    const tests = [];
    querySnapshot.forEach((doc) => {
      tests.push({ ...doc.data(), testID: doc.id });
    });
    setAllTests(tests);
  }

  useEffect(() => {
    getAllTests();
  }, [assignedTestData.department, assignedTestData.semester]);

  return (
    <div>
    
      <Head>
        <title>CU Quiz - Assign Test to Class</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <NavBar />

      <form
        className="min-w-full mt-5 sm:min-w-min sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl 2xl:max-w-6xl"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <h3 className="mb-5">Assign test to class</h3>
        <DepartmentsDropdown
          onChange={(e) => {
            setassignedTestData({
              ...assignedTestData,
              department: e.target.value,
            });
          }}
          value={assignedTestData.department}
        />
        <label>
          Semester:
          <input
            value={assignedTestData.semester}
            onChange={(e) => {
              setassignedTestData({
                ...assignedTestData,
                semester: e.target.value,
              });
            }}
            type="number"
            placeholder="Enter the semester"
          />
        </label>

        <label>
          Subject:
          <input
            value={assignedTestData.subject}
            onChange={(e) => {
              setassignedTestData({
                ...assignedTestData,
                subject: e.target.value,
              });
            }}
            type="text"
            placeholder="Enter the Subject"
          />
        </label>

        <label>
          Test Date:
          <input
            value={assignedTestData.testDate}
            onChange={(e) => {
              setassignedTestData({
                ...assignedTestData,
                testDate: e.target.value,
              });
            }}
            type="date"
            placeholder="Enter the test date"
          />
        </label>

        <label>
          Test Time:
          <input
            value={assignedTestData.testTime}
            onChange={(e) => {
              setassignedTestData({
                ...assignedTestData,
                testTime: e.target.value,
              });
            }}
            type="time"
            placeholder="Enter the test time"
          />
        </label>

        <label>
          Select Test:
          <select
            onChange={(e) => {
              setassignedTestData({
                ...assignedTestData,
                testName: e.target.value,
                testID: allTests[e.target.options.selectedIndex - 1].testID,
              });
            }}
          >
            <option value="val">Select a test</option>
            {allTests.map((test, index) => (
              <option key={test.testID} value={test.testName}>
                {test.testName}
              </option>
            ))}
          </select>
        </label>

        <SubmitButton
          text="Assign Test"
          buttonState={buttonState}
          loadingText="Assigning Test"
          onClick={async () => {
            setButtonState(ButtonStates.LOADING);
            await assignTest(
              assignedTestData,
              // onSuccess
              () => {},
              // onError
              () => {}
            );
            setButtonState(ButtonStates.DEFAULT);
          }}
        />
      </form>
    </div>
  );
}

export default AssignTestToClass;
