import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";

export const FormItemLabel = styled.span`
  font-size: 14px;
  font-weight: 500;
  line-height: 14px;
  margin-bottom: 7px;
  color: #333333;
`;

const FakeInput = styled.div`
  position: relative;
  height: 40px;
  border: 1px solid ${props => (props.error ? "#DE4848" : "#ccc")};
  display: block;
  border-radius: 8px;
  width: 100%;
  cursor: text;
  ${props =>
    props.disabled &&
    `
    background-color: #eaeaea;
    cursor: not-allowed;
  `}
  ${props =>
    props.isFocused &&
    `
  border: 1px solid ${props.color};
    outline: none;
  `}
`;

const DateInput = styled.input`
  width: 25px;
  outline: 0;
  border: 0;
  background: transparent;
  padding: 11px 13px;
  font-size: 14px;
  &::placeholder {
    font-size: 14px;
    line-height: 16px;
    color: #ccc;
  }
  &:disabled {
    cursor: not-allowed;
  }
`;

const MonthInput = styled(DateInput)`
  padding-right: 5px;
  ${props =>
    props.isFilled &&
    `
    width: 18px;
  `}
`;

const YearInput = styled(DateInput)`
  padding-left: 5px;
  ${props =>
    props.isFilled &&
    `
    &::placeholder {
      color: transparent;
    }
  `}
`;

const Separator = styled.span`
  left: 25%;
  color: #ccc;
`;

const ExpiryDateInput = props => {
  // State
  const [isFocused, setIsFocused] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [monthFocus, setMonthFocus] = useState(null);
  const [yearFocus, setYearFocus] = useState(null);
  const [showSeparator, setShowSeparator] = useState(true);
  const [isOutside, setIsOutside] = useState(false);
  const monthRef = useRef(null);
  const yearRef = useRef(null);
  const fakeInputRef = useRef(null);
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const { onChange, disabled, onFocus, onBlur, value, hasError } = props;

  // --- Date handling methods
  useEffect(() => {
    let expiryDate = "";
    if (month) {
      expiryDate = month.concat(`/${year}`);
    }
    onChange(expiryDate);
    // Faking the placeholder for separator
    if (!month) {
      setShowSeparator(true);
    }
  }, [month, year]);

  const handleMonth = e => {
    const target = e.target;
    const validatedValue = validateMonth(target.value, month);
    setMonth(validatedValue);
    if (validatedValue) {
      if (validatedValue.length >= 2) {
        setShowSeparator(true);
        yearRef.current.focus();
      } else {
        setShowSeparator(false);
        monthRef.current.focus();
      }
    }
    if (yearRef.current.value) {
      setShowSeparator(true);
    }
  };

  const handleYear = e => {
    const target = e.target;
    const validatedValue = validateYear(target.value, year);
    setYear(validatedValue);
  };

  const validateMonth = (value, oldValue) => {
    const validator =
      value.length <= 2 &&
      /^\d*$/.test(value) &&
      (value === "" || (parseInt(value) >= 0 && parseInt(value) <= 12));
    if (validator) {
      console.log(validator, value, oldValue);
      return value;
    }
    console.log(validator, value, oldValue);
    monthRef.current.value = oldValue;
    return oldValue;
  };

  const validateYear = (value, oldValue) => {
    const validator =
      value.length <= 2 &&
      /^\d*$/.test(value) &&
      (value === "" || (parseInt(value) >= 0 && parseInt(value) <= 99));
    if (validator) {
      return value;
    }
    yearRef.current.value = oldValue;
    return oldValue;
  };
  // --- Event handling methods (Focus and Blur)
  const handleFocus = e => {
    e.stopPropagation();
    setIsFocused(true);
    onFocus && onFocus(e, value);
    // This two IF will make FakeInput act like a real <input />
    if (e.target) {
      console.log(yearRef.current.value);
      if (e.target.name === "month" && yearRef.current.value) {
        return yearRef.current.focus();
      } else if (e.target.name === "year" && !monthRef.current.value) {
        return monthRef.current.focus();
      }
    }
  };

  const handleClick = e => {
    e.stopPropagation();
    setIsFocused(true);
    setIsClicked(true);
    // This two IF will make FakeInput act like a real <input />
    if (showSeparator) {
      return yearRef.current.focus();
    }
    return monthRef.current.focus();
  };

  const handleBlur = e => {
    e.stopPropagation();
    setIsFocused(false);
  };

  const handleMonthYearBlurred = () => {
    onBlur && onBlur(value);
  };

  useEffect(() => {
    // To check if both month & year blurred
    if (isClicked && isOutside && monthFocus === false && yearFocus === false) {
      handleMonthYearBlurred();
    }
  }, [monthFocus, yearFocus, isOutside, isClicked]);

  useEffect(() => {
    if (isClicked) {
      global.window.addEventListener("click", handleOutsideClick);
      return () => {
        global.window.removeEventListener("click", handleOutsideClick);
      };
    }
  }, [isClicked]);

  const handleOutsideClick = e => {
    const fakeInput = fakeInputRef.current;
    if (!fakeInput.contains(e.target)) {
      setIsOutside(true);
    } else {
      setIsOutside(false);
    }
  };

  // --- Backspace handling method
  useEffect(() => {
    const fakeInput = fakeInputRef.current;
    if (fakeInput) {
      fakeInput.addEventListener("keydown", handleOnKeyDown);
    }

    return () => {
      fakeInput.removeEventListener("keydown", handleOnKeyDown);
    };
  }, [fakeInputRef]);

  const handleOnKeyDown = e => {
    const BACKSPACE_CODE = 8;
    if (e.keyCode === BACKSPACE_CODE && yearRef.current.value === "") {
      monthRef.current.focus();
    }
  };

  return (
    <FakeInput
      onClick={e => !disabled && handleClick(e)}
      isFocused={isFocused}
      error={hasError}
      disabled={disabled}
      ref={fakeInputRef}
      {...props}
    >
      <MonthInput
        data-id="month-input"
        ref={monthRef}
        radix="."
        value={month}
        placeholder="MM"
        autoComplete="off"
        name="month"
        disabled={disabled}
        onChange={e => handleMonth(e)}
        onFocus={e => {
          handleFocus(e);
          setMonthFocus(true);
          setYearFocus(false);
        }}
        onBlur={e => {
          handleBlur(e);
          setMonthFocus(false);
          setYearFocus(false);
        }}
        isFilled={!!month}
      />
      {showSeparator && <Separator data-id="seperator">/</Separator>}
      <YearInput
        data-id="year-input"
        ref={yearRef}
        autoComplete="off"
        value={year}
        placeholder="YY"
        name="year"
        disabled={disabled}
        onChange={e => handleYear(e)}
        onFocus={e => {
          handleFocus(e);
          setYearFocus(true);
          setMonthFocus(false);
        }}
        onBlur={e => {
          handleBlur(e);
          setYearFocus(false);
          setMonthFocus(false);
        }}
        isFilled={!!month}
      />
    </FakeInput>
  );
};

export default ExpiryDateInput;
