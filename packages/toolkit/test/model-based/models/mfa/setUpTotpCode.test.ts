import { describe, it, expect } from "vitest";
import setUpTotpConfig from "../../../../src/models/views/setUpTotp";
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

const setUpTotpCodeMachine = createMachine(
  addGlobalStates(setUpTotpConfig),
  <any>machineOptions
).withContext({
  config: defaultAuthContext.config,
  user: {
    email: "",
  },
  action: "setup",
  isSecondFactor: true,
  activeFactor: {
    channel: "authenticator",
    strategy: "totp",
    isConfiguredByUser: true,
  },
  allowBack: true,
});

const testMachine = createTestMachine({
  initial: "gettingQrCode",
  states: {
    gettingQrCode: {
      on: {
        succeedGettingQrCode: "showingQrCode",
      },
    },
    showingQrCode: {
      on: {
        submitQrCode: "confirmingQrCode",
        back: "returnedToFactorSelection",
      },
    },
    showingQrCodeWithError: {
      on: {
        submitQrCode: "confirmingQrCode",
        back: "returnedToFactorSelection",
      },
    },
    confirmingQrCode: {
      on: {
        failConfirmingCode: "showingQrCodeWithError",
        succeedConfirmingCode: "showingBackupCodes",
      },
    },
    showingBackupCodes: {
      on: {
        finish: "showingComplete",
      },
    },
    showingComplete: {},
    returnedToFactorSelection: {},
  },
});

const testModel = createTestModel(testMachine);

/**
 * Tests for setting up TOTP as a second factor to resolve reported bug:
 * https://linear.app/userfront/issue/DEV-1046/bug-in-mfa-setup
 *
 * NOTE: Mock does not detect calls for store.user.getTotp(), so we are not
 * able to resolve/reject like we do with the other `Userfront` methods.
 * The userfront mock has been modified below to resolve the API's response.
 */
describe("model-based: models/mfa/setUpTotpCode", () => {
  testModel.getPaths().forEach((path) => {
    it(path.description, async () => {
      const qrCode = "data:image/png;base64,testqrcode==";
      const backupCodes = [
        "60bb6-9393a",
        "1b8ef-e3e4b",
        "1488f-7cd2e",
        "3169e-fa7e3",
      ];
      // Mock must be initialized before starting machine
      const mockUserfront = useMockUserfront({
        user: {
          getTotp: () => {
            return new Promise((resolve) => {
              resolve({
                totpSecret: "testtotpsecret",
                qrCode,
                backupCodes,
              });
            });
          },
        },
      });

      const setUpTotpCodeService = interpret(setUpTotpCodeMachine);
      setUpTotpCodeService.start();

      const expected = {
        totpCode: "123456",
        // Requests
        getQrCodeReq: {
          success: {
            qrCode,
            backupCodes,
          },
        },
        confirmQrCodeReq: {
          error: {
            message: "Confirm code error",
            error: {
              type: "ConfirmCodeError",
            },
          },
          success: {
            isMfaRequired: false,
          },
        },
      };

      await path.test({
        states: {
          gettingQrCode: () => {
            const state = setUpTotpCodeService.getSnapshot();
            expect(state.value).toEqual("getQrCode");
            expect(state.context.error).toBeFalsy();
          },
          showingQrCode: () => {
            const state = setUpTotpCodeService.getSnapshot();
            expect(state.value).toEqual("showQrCode");
            expect(state.context.error).toBeFalsy();
            expect(state.context.view).toEqual({
              qrCode: expected.getQrCodeReq.success.qrCode,
              backupCodes: expected.getQrCodeReq.success.backupCodes,
            });
          },
          confirmingQrCode: () => {
            const state = setUpTotpCodeService.getSnapshot();
            expect(state.value).toEqual("confirmTotpCode");
            expect(state.context.error).toBeFalsy();
            expect(mockUserfront.lastCall?.method).toEqual("login");

            const arg = mockUserfront.lastCall?.args[0];
            expect(arg).not.toHaveProperty("email");
            expect(arg.method).toEqual("totp");
            expect(arg.totpCode).toEqual(expected.totpCode);
          },
          showingQrCodeWithError: () => {
            const state = setUpTotpCodeService.getSnapshot();
            expect(state.value).toEqual("showQrCode");
            expect(state.context.error).toEqual(
              expected.confirmQrCodeReq.error
            );
          },
          showingBackupCodes: () => {
            const state = setUpTotpCodeService.getSnapshot();
            expect(state.value).toEqual("showBackupCodes");
            expect(state.context.error).toBeFalsy();
          },
          showingComplete: () => {
            const state = setUpTotpCodeService.getSnapshot();
            expect(state.value).toEqual("showBackupCodes");
            expect(state.context.error).toBeFalsy();
          },
          returnedToFactorSelection: () => {
            const state = setUpTotpCodeService.getSnapshot();
            expect(state.value).toEqual("backToFactors");
            expect(state.context.error).toBeFalsy();
          },
        },
        events: {
          succeedGettingQrCode: async () => {
            // Mock does not detect call for store.user.getTotp(); do not
            // resolve the getQrCode response here
          },
          submitQrCode: () => {
            const { totpCode } = expected;
            setUpTotpCodeService.send("submit", { totpCode });
          },
          back: () => {
            setUpTotpCodeService.send("back");
          },
          failConfirmingCode: async () => {
            try {
              await mockUserfront.reject(expected.confirmQrCodeReq.error);
            } catch (error) {
              await Promise.resolve();
              return;
            }
          },
          succeedConfirmingCode: async () => {
            try {
              await mockUserfront.resolve(expected.confirmQrCodeReq.success);
            } catch (error) {
              await Promise.resolve();
              return;
            }
          },
        },
      });
    });
  });
});
