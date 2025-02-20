/**
 * A basic <input> with appropriate classes and error message.
 * Props are passed through to the underlying <input>
 *
 * @param {object} props
 * @property {string} label If present, display a <label> element above the input
 * @property {boolean} showError Whether to display the error message
 * @property {string} errorMessage The error message to display
 * @returns
 */
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";

export default function BaseInput({
  label,
  showError = false,
  errorMessage = "Required field",
  isPassword = false,
  ...props
} = {}) {
  const [hideContents, setHideContents] = useState(isPassword);

  return (
    <div className="userfront-password-input-container">
      {label && <label htmlFor={props.name}>{label}</label>}
      <div className="userfront-input-container">
        <input
          type={hideContents ? "password" : "text"}
          className={`userfront-input ${
            showError ? "userfront-input-error" : ""
          }`}
          {...props}
        />
        {isPassword && (
          <div
            className="userfront-password-toggle"
            onClick={() => setHideContents(!hideContents)}
          >
            {hideContents ? <FaEye size="15px" /> : <FaEyeSlash size="15px" />}
          </div>
        )}
      </div>
      {showError && (
        <div className="userfront-input-error-message">{errorMessage}</div>
      )}
    </div>
  );
}
