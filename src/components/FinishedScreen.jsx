import React from "react";

function FinishedScreen({ points, maxPossiblePoint }) {
  const percentage = (points / maxPossiblePoint) * 100;
  return (
    <p className="result">
      You scored <strong>{points}</strong> out of {maxPossiblePoint} (
      {Math.ceil(percentage)}%)
    </p>
  );
}

export default FinishedScreen;
