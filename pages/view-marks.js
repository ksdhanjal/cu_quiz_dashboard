import { useState, useEffect } from "react";
import Head from "next/head";
import NavBar from "../components/NavBar";
import DepartmentsDropdown from "../components/DepartmentsDropdown";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db, functions } from "../lib/firebase";
import { httpsCallable } from "firebase/functions";

function ViewStudentMarks() {
  const [allTests, setAllTests] = useState([]);
  const [testData, setTestData] = useState({
    testName: "",
    department: "",
    semester: "",
    testID: "",
    maxMarks: 0,
  });

  const [studentData, setStudentData] = useState([]);

  async function getAllTests() {
    const q = query(
      collection(db, "tests"),
      where("department", "==", testData.department),
      where("semester", "==", testData.semester)
    );
    const querySnapshot = await getDocs(q);

    const tests = [];
    querySnapshot.forEach((doc) => {
      tests.push({ ...doc.data(), testID: doc.id });
    });
    setAllTests(tests);
  }

  async function getTestResults() {
    const callable = httpsCallable(functions, "getTestResults");
    const result = callable({
      semester: testData.semester,
      department: testData.department,
    });
    result
      .then((result) => {
        setStudentData(result.data.students);
      })
      .catch((error) => {
        console.error("error in fetching test results:", error);
      });
  }

  useEffect(() => {
    getAllTests();
    if (testData.testID !== "") getTestResults();
  }, [testData.department, testData.semester, testData.testID]);
  const selectedTestID = "";
  return (
    <div>
      <Head>
        <title>CU Quiz - View Student Marks</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <NavBar />
      <div>
        <form className="min-w-full mt-5 sm:min-w-min sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl 2xl:max-w-6xl">
          <h3>View Students Marks:</h3>

          <DepartmentsDropdown
            className="mt-4"
            onChange={(e) => {
              setTestData({
                ...testData,
                department: e.target.value,
              });
            }}
            value={testData.department}
          />
          <label>
            Semester
            <input
              type="number"
              placeholder="Enter the semester"
              value={testData.semester}
              onChange={(e) => {
                if (e.target.value > 0 && e.target.value < 9) {
                  setTestData({
                    ...testData,
                    semester: e.target.value,
                    testID: "",
                  });
                }
              }}
            />
          </label>

          <label>
            Select Test:
            <select
              onChange={(e) => {
                if (e.target.options.selectedIndex > 0)
                  selectedTestID =
                    allTests[e.target.options.selectedIndex - 1].testID;
                else selectedTestID = "";
                setTestData({
                  ...testData,
                  testName: e.target.value,
                  testID: selectedTestID,
                  maxMarks:
                    allTests[e.target.options.selectedIndex - 1]?.maxMarks??0,
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

              {studentData !== undefined &&
            studentData.length == 0 &&
            testData.testID !== "" && (
              <p className="mt-5 text-xl text-primary font-semibold">
                Fetching results for test: {testData.testName}...
              </p>
            )}

          {studentData !== undefined &&
            studentData.length > 0 &&
            testData.testID !== "" && (
              <ResultsTable
                studentData={studentData}
                testId={testData.testID}
                maxMarks={testData.maxMarks}
              />
            )}
        </form>
      </div>
    </div>
  );
}

export default ViewStudentMarks;

function ResultsTable({ studentData, testId, maxMarks }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Marks:</h2>
      <table className="w-full table-auto border-separate border-2">
        <thead>
          <tr className="text-left">
            <th>Student Name</th>
            <th>Marks Obtained</th>
            <th>Max Marks</th>
          </tr>
        </thead>
        <tbody>
          {studentData.map((student, index) => {
            let submittedTests = student.submittedTest;
            let marks = 0;
            let hasAttempted = false;

            if (student.submittedTest !== undefined) {
              submittedTests.forEach((test) => {
                if (test.testID === testId) {
                  marks = test.marksObtained;
                  hasAttempted = true;
                }
              });
            }
            return (
              <tr key={index}>
                <td>{student.name}</td>
                <td>
                  <p>
                    {marks}{" "}
                    {!hasAttempted && (
                      <span className="text-primary">'NA'</span>
                    )}
                  </p>
                </td>
                <td>{maxMarks}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
