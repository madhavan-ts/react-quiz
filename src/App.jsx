// import DateCounter from "./DateCounter";
import { useEffect, useReducer } from "react";
import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";
// import Points from "./Points";
const SECONDS_PER_QUESTION = 30;
let initialState = {
  questions: [],
  // "loading","active","ready","error","finished"
  status: "loading",
  currentQuestion: 0,
  answer: null,
  points: 0,
  highscore: 0,
  remainingSeconds: 50,
};

function reducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      return { ...state, questions: action.payload, status: "ready" };
    case "dataFailed":
      return { ...state, status: "error" };
    case "start":
      return {
        ...state,
        status: "active",
        remainingSeconds: state.questions.length * SECONDS_PER_QUESTION,
      };
    case "newAnswer":
      let question = state.questions[state.currentQuestion];

      return {
        ...state,
        answer: action.payload,
        points:
          state.points +
          (question.correctOption === action.payload ? question.points : 0),
      };
    case "nextQuestion":
      if (state.currentQuestion === state.questions.length - 1)
        return {
          ...state,
          currentQuestion: 0,
          status: "finished",
          answer: null,
          highscore:
            state.highscore < state.points ? state.points : state.highscore,
        };

      return {
        ...state,
        currentQuestion: state.currentQuestion + 1,
        answer: null,
        status: "active",
      };
    case "restart":
      return {
        ...state,
        currentQuestion: 0,
        answer: null,
        points: 0,
        status: "ready",
      };
    case "tick":
      if (state.remainingSeconds > 0)
        return {
          ...state,
          remainingSeconds: state.remainingSeconds - 1,
        };

      return { ...state, remainingSeconds: 0, status: "finished" };
    default:
      throw new Error("Invalid action type");
  }
}

function App() {
  const [state, dispatcher] = useReducer(reducer, initialState);
  useEffect(function () {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:8081/questions");
        const data = await res.json();
        dispatcher({ type: "dataReceived", payload: data });
      } catch (err) {
        dispatcher({ type: "dataFailed" });
      }
    };

    fetchData();
  }, []);

  let {
    questions,
    status,
    currentQuestion,
    answer,
    points,
    highscore,
    remainingSeconds,
  } = state;
  let numQuestions = questions.length;

  let totalPoints = questions.reduce(
    (acc, curr) => Number(acc) + Number(curr.points),
    0
  );
  return (
    <div className="app">
      <Header />
      <Main>
        {/* <p>1/10</p> */}
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && (
          <StartScreen noOfQuestions={numQuestions} dispatcher={dispatcher} />
        )}

        {status === "active" && (
          <>
            <Progress
              points={points}
              totalPoints={totalPoints}
              answer={answer}
              numQuestions={numQuestions}
              currentQuestion={currentQuestion}
            />
            <Question
              question={questions[currentQuestion]}
              dispatcher={dispatcher}
              answer={answer}
            />
            <Timer
              dispatcher={dispatcher}
              remainingSeconds={remainingSeconds}
            />
          </>
        )}

        {status === "finished" && (
          <FinishScreen
            points={points}
            totalPoints={totalPoints}
            highscore={highscore}
            dispatcher={dispatcher}
          />
        )}
      </Main>
    </div>
  );
}

function FinishScreen({ points, totalPoints, highscore, dispatcher }) {
  return (
    <>
      <p className="result">
        You scored <b>{points}</b> out of {totalPoints} (
        {Math.ceil((points / totalPoints) * 100)}%)
      </p>
      <p className="highscore">Highscore : {highscore} </p>

      <button
        className="btn btn-ui"
        onClick={() => dispatcher({ type: "restart" })}
      >
        Restart
      </button>
    </>
  );
}

function Timer({ dispatcher, remainingSeconds }) {
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  useEffect(() => {
    // console.log(remainingSeconds);
    const timer = () => {
      dispatcher({ type: "tick" });
    };
    const id = setInterval(timer, 1000);

    return () => {
      console.log("cleared the timer");

      clearInterval(id);
    };
  }, [dispatcher]);
  return (
    <div className="timer">{`${minutes < 10 ? "0" + minutes : minutes}:${
      seconds < 10 ? "0" + seconds : seconds
    }`}</div>
  );
}

function Progress({
  points,
  totalPoints,
  currentQuestion,
  numQuestions,
  answer,
}) {
  return (
    <>
      <progress
        value={currentQuestion + Number(answer !== null)}
        max={numQuestions}
      >
        {Math.round((currentQuestion / numQuestions) * 100)}%
      </progress>

      <div className="progress">
        <p>
          Question <b> {currentQuestion + 1}</b> / {numQuestions}
        </p>
        <p>
          <b>{points}</b> / {totalPoints} points
        </p>
      </div>
    </>
  );
}

export default App;
