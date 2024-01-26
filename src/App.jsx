// Import React and necessary styles
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

// Define the main component
const App = () => {
  // State for connector type, expressions, output JSON, and error
  const [connectorType, setConnectorType] = useState("and");
  const [expressions, setExpressions] = useState([
    {
      ruleType: "",
      operator: "",
      value: "",
      score: "",
    },
  ]);
  const [outputJSON, setOutputJSON] = useState("");
  const [error, setError] = useState("");

  // Function to add a new expression to the state
  const addExpression = () => {
    setExpressions([
      ...expressions,
      { ruleType: "", operator: "", value: "", score: "" },
    ]);
  };

  // Function to delete an expression from the state
  const deleteExpression = (index) => {
    const newExpressions = [...expressions];
    newExpressions.splice(index, 1);
    setExpressions(newExpressions);
  };

  // Function to handle generating output JSON
  const handleGetOutput = () => {
    // Check if all fields in expressions are filled
    const isValid = expressions.every(
      (expression) =>
        expression.ruleType &&
        expression.operator &&
        expression.value &&
        expression.score
    );

    // If valid, generate output JSON
    if (isValid) {
      const output = {
        rules: expressions.map(({ ruleType, operator, value, score }) => ({
          // Convert ruleType to lowercase and replace spaces with underscores
          key: ruleType.toLowerCase().replace(/ /g, "_"),
          output: {
            value: parseFloat(value),
            operator,
            score: parseFloat(score),
          },
        })),
        combinator: connectorType,
      };

      // Display JSON output in the input field
      setOutputJSON(JSON.stringify(output, null, 2));

      // Clear the error if any
      setError("");
    } else {
      setError("All fields in expressions are required!");
    }
  };

  // JSX structure for the UI
  return (
    <div className="container m-auto mt-5 p-4 rounded bg-dark text-white">
      {/* Header */}
      <h1 className="mb-4">Expression Engine UI</h1>

      {/* Form Section */}
      <div className="row">
        <div className="col-md-6 mb-3 mb-md-0">
          {/* Connector Type Dropdown */}
          <div className="mb-3">
            <label>Connector Type</label>
            <select
              className="form-control bg-dark text-white"
              value={connectorType}
              onChange={(e) => setConnectorType(e.target.value)}
              required
            >
              <option value="and">AND</option>
              <option value="or">OR</option>
            </select>
          </div>

          {/* Expression Inputs */}
          {expressions.map((expression, index) => (
            <div key={index} className="mb-3">
              <label>Expression {index + 1}</label>
              <div className="row">
                {/* Rule Type Dropdown */}
                <div className="col-sm-6 col-md-3 mb-2">
                  <label htmlFor={`rule-type-${index}`}>Rule Type</label>
                  <select
                    id={`rule-type-${index}`}
                    className="form-control bg-dark text-white"
                    value={expression.ruleType}
                    onChange={(e) =>
                      setExpressions((prevExpressions) => {
                        const updatedExpressions = [...prevExpressions];
                        updatedExpressions[index].ruleType = e.target.value;
                        return updatedExpressions;
                      })
                    }
                    required
                  >
                    <option value="">Select</option>
                    <option value="age">Age</option>
                    <option value="credit-score">Credit Score</option>
                    <option value="account-balance">Account Balance</option>
                  </select>
                </div>

                {/* Operator Dropdown */}
                <div className="col-sm-6 col-md-3 mb-2">
                  <label htmlFor={`operator-${index}`}>Operator</label>
                  <select
                    id={`operator-${index}`}
                    className="form-control bg-dark text-white"
                    value={expression.operator}
                    onChange={(e) =>
                      setExpressions((prevExpressions) => {
                        const updatedExpressions = [...prevExpressions];
                        updatedExpressions[index].operator = e.target.value;
                        return updatedExpressions;
                      })
                    }
                    required
                  >
                    <option value="">Select</option>
                    <option value=">">{">"}</option>
                    <option value="<">{"<"}</option>
                    <option value=">=">{"≥"}</option>
                    <option value="<=">{"≤"}</option>
                    <option value="=">{"="}</option>
                  </select>
                </div>

                {/* Value Input */}
                <div className="col-sm-6 col-md-3 mb-2">
                  <label htmlFor={`value-${index}`}>Value</label>
                  <input
                    type="number"
                    id={`value-${index}`}
                    className="form-control bg-dark text-white"
                    value={expression.value}
                    onChange={(e) =>
                      setExpressions((prevExpressions) => {
                        const updatedExpressions = [...prevExpressions];
                        updatedExpressions[index].value = e.target.value;
                        return updatedExpressions;
                      })
                    }
                    required
                  />
                </div>

                {/* Score Input */}
                <div className="col-sm-6 col-md-3 mb-2">
                  <label htmlFor={`score-${index}`}>Score</label>
                  <input
                    type="number"
                    id={`score-${index}`}
                    className="form-control bg-dark text-white"
                    value={expression.score}
                    onChange={(e) =>
                      setExpressions((prevExpressions) => {
                        const updatedExpressions = [...prevExpressions];
                        updatedExpressions[index].score = e.target.value;
                        return updatedExpressions;
                      })
                    }
                    required
                  />
                </div>

                {/* Delete Button */}
                <div className="col-md-2 mt-2">
                  <button
                    className="btn btn-danger"
                    onClick={() => deleteExpression(index)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Add Expression and Get Output Buttons */}
          <div className="row mt-2">
            <div className="col-12 ">
              <button className="btn btn-primary" onClick={addExpression}>
                Add Expression
              </button>
              <span className="m"></span>
              <button
                className="btn btn-success ml-2"
                onClick={handleGetOutput}
              >
                Get Output
              </button>
              {error && <p className="text-danger mt-2">{error}</p>}
            </div>
          </div>
        </div>

        {/* Output JSON Section */}
        <div className="col-md-6">
          <div className="row mt-3">
            <div className="col-12">
              {/* Output JSON Label */}
              <label>Output JSON</label>

              {/* Output JSON Textarea */}
              <textarea
                className="form-control bg-dark text-white custom-scrollbar"
                rows="10"
                value={outputJSON}
                readOnly
              ></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Export the component
export default App;
