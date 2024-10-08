function StartScreen({ noOfQuestions, dispatcher }) {
  return (
    <div className="start">
      <h2>Welcome to the React Quiz!</h2>
      <h3>{noOfQuestions} questions to test your React mastery</h3>
      <button
        className="btn btn-ui"
        onClick={() => dispatcher({ type: "start" })}
      >
        Let's Start
      </button>
    </div>
  );
}

export default StartScreen;
