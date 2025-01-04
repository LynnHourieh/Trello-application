import React, { useState, useRef, useEffect, CSSProperties, JSX } from "react";
import { SelectOption, SelectProps } from "../../models/components";
import "./select-styles.scss";
import Option from "../option/Option.tsx";
import { ErrorIcon } from "../../assests/images/icons.tsx";

const Select: React.FC<SelectProps> = ({
  id,
  name,
  defaultValue,
  placeholder,
  value,
  onChange,
  disabled,
  label,
  options,
  onClear,
  errorMessage,
}) => {
  const [showOptions, setShowOptions] = useState(false);
  const selectRef = useRef<HTMLButtonElement>(null);
  const optionsContainerRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      selectRef.current &&
      optionsContainerRef.current &&
      !selectRef.current.contains(event.target as Node) &&
      !optionsContainerRef.current.contains(event.target as Node)
    ) {
      setShowOptions(false);
    }
  };

  const renderOptions = (): JSX.Element[] | undefined => {
    if (!options?.length) return;

    const optionsToRender: JSX.Element[] = options.map(
      (option: SelectOption) => (
        <Option
          key={option.value}
          value={option.value}
          text={
            option.value === defaultValue
              ? `${option.text} (default)`
              : option.text
          }
          onClick={handleOptionClick}
          selected={checkIsOptionSelected(option.value)}
          icon={option?.icon}
          iconPosition={"end"}
        />
      )
    );

    return optionsToRender;
  };

  const handleButtonClick = () => {
    setShowOptions(!showOptions);
  };

  const handleOptionClick = (selectedValue: string) => {
    onChange?.(name, selectedValue);
    setShowOptions(!showOptions);
  };

  const getOptionsContainerStyle = (): CSSProperties => {
    if (selectRef.current && optionsContainerRef.current) {
      const selectRect = selectRef.current.getBoundingClientRect();
      optionsContainerRef.current.style.display = "block";
      const optionsContainerHeight = optionsContainerRef.current.offsetHeight;
      const windowHeight = window.innerHeight;

      // Calculate space above and below the selectRect
      const spaceAbove = selectRect.top;
      const spaceBelow = windowHeight - selectRect.bottom;

      const defaultStyles = {
        left: 0,
        width: selectRect.width,
      };
      // Set the position based on space availability
      if (spaceBelow >= optionsContainerHeight) {
        return { top: "100%", position: "absolute", ...defaultStyles };
      } else if (spaceAbove >= optionsContainerHeight) {
        return { bottom: "100%", position: "absolute", ...defaultStyles };
      }
    }

    // Default style if calculations fail
    return { display: "none" };
  };

  const renderValue = () => {
    if (value) {
      // Display the selected value for single selection
      const option = options?.find((option) => option.value === value);
      return option?.value === defaultValue
        ? `${option?.text} (default)`
        : option?.text;
    }

    return defaultValue ?? placeholder;
  };

  const checkIsOptionSelected = (optionValue: string) => {
    return optionValue === value;
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (
      !value &&
      defaultValue &&
      options?.find((option) => option.value === defaultValue) &&
      onChange
    ) {
      onChange(name, defaultValue);
    }
  }, []);

  return (
    <>
      {options && onChange && (
        <div className="select-root">
          {(label || onClear) && (
            <div className="select-labelWrapper">
              {label && <label htmlFor={id}>{label}</label>}
              {onClear && value && (
                <button
                  type="button"
                  onClick={onClear}
                  className="select-clearButton"
                  disabled={disabled}
                >
                  Clear
                </button>
              )}
            </div>
          )}
          <div className="select-buttonWrapper">
            <button
              type="button"
              className={`select-button ${
                !value ? "select-button--placeholder" : ""
              } ${errorMessage ? "select-hasError" : ""}`}
              onClick={disabled ? undefined : handleButtonClick}
              ref={selectRef}
              id={id}
              name={name}
              disabled={disabled}
            >
              {renderValue()}
              <svg focusable="false" aria-hidden="true" viewBox="0 0 24 24">
                <path d="m12 5.83 2.46 2.46c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L12.7 3.7a.9959.9959 0 0 0-1.41 0L8.12 6.88c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 5.83zm0 12.34-2.46-2.46a.9959.9959 0 0 0-1.41 0c-.39.39-.39 1.02 0 1.41l3.17 3.18c.39.39 1.02.39 1.41 0l3.17-3.17c.39-.39.39-1.02 0-1.41a.9959.9959 0 0 0-1.41 0L12 18.17z"></path>
              </svg>
            </button>
            {errorMessage && (
              <div className="select-errorMessage">
                {<ErrorIcon />}
                <p>{errorMessage}</p>
              </div>
            )}

            {options && options.length > 0 && (
              <div
                className="select-optionsContainer"
                style={
                  showOptions ? getOptionsContainerStyle() : { display: "none" }
                }
                ref={optionsContainerRef}
              >
                <ul role="listbox" tabIndex={-1} className="select-optionsList">
                  {renderOptions()}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Select;
