import * as React from "react";
import { describe, expect, it, test } from "vitest";
import { render, renderHook, screen } from "@testing-library/react";
import { UserfrontProvider, useUserfront } from "./index";

const renderProvider = (
  options: React.ComponentProps<typeof UserfrontProvider>,
) => {
  let result: ReturnType<typeof useUserfront> | undefined;

  const TestComp = () => {
    result = useUserfront();
    return (
      <div>
        <h1>Test Component</h1>
      </div>
    );
  };

  render(
    <UserfrontProvider {...options}>
      <TestComp />
    </UserfrontProvider>,
  );

  return result;
};

describe("Userfront Context", () => {
  it("should throw an error when not inside a provider", () => {
    let err: Error | undefined;

    try {
      renderHook(() => useUserfront());
    } catch (error) {
      err = error as Error;
    }

    expect(err instanceof Error).toBe(true);
    expect(err?.message).toBe(
      "useUserfront must be used within a UserfrontProvider",
    );
  });

  it("should initialize", () => {
    const options = {
      tenantId: "test",
      requireAuth: false,
      loginUrl: "/login",
      loginRedirect: "/dashboard",
      signupRedirect: "/dashboard",
      logoutRedirect: "/login",
    };
    const hook = renderProvider(options);

    // Assert children are rendered
    expect(
      screen.getByRole("heading", { level: 1, name: "Test Component" }),
    ).toBeDefined();
    // Assert hook values
    expect(hook).toBeDefined();
    expect(hook?.isLoading).toBe(true);
    expect(hook?.isAuthenticated).toBe(false);
    expect(hook?.tenantId).toBe(options.tenantId);
    expect(hook?.requireAuth).toBe(options.requireAuth);
    expect(hook?.loginUrl).toBe(options.loginUrl);
    expect(hook?.loginRedirect).toBe(options.loginRedirect);
    expect(hook?.signupRedirect).toBe(options.signupRedirect);
    expect(hook?.logoutRedirect).toBe(options.logoutRedirect);
  });
});
