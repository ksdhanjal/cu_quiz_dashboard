import React, { useState } from "react";
import Head from "next/head";
import NavBar from "../components/NavBar";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { db, functions } from "../lib/firebase";
import { httpsCallable } from "firebase/functions";

import { collection, addDoc } from "firebase/firestore";
import SubmitButton from "../components/SubmitButton";
import { ButtonStates } from "../lib/enums";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
import DepartmentsDropdown from "../components/DepartmentsDropdown";

function publishTest(testData, allquestions, onSuccess, onError) {
  const createTest = httpsCallable(functions, "createTest");
  createTest({
    ...testData,
    questions: allquestions,
    maxMarks: questions.length,
  })
    .then(onSuccess)
    .catch(onError);
}

function CreateTest() {
  const [submitButtonState, setsubmitButtonState] = useState(
    ButtonStates.DEFAULT
  );
  const departments = ["B.CA", "B.Tech", "B.Eng", "M.CA", "M.Tech", "M.Eng"];
  const [testData, setTestData] = useState({
    testName: "",
    department: "",
    testDuration: "",
    subject: "",
    semester: "",
  });
  const questionData = {
    question: "",
    incorrectOptions: ["", "", ""],
    correctOption: "",
    id: uniqueID(),
  };

  function resetForm() {
    setTestData({
      testName: "",
      testDuration: "",
      department: "",
      subject: "",
      semester: "",
    });
    setAllQuestions([{ ...questionData, id: uniqueID() }]);
  }

  const [allquestions, setAllQuestions] = useState([
    { ...questionData, id: uniqueID() },
  ]);

  return (
    <div>
  
      <Head>
        <title>CU Quiz - Create Test</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <NavBar />
      <form
        className="min-w-full mt-5 sm:min-w-min sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl 2xl:max-w-6xl"
        onSubmit={(e) => e.preventDefault()}
      >
        <h3>Create Test</h3>

        <label className="mt-5">
          Test Name:
          <input
            type="text"
            value={testData.testName}
            onChange={(e) => {
              setTestData({
                ...testData,
                testName: e.target.value,
              });
            }}
            placeholder="Name of this test"
          />
        </label>

        <DepartmentsDropdown
          value={testData.department}
          onChange={(event) => {
            setTestData({ ...testData, department: event.target.value });
          }}
        />

        <label>
          Subject:
          <input
            type="text"
            value={testData.subject}
            onChange={(e) => {
              setTestData({ ...testData, subject: e.target.value });
            }}
            placeholder="Subject name eg. Maths"
          />
        </label>

        <label>
          Semester:
          <input
            type="number"
            value={testData.semester}
            onChange={(e) => {
              if (e.target.value >= 0 && e.target.value <= 8) {
                setTestData({
                  ...testData,
                  semester: e.target.value,
                });
              }
            }}
            placeholder="Semester eg. 1"
          />
        </label>

        <label>
          Test Duration(in minutes):
          <input
            type="number"
            value={testData.testDuration}
            onChange={(e) => {
              if (e.target.value >= 0) {
                setTestData({
                  ...testData,
                  testDuration: e.target.value,
                });
              }
            }}
            placeholder="Enter the duration of the Test"
          />
        </label>

        <h3 className="mt-4">All Questions:</h3>

        <TransitionGroup component="div">{buildQuestions()}</TransitionGroup>
        <button
          onClick={async () => {
            let newQuestion = questionData;
            setAllQuestions([...allquestions, newQuestion]);
            await timeout(100);
            window.scrollTo({
              top: document.body.scrollHeight,
              behavior: "smooth",
            });
          }}
          className="bg-gray-400 hover:bg-primary text-white text-2xl cursor-pointer hover:scale-110 active:scale-95 transition-all rounded-full mx-auto w-10 h-10"
        >
          +
        </button>

        <div className="mt-10" />

        <SubmitButton
          text="Publish Test"
          loadingText="Publishing..."
          onClick={() => {
            setsubmitButtonState(ButtonStates.LOADING);
            publishTest(
              testData,
              allquestions,
              () => {
                setsubmitButtonState(ButtonStates.DEFAULT);
                toast.success("Test published successfully");
                setTimeout(() => resetForm(), 2000);
              },
              () => {
                setsubmitButtonState(ButtonStates.DEFAULT);
                toast.error("Failed to publishing test! Please try again");
              }
            );
          }}
          buttonState={submitButtonState}
        />
      </form>
    </div>
  );

  function buildQuestions() {
    const questions = [];
    allquestions.map((currentQuestion, index) => {
      questions.push(
        <CSSTransition
          key={currentQuestion.id}
          timeout={700}
          classNames="question_item"
        >
          <div className="mt-4">
            <label>
              Question {index + 1}:
              <textarea
                placeholder="Question"
                value={currentQuestion.question}
                onChange={(event) => {
                  let newQuestions = [...allquestions];
                  newQuestions[index].question = event.target.value;
                  setAllQuestions(newQuestions);
                }}
              />
            </label>
            <label>
              Correct Option:
              <input
                type="text"
                value={currentQuestion.correctOption}
                onChange={(event) => {
                  let newQuestions = [...allquestions];
                  newQuestions[index].correctOption = event.target.value;
                  setAllQuestions(newQuestions);
                }}
                placeholder="Correct Option"
              />
            </label>
            <label>
              Incorrect Options:
              <div className="flex flex-col lg:flex-row lg:space-x-4">
                {currentQuestion.incorrectOptions.map((option, index) => (
                  <input
                    className="lg:flex-grow"
                    key={index}
                    type="text"
                    value={option}
                    onChange={(event) => {
                      let newQuestions = [...allquestions];
                      currentQuestion.incorrectOptions[index] =
                        event.target.value;
                      setAllQuestions(newQuestions);
                    }}
                    placeholder={`Incorrect Option ${index + 1}`}
                  />
                ))}
              </div>
              {allquestions.length > 1 && (
                <button
                  onClick={() => {
                    let newQuestions = [...allquestions];
                    newQuestions.splice(index, 1);
                    setAllQuestions(newQuestions);
                  }}
                  className="mt-5 mr-0 ml-auto form-button-secondary"
                >
                  Remove Question
                </button>
              )}
            </label>
          </div>
        </CSSTransition>
        //
      );
    });
    return questions;
  }
}

export default CreateTest;

function timeout(delay) {
  return new Promise((res) => setTimeout(res, delay));
}

function uniqueID() {
  const id = Math.floor(Math.random() * Date.now());
  return id;
}
