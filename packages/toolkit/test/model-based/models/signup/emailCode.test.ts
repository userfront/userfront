import { describe, it, expect } from "vitest";
import emailCodeConfig from "../../../../src/models/views/emailCode";
import { createMachine, interpret } from "xstate";
import { createTestMachine, createTestModel } from "@xstate/test";
import * as actions from "../../../../src/models/config/actions";
import * as guards from "../../../../src/models/config/guards";
import { useMockUserfront, addGlobalStates } from "../../../utils";
import { defaultAuthContext } from "../../../../src/models/forms/universal";

const machineOptions = {
  actions,
  guards,
};

const emailCodeMachine = createMachine(
  addGlobalStates(emailCodeConfig),
  <any>machineOptions
).withContext(defaultAuthContext);

const testMachine = createTestMachine({
  initial: "showingEmailForm",
  states: {
    showingEmailForm: {
      on: {
        submitEmail: "sendingCode",
        back: "returnedToFactors",
      },
    },
    sendingCode: {
      on: {
        failSendingCode: "showingEmailFormWithError",
        succeedSendingCode: "showingCodeForm",
      },
    },
    showingEmailFormWithError: {
      on: {
        submitEmail: "sendingCode",
        back: "returnedToFactors",
      },
    },
    showingCodeForm: {
      on: {
        submitCode: "verifyingCode",
        back: "showingEmailForm",
      },
    },
    verifyingCode: {
      on: {
        failVerifyingCode: "showingCodeFormWithError",
        succeedVerifyingCode: "codeVerified",
        mfaRequired: "usingSecondFactor",
      },
    },
    showingCodeFormWithError: {
      on: {
        submitCode: "verifyingCode",
        back: "showingEmailForm",
      },
    },
    codeVerified: {},
    returnedToFactors: {},
    usingSecondFactor: {},
  },
});

const testModel = createTestModel(testMachine);

describe("model-based: models/signup/emailCode", () => {
  testModel.getPaths().forEach((path) => {
    it(path.description, async () => {
      const emailCodeService = interpret(emailCodeMachine);
      emailCodeService.start();
      const mockUserfront = useMockUserfront();
      const email = "email@example.com";
      const verificationCode = "123456";
      const sendError = {
        message: "Send error",
        error: {
          type: "some type",
        },
      };
      const verifyError = {
        message: "Verify error",
        error: {
          type: "some type",
        },
      };
      const secondFactors = [
        {
          channel: "sms",
          strategy: "verificationCode",
        },
        {
          channel: "authenticator",
          strategy: "totp",
        },
      ];

      await path.test({
        states: {
          showingEmailForm: () => {
            const state = emailCodeService.getSnapshot();
            expect(state.value).toEqual("showForm");
            expect(state.context.error).toBeFalsy();
          },
          sendingCode: () => {
            const state = emailCodeService.getSnapshot();
            expect(state.value).toEqual("send");
            expect(state.context.error).toBeFalsy();
            expect(mockUserfront.lastCall?.method).toEqual(
              "sendVerificationCode"
            );
            const arg = mockUserfront.lastCall?.args[0];
            expect(arg.channel).toEqual("email");
            expect(arg.email).toEqual(email);
          },
          showingEmailFormWithError: () => {
            const state = emailCodeService.getSnapshot();
            expect(state.value).toEqual("showForm");
            expect(state.context.error).toEqual(sendError);
            expect(state.context.user.email).toEqual(email);
          },
          showingCodeForm: () => {
            const state = emailCodeService.getSnapshot();
            expect(state.value).toEqual("showCodeForm");
            expect(state.context.error).toBeFalsy();
            expect(state.context.user.email).toEqual(email);
          },
          verifyingCode: async () => {
            const state = emailCodeService.getSnapshot();
            expect(state.value).toEqual("verifyCode");
            expect(state.context.error).toBeFalsy();
            expect(mockUserfront.lastCall?.method).toEqual("login");
            const arg = mockUserfront.lastCall?.args[0];
            expect(arg.channel).toEqual("email");
            expect(arg.method).toEqual("verificationCode");
            expect(arg.verificationCode).toEqual(verificationCode);
            expect(arg.email).toEqual(email);
          },
          showingCodeFormWithError: () => {
            const state = emailCodeService.getSnapshot();
            expect(state.value).toEqual("showCodeForm");
            expect(state.context.error).toEqual(verifyError);
            expect(state.context.user.email).toEqual(email);
          },
          codeVerified: () => {
            const state = emailCodeService.getSnapshot();
            expect(state.value).toEqual("showCodeVerified");
            expect(mockUserfront.lastCall?.method).toEqual(
              "redirectIfLoggedIn"
            );
          },
          returnedToFactors: () => {
            const state = emailCodeService.getSnapshot();
            expect(state.value).toEqual("backToFactors");
            expect(state.context.error).toBeFalsy();
          },
          usingSecondFactor: () => {
            const state = emailCodeService.getSnapshot();
            expect(state.value).toEqual("beginSecondFactor");
            expect(state.context.allowedSecondFactors).toEqual(secondFactors);
          },
        },
        events: {
          submitEmail: () => {
            emailCodeService.send("submit", { email });
          },
          back: () => {
            emailCodeService.send("back");
          },
          failSendingCode: async () => {
            try {
              await mockUserfront.reject(sendError);
            } catch (err) {
              await Promise.resolve();
              return;
            }
          },
          succeedSendingCode: async () => {
            await mockUserfront.resolve({
              email,
            });
          },
          submitCode: () => {
            emailCodeService.send("submit", {
              verificationCode,
            });
          },
          failVerifyingCode: async () => {
            try {
              await mockUserfront.reject(verifyError);
            } catch (err) {
              await Promise.resolve();
              return;
            }
          },
          succeedVerifyingCode: async () => {
            await mockUserfront.resolve({
              isMfaRequired: false,
            });
          },
          mfaRequired: async () => {
            await mockUserfront.resolve({
              isMfaRequired: true,
              authentication: {
                secondFactors,
              },
            });
          },
        },
      });
    });
  });
});
