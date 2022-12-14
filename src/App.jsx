import "./style.css"
import { useState } from "react";

export default function App() {
  const [calculation, setCalculation] = useState({
    currentOperand: "",
    previousOperand: "",
    operation: ""
  });

  const addDigit = (event) => {
    const currentOperand = calculation.currentOperand;
    
    setCalculation(state => {
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: event.target.value,
          overwrite: false
        }
      } else if (currentOperand === "0" && event.target.value === "0") {
        return state;

      } else if ((currentOperand.includes(".") 
        || currentOperand === "") 
        && event.target.value === ".") {
        return state;

      } else if (currentOperand.includes(".") 
        && currentOperand.slice(currentOperand.indexOf(".")).length > 8) { /* to limit decimal places up to 8 */
        return state;

      } else {
        return {
          ...state,
          currentOperand: `${currentOperand || ""}${event.target.value}`
        };
      }
    })
  };

  const chooseOperation = (event) => {
    setCalculation(state => {
      if (calculation.currentOperand === "" && calculation.previousOperand === "") {
        return state;
      } else if (calculation.currentOperand === "") {
        return {
          ...state,
          operation: event.target.value
        }
      } else if (calculation.previousOperand === "") {
        return {
          ...state,
          previousOperand: calculation.currentOperand,
          operation: event.target.value,
          currentOperand: ""
        }
      } 

      return {
        ...state,
        previousOperand: evaluate(state),
        operation: event.target.value,
        currentOperand: ""
      }
      
    })
  };

  const clear = () => {
    setCalculation({ currentOperand: "", previousOperand: "", operation: "" });
  };

  const deleteDigit = () => {
    setCalculation(state => {
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: "",
          overwrite: false
        }
      } else if (state.currentOperand === "") {
        return state;
      } else if (state.currentOperand.length === 1) {
        return {
          ...state,
          currentOperand: ""
        }
      }
      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1)
      }
    })
  };

  const equals = () => {
    setCalculation(state => {
      if (state.currentOperand === "" 
        || state.previousOperand === "" 
        || state.operation === "") {
          return state;
        }
      return {
        ...state,
        overwrite: true,
        operation: "",
        previousOperand: "",
        currentOperand: evaluate(state)
      }
    })
  };

  const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
    maximumFractionDigits: 0
  })

  function formatOperand(operand) {
    if (operand && operand.includes(".")) {
      const [integer, decimal] = operand.split(".");
      return [INTEGER_FORMATTER.format(integer), decimal].join(".");
    } else if (operand) {
      return INTEGER_FORMATTER.format(operand);
    }
  }
  
  const evaluate = ({currentOperand, previousOperand, operation}) => {
    const prev = parseFloat(previousOperand);
    const current = parseFloat(currentOperand);
    if (isNaN(prev) || isNaN(current)) {
      return ""
    }
    let computation = "";
    switch (operation) {
      case "÷":
        computation = prev / current;
        break;
      case "×":
        computation = prev * current;
        break;
      case "+":
        computation = prev + current;
        break;
      case "-":
        computation = prev - current;
        break;
    }

    return computation.toString();
  };

  

  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">{calculation.previousOperand} {calculation.operation}</div>
        <div className="current-operand">{formatOperand(calculation.currentOperand)}</div>
      </div>
      <button type="button" className="span-two" onClick={clear}>AC</button>
      <button type="button" onClick={deleteDigit}>DEL</button>
      <button type="button" value={"÷"} onClick={chooseOperation}>÷</button>
      <button type="button" value={"1"} onClick={addDigit}>1</button>
      <button type="button" value={"2"} onClick={addDigit}>2</button>
      <button type="button" value={"3"} onClick={addDigit}>3</button>
      <button type="button" value={"×"} onClick={chooseOperation}>×</button>
      <button type="button" value={"4"} onClick={addDigit}>4</button>
      <button type="button" value={"5"} onClick={addDigit}>5</button>
      <button type="button" value={"6"} onClick={addDigit}>6</button>
      <button type="button" value={"+"} onClick={chooseOperation}>+</button>
      <button type="button" value={"7"} onClick={addDigit}>7</button>
      <button type="button" value={"8"} onClick={addDigit}>8</button>
      <button type="button" value={"9"} onClick={addDigit}>9</button>
      <button type="button" value={"-"} onClick={chooseOperation}>-</button>
      <button type="button" value={"."} onClick={addDigit}>.</button>
      <button type="button" value={"0"} onClick={addDigit}>0</button>
      <button type="button" className="span-two" onClick={equals}>=</button>
    </div>
  );
}















