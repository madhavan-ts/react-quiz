import { useReducer, useState } from "react";


// function reducer(state, action) {
//   console.log(state, action);

//   if (action.type === "inc") return state + 1;
//   if (action.type === "dec") return state - 1;
//   if (action.type === "setCount") return action.payload;

// }


function reducer(state, action) {
  console.log(state, action);


  switch (action.type) {
    case "dec": return { ...state, count: state.count - state.step };
    case "inc": return { ...state, count: state.count + state.step };
    case "setCount": return { ...state, count: action.payload };
    case "setStep": return { ...state, step: action.payload };
    case "reset": return { count: 0, step: 1 }
    default: throw new Error("Unknown action");
  }

}


function DateCounter() {
  // const [count, setCount] = useState(0);
  // const [count, countDispatcher] = useReducer(reducer, 0);
  // const [step, setStep] = useState(1);

  const [state, dispatcher] = useReducer(reducer, { count: 0, step: 1 });

  const { count, step } = state

  // This mutates the date object.
  const date = new Date("june 21 2027");
  date.setDate(date.getDate() + count);

  const dec = function () {
    // setCount((count) => count - 1);
    dispatcher({ type: "dec" });
    // setCount((count) => count - step);
  };

  const inc = function () {
    // setCount((count) => count + 1);
    dispatcher({ type: "inc" });
    // setCount((count) => count + step);
  };

  const defineCount = function (e) {

    dispatcher({ type: "setCount", payload: Number(e.target.value) })
    // setCount();
  };

  const defineStep = function (e) {
    dispatcher({ type: "setStep", payload: Number(e.target.value) });
  };

  const reset = function () {
    dispatcher({ type: "reset" })

    // setCount(0);
    // setStep(1);
  };

  return (
    <div className="counter">
      <div>
        <input
          type="range"
          min="0"
          max="10"
          value={step}
          onChange={defineStep}
        />
        <span>{step}</span>
      </div>

      <div>
        <button onClick={dec}>-</button>
        <input value={count} onChange={defineCount} />
        <button onClick={inc}>+</button>
      </div>

      <p>{date.toDateString()}</p>

      <div>
        <button onClick={reset}>Reset</button>
      </div>
    </div>
  );
}
export default DateCounter;
