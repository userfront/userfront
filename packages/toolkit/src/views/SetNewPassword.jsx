"use client";

import { useState } from "react";
import SubmitButton from "../components/SubmitButton";
import ErrorMessage from "../components/ErrorMessage";
import Input from "../components/Input";

const SetNewPassword = ({
  onEvent,
  requireExistingPassword = false,
  requirePasswordConfirmation = true,
  error,
}) => {
  const [existingPasswordError, setExistingPasswordError] = useState(false);
  const [newPasswordError, setNewPasswordError] = useState(false);
  const [confirmNewPasswordError, setConfirmNewPasswordError] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    const elements = event.target.elements;

    // Enforce presence of current password, if required
    if (requireExistingPassword) {
      setExistingPasswordError(!elements.password.value);
    } else {
      setExistingPasswordError(false);
    }

    // Enforce presence of new password
    setNewPasswordError(!elements.newPassword.value);

    // Enforce presence of new password confirmation, if required
    if (requirePasswordConfirmation) {
      setConfirmNewPasswordError(!elements.confirmNewPassword.value);
    } else {
      setConfirmNewPasswordError(false);
    }

    // If new password confirmation is NOT required, put the new password
    // in that field so validation passes
    const confirmNewPassword = requirePasswordConfirmation
      ? elements.confirmNewPassword.value
      : elements.newPassword.value;
    if (onEvent) {
      const event = {
        type: "submit",
        password: elements.newPassword.value,
        confirmPassword: confirmNewPassword,
        existingPassword: elements.password?.value,
      };
      onEvent(event);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="userfront-form">
      {requireExistingPassword && (
        <div className="userfront-form-row">
          <Input.Password
            name="password"
            label="Enter your current password"
            showError={existingPasswordError}
            errorMessage="Please enter your current password"
          />
        </div>
      )}
      <div className="userfront-form-row">
        <Input.Password
          name="newPassword"
          label="Choose a new password"
          showError={newPasswordError}
          errorMessage="Please enter a new password"
        />
      </div>
      {requirePasswordConfirmation && (
        <div className="userfront-form-row">
          <Input.Password
            name="confirmNewPassword"
            label="Confirm your new password"
            showError={confirmNewPasswordError}
            errorMessage="Please confirm your new password"
          />
        </div>
      )}
      <ErrorMessage error={error} />
      <div className="userfront-button-row">
        <SubmitButton />
      </div>
    </form>
  );
};

export default SetNewPassword;
