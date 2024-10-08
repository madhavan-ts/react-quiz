import { useState } from "react";

function Question({ question, dispatcher, answer }) {
  // console.log(question);
  const { question: currentQuestion, options, correctOption } = question;
  // const [clickedOption, setClickedOption] = useState(null);
  return (
    <div>
      <h3>{currentQuestion}</h3>
      <div className="options">
        {options.map((item, index) => (
          <button
            className={`btn btn-option ${
              answer !== null && answer === index ? "answer" : ""
            } ${
              answer !== null
                ? index === correctOption
                  ? "correct"
                  : "wrong"
                : ""
            }`}
            disabled={answer !== null}
            onClick={() => {
              // console.log("clikced");
              dispatcher({ type: "newAnswer", payload: index });
            }}
            key={item}
          >
            {item}
          </button>
        ))}
      </div>
      {answer !== null && (
        <button
          className="btn btn-ui"
          onClick={() => dispatcher({ type: "nextQuestion" })}
        >
          Next
        </button>
      )}
    </div>
  );
}

export default Question;
