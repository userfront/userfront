# Model-based testing example: a simple form

Say we have a form with a `ClearableInput` that takes a text value and can be cleared, and a `Submit` button. On `Submit`, the input is checked with an `isValid` function. If it's valid, the input and button are hidden and a `SuccessMessage` is shown. If it's invalid, a `FailureMessage` is shown that describes the issue, and the input and button remain.

The system's intended behavior, expressed as a statechart, is something like:

```
    ---------------------------------------------------
    |                                                 |
    \/                                                |
EmptyForm -- enterText --> FormWithText -- clearText --
                            |         |
                    submitInvalid   submitValid --> SuccessMessage
                            | /\      |
                           \/ |       |
                        ErrorMessage --
```

One benefit of MBT comes from the act of designing the model. We have to understand the system's intended behavior to build a model of that behavior. Looking at the model above, what happens if we're on `ErrorMessage` and clear the text? Should it go back to the `EmptyForm` state, or should there be an `EmptyFormWithErrorMessage` state? With example-based unit tests, we might assert that clearing the text results in a clear textbox and submitting with invalid text results in an error message - and miss the case where we clear the text when the error message is visible. (For the sake of this example, let's say it clears the text and the error message, returning us to the `EmptyForm` state.)

To turn this into a model-based test, we would create an `@xstate/test` model describing it, like so:

```js
import { createTestMachine, createTestModel } from "@xstate/test";

const machine = createTestMachine({
  initial: "EmptyForm",
  states: {
    EmptyForm: {
      on: {
        enterText: "FormWithText",
      },
    },
    FormWithText: {
      on: {
        submitInvalid: "ErrorMessage",
        submitValid: "SuccessMessage",
        clearText: "EmptyForm",
      },
    },
    ErrorMessage: {
      on: {
        submitInvalid: "ErrorMessage",
        submitValid: "SuccessMessage",
        clearText: "EmptyForm",
      },
    },
    SuccessMessage: {},
  },
});
const model = createTestModel(machine);
```

The `createTestModel` function examines the machine, comes up with a minimal set of paths through the machine to test every state and transition, and gives us an interface to assert or perform actions on each state and transition:

```js
model.getPaths().forEach((path) => {
  it(path.description, () => {
    // Setup to run before each test - equivalent to beforeEach(...)
    const testUtil = myTestUtils.createSomeUtil();
    const system = myApp.createSystem();

    // Declare assertions and actions for each state and transition
    path.test({
      states: {
        // States are usually assertions
        EmptyForm: () => {
          expect(system.form.value).toEqual("");
          expect(system.form).toBeVisible();
          expect(system.form.submitButton).toBeDisabled();
          expect(system.errorMessage).not.toBeVisible();
          expect(system.successMessage).not.toBeVisible();
        },
        FormWithText: () => {
          expect(system.form.value).toEqual(testUtil.inputText);
          expect(system.form).toBeVisible();
          expect(system.form.submitButton).toBeEnabled();
          expect(system.errorMessage).not.toBeVisible();
          expect(system.successMessage).not.toBeVisible();
        },
        ErrorMessage: () => {
          expect(system.form.value).toEqual(testUtil.inputText);
          expect(system.form).toBeVisible();
          expect(system.form.submitButton).toBeEnabled();
          expect(system.errorMessage).toBeVisible();
          expect(system.errorMessage.value).toEqual(testUtil.errorText);
          expect(system.successMessage).not.toBeVisible();
        },
        SuccessMessage: () => {
          expect(system.form).not.toBeVisible();
          expect(system.errorMessage).not.toBeVisible();
          expect(system.successMessage).toBeVisible();
          expect(system.successMessage.value).toEqual(testUtil.successText);
        },
      },
      events: {
        // events are usually actions taken on the system under test
        enterText: () => {
          testUtil.enterRandomText(system.form);
        },
        clearText: () => {
          testUtil.pressButton(system.form.clearButton);
        },
        submitValid: () => {
          testUtil.enterRandomValidText(system.form);
          testUtil.pressButton(system.form.submitButton);
        },
        submitInvalid: () => {
          testUtil.enterRandomInvalidText(system.form);
          testUtil.pressButton(system.form.submitButton);
        },
      },
    });
  });
});
```

Then we run the tests, and the model generates and runs tests for each possible path through the model. For example, this one might run four tests:

- EmptyText -> enterText -> FormWithText -> clearText -> EmptyText
- EmptyText -> enterText -> FormWithText -> submitInvalid -> ErrorMessage -> submitInvalid -> ErrorMessage -> submitValid -> SuccessMessage
- EmptyText -> enterText -> FormWithText -> submitInvalid -> ErrorMessage -> clearText -> EmptyText
- EmptyText -> enterText -> FormWithText -> submitValid -> SuccessMessage

If the tests pass, good. If one fails, it shows the path the test took through the model and which step had a failing assertion.
