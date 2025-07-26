// import React from 'react'
import { useEffect, useReducer } from "react";
import Header from "./components/Header";
import Loader from "./components/Loader";
import Error from "./components/Error";
import Main from "./components/Main";
import StartScreen from "./components/StartScreen";
import Question from "./components/Question";
import NextButton from "./components/NextButton";
import Progress from "./components/Progress";
import FinishedScreen from "./components/FinishedScreen";

const intialState = {
  questions: [],

  // 'loading', 'error', 'ready', 'active', 'finished'
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
};
function reducer(state, action) {
  switch (action.type) {
    case "dataRecieved":
      return {
        ...state,
        questions: action.payload,
        status: "ready",
      };
    case "dataFailed":
      return {
        ...state,
        status: "error",
      };
    case "start":
      return { ...state, status: "active" };
    case "nextQuestion":
      return { ...state, index: state.index + 1, answer: null };
    case "newAnswer": {
      const question = state.questions.at(state.index);
      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      };
    }
    default:
      throw new Error("action is unknow");
  }
}

const App = () => {
  const [{ questions, status, index, answer, points }, dispatch] = useReducer(
    reducer,
    intialState
  );
  const numQuestions = questions.length;
  const maxPossiblePoint = questions.reduce(
    (prev, cur) => prev + cur.points,
    0
  );
  useEffect(() => {
    async function getData() {
      try {
        const response = await fetch("http://localhost:8000/questions");
        if (!response.ok) {
          throw new Error("Data cannot be fetched check API!");
        }
        const data = await response.json();
        dispatch({ type: "dataRecieved", payload: data });
        console.log(data);
      } catch (err) {
        console.log(err.message);
        dispatch({ type: "dataFailed" });
      }
    }
    getData();
  }, []);
  return (
    <div className="app">
      <Header />
      <Main>
        {status === "Loading" && <Loader />}
        {status === "Error" && <Error />}
        {status === "ready" && (
          <StartScreen
            dispatch={dispatch}
            points={points}
            numQuestions={numQuestions}
          />
        )}
        {status === "active" && (
          <>
            <Progress
              answer={answer}
              maxPossiblePoint={maxPossiblePoint}
              points={points}
              index={index}
              numQuestion={numQuestions}
            />
            <Question
              dispatch={dispatch}
              question={questions[index]}
              answer={answer}
            />
            <NextButton
              numQuestion={numQuestions}
              index={index}
              dispatch={dispatch}
              answer={answer}
            />
          </>
        )}
        {status === "finished" && (
          <FinishedScreen points={points} maxPossiblePoint={maxPossiblePoint} />
        )}
      </Main>
    </div>
  );
};

export default App;
