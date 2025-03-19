import { describe, it, expect } from "vitest";
import smsCodeConfig from "../../../../src/models/views/smsCode";
import { createMachine, interpret } from "xstate";
import { createTestMachine, createTestModel } from "@xstate/test";
import * as actions from "../../../../src/models/config/actions";
import * as guards from "../../../../src/models/config/guards";
import { useMockUserfront, addGlobalStates } from "../../../utils";
import { defaultAuthContext } from "../../../../src/models/forms/universal";
import { SmsCodeContext } from "../../../../src/models/types";

const machineOptions = {
  actions,
  guards,
};

const smsCodeMachine = createMachine(
  addGlobalStates(smsCodeConfig),
  <any>machineOptions
).withContext(defaultAuthContext);

const testMachine = createTestMachine({
  initial: "showingPhoneNumberForm",
  states: {
    showingPhoneNumberForm: {
      on: {
        submitPhoneNumber: "sendingCode",
        back: "returnedToFactors",
      },
    },
    sendingCode: {
      on: {
        failSendingCode: "showingPhoneNumberFormWithError",
        succeedSendingCode: "showingCodeForm",
      },
    },
    showingPhoneNumberFormWithError: {
      on: {
        submitPhoneNumber: "sendingCode",
        back: "returnedToFactors",
      },
    },
    showingCodeForm: {
      on: {
        submitCode: "verifyingCode",
        back: "showingPhoneNumberForm",
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
        back: "showingPhoneNumberForm",
      },
    },
    codeVerified: {},
    returnedToFactors: {},
    usingSecondFactor: {},
  },
});

const testModel = createTestModel(testMachine);

describe("model-based: models/signup/smsCode", () => {
  testModel.getPaths().forEach((path) => {
    it(path.description, async () => {
      const smsCodeService = interpret(smsCodeMachine);
      smsCodeService.start();
      const mockUserfront = useMockUserfront();
      const phoneNumber = "+15551234";
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
          channel: "authenticator",
          strategy: "totp",
        },
      ];

      await path.test({
        states: {
          showingPhoneNumberForm: () => {
            const state = smsCodeService.getSnapshot();
            expect(state.value).toEqual("showForm");
            expect(state.context.error).toBeFalsy();
          },
          sendingCode: () => {
            const state = smsCodeService.getSnapshot();
            expect(state.value).toEqual("send");
            expect(state.context.error).toBeFalsy();
            expect(mockUserfront.lastCall?.method).toEqual(
              "sendVerificationCode"
            );
            const arg = mockUserfront.lastCall?.args[0];
            expect(arg.channel).toEqual("sms");
            expect(arg.phoneNumber).toEqual(phoneNumber);
          },
          showingPhoneNumberFormWithError: () => {
            const state = smsCodeService.getSnapshot();
            expect(state.value).toEqual("showForm");
            expect(state.context.error).toEqual(sendError);
            const context = <SmsCodeContext>state.context;
            expect(context.view.phoneNumber).toEqual(phoneNumber);
          },
          showingCodeForm: () => {
            const state = smsCodeService.getSnapshot();
            expect(state.value).toEqual("showCodeForm");
            expect(state.context.error).toBeFalsy();
            const context = <SmsCodeContext>state.context;
            expect(context.view.phoneNumber).toEqual(phoneNumber);
          },
          verifyingCode: async () => {
            const state = smsCodeService.getSnapshot();
            expect(state.value).toEqual("verifyCode");
            expect(state.context.error).toBeFalsy();
            expect(mockUserfront.lastCall?.method).toEqual("login");
            const arg = mockUserfront.lastCall?.args[0];
            expect(arg.channel).toEqual("sms");
            expect(arg.method).toEqual("verificationCode");
            expect(arg.verificationCode).toEqual(verificationCode);
            expect(arg.phoneNumber).toEqual(phoneNumber);
          },
          showingCodeFormWithError: () => {
            const state = smsCodeService.getSnapshot();
            expect(state.value).toEqual("showCodeForm");
            expect(state.context.error).toEqual(verifyError);
            const context = <SmsCodeContext>state.context;
            expect(context.view.phoneNumber).toEqual(phoneNumber);
          },
          codeVerified: () => {
            const state = smsCodeService.getSnapshot();
            expect(state.value).toEqual("showCodeVerified");
          },
          returnedToFactors: () => {
            const state = smsCodeService.getSnapshot();
            expect(state.value).toEqual("backToFactors");
            expect(state.context.error).toBeFalsy();
          },
          usingSecondFactor: () => {
            const state = smsCodeService.getSnapshot();
            expect(state.value).toEqual("beginSecondFactor");
            expect(state.context.allowedSecondFactors).toEqual(secondFactors);
          },
        },
        events: {
          submitPhoneNumber: () => {
            smsCodeService.send("submit", { phoneNumber });
          },
          back: () => {
            smsCodeService.send("back");
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
              phoneNumber,
            });
          },
          submitCode: () => {
            smsCodeService.send("submit", {
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
