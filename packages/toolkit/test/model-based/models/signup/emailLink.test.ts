import { describe, it, beforeEach, expect } from "vitest";
import emailLinkConfig from "../../../../src/models/views/emailLink";
import { createMachine, interpret } from "xstate";
import { createTestMachine, createTestModel } from "@xstate/test";
import * as actions from "../../../../src/models/config/actions";
import { useMockUserfront, addGlobalStates } from "../../../utils";
import { defaultAuthContext } from "../../../../src/models/forms/universal";

const machineOptions = {
  actions,
};

const emailLinkMachine = createMachine(
  addGlobalStates(emailLinkConfig),
  <any>machineOptions
).withContext(defaultAuthContext);

const testMachine = createTestMachine({
  initial: "showingForm",
  states: {
    showingForm: {
      on: {
        submit: "submittingFromForm",
        back: "returnedToFactors",
      },
    },
    submittingFromForm: {
      on: {
        fail: "showingFormWithError",
        succeed: "showingEmailSent",
      },
    },
    showingFormWithError: {
      on: {
        submit: "submittingFromForm",
        back: "returnedToFactors",
      },
    },
    showingEmailSent: {
      on: {
        resend: "submittingFromEmailSent",
        back: "showingForm",
      },
    },
    submittingFromEmailSent: {
      on: {
        fail: "showingEmailSentWithResendError",
        succeed: "showingEmailResent",
      },
    },
    showingEmailResent: {
      on: {
        resend: "submittingFromEmailSent",
        back: "showingForm",
      },
    },
    showingEmailSentWithResendError: {
      on: {
        resend: "submittingFromEmailSent",
        back: "showingForm",
      },
    },
    returnedToFactors: {},
  },
});

const testModel = createTestModel(testMachine);

describe("model-based: models/signup/emailLink", () => {
  testModel.getPaths().forEach((path) => {
    it(path.description, async () => {
      const emailLinkService = interpret(emailLinkMachine);
      emailLinkService.start();
      const mockUserfront = useMockUserfront();
      const email = "email@example.com";
      const error = {
        message: "An error",
        error: {
          type: "some type",
        },
      };

      await path.test({
        states: {
          showingForm: () => {
            const state = emailLinkService.getSnapshot();
            expect(state.value).toEqual("showForm");
            expect(state.context.error).toBeFalsy();
          },
          submittingFromForm: () => {
            const state = emailLinkService.getSnapshot();
            expect(state.value).toEqual("send");
            expect(state.context.error).toBeFalsy();
            expect(mockUserfront.lastCall?.method).toEqual("login");
            const arg = mockUserfront.lastCall?.args[0];
            expect(arg.method).toEqual("passwordless");
            expect(arg.email).toEqual(email);
          },
          showingFormWithError: () => {
            const state = emailLinkService.getSnapshot();
            expect(state.value).toEqual("showForm");
            expect(state.context.error).toEqual(error);
            expect(state.context.user.email).toEqual(email);
          },
          showingEmailSent: () => {
            const state = emailLinkService.getSnapshot();
            expect(state.value).toEqual("showEmailSent");
            expect(state.context.error).toBeFalsy();
            expect(state.context.user.email).toEqual(email);
          },
          submittingFromEmailSent: () => {
            const state = emailLinkService.getSnapshot();
            expect(state.value).toEqual("resend");
            expect(state.context.error).toBeFalsy();
            expect(state.context.user.email).toEqual(email);
            const view = <any>state.context.view;
            expect(view.message).toBeFalsy();
            expect(mockUserfront.lastCall?.method).toEqual("login");
            const arg = mockUserfront.lastCall?.args[0];
            expect(arg.method).toEqual("passwordless");
            expect(arg.email).toEqual(email);
          },
          showingEmailResent: () => {
            const state = emailLinkService.getSnapshot();
            expect(state.value).toEqual("showEmailSent");
            const view = <any>state.context.view;
            expect(view.message).not.toBeFalsy();
            expect(state.context.error).toBeFalsy();
            expect(state.context.user.email).toEqual(email);
          },
          showingEmailSentWithResendError: () => {
            const state = emailLinkService.getSnapshot();
            expect(state.value).toEqual("showForm");
            expect(state.context.error).toEqual(error);
            expect(state.context.user.email).toEqual(email);
          },
          returnedToFactors: () => {
            const state = emailLinkService.getSnapshot();
            expect(state.value).toEqual("backToFactors");
            expect(state.context.error).toBeFalsy();
          },
        },
        events: {
          submit: () => {
            emailLinkService.send("submit", { email });
          },
          back: () => {
            emailLinkService.send("back");
          },
          fail: async () => {
            try {
              await mockUserfront.reject(error);
            } catch (err) {
              await Promise.resolve();
              return;
            }
          },
          succeed: async () => {
            await mockUserfront.resolve({});
          },
          resend: () => {
            emailLinkService.send("resend");
          },
        },
      });

      mockUserfront.restoreUserfront();
    });
  });
});
