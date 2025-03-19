import React from "react";
import { vi, expect, describe, it, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import UniversalForm from "../../../src/forms/UniversalForm";
import { overrideUserfrontSingleton } from "../../../src/services/userfront";

const PasswordResetForm = (props) => <UniversalForm type="reset" {...props} />;

describe("forms/PasswordResetForm.jsx", () => {
  it("should show the 'request password reset' form for the corresponding state", async () => {
    const state = {
      context: {
        allowBack: false,
        isSecondFactor: false,
        error: "",
        user: {},
        action: "use",
        config: {
          type: "reset",
        },
      },
      value: {
        emailLink: "showForm",
      },
    };
    render(<PasswordResetForm state={state} />);

    const result = await screen.findByText("Reset your password");
    expect(result).toBeDefined();
  });

  it("should show the 'set new password' form without the existing password field for the corresponding state if the user is logged out", async () => {
    overrideUserfrontSingleton({
      tokens: {
        accessToken: null,
      },
    });
    const state = {
      context: {
        allowBack: false,
        isSecondFactor: false,
        error: "",
        user: {},
        action: "use",
        config: {
          type: "reset",
        },
      },
      value: {
        setNewPassword: "showForm",
      },
    };

    render(<PasswordResetForm state={state} />);

    const result = await screen.findByText("Choose a new password");
    expect(result).toBeDefined();
  });

  it("should show the 'set new password' form with the existing password field for the corresponding state if the user is logged in", async () => {
    overrideUserfrontSingleton({
      tokens: {
        accessToken: "some-token",
      },
    });
    const state = {
      context: {
        allowBack: false,
        isSecondFactor: false,
        error: "",
        user: {},
        action: "use",
        config: {
          type: "reset",
        },
      },
      value: {
        setNewPassword: "showForm",
      },
    };

    render(<PasswordResetForm state={state} />);

    const existing = await screen.findByText("Enter your current password");
    expect(existing).toBeDefined();

    const choose = await screen.findByText("Choose a new password");
    expect(choose).toBeDefined();
  });
});
