import { overrideUserfrontSingleton } from "../services/userfront";

const mockUserfrontResponses = {
  store: {
    tenantId: "demo1234",
  },
  mfaRequired: async () => {
    return {
      mode: "test",
      message: "MFA required",
      isMfaRequired: true,
      firstFactorToken: "uf_test_first_factor_207a4d56ce7e40bc9dafb0918fb6599a",
      authentication: {
        firstFactor: {
          strategy: "link",
          channel: "email",
        },
        secondFactors: [
          {
            strategy: "totp",
            channel: "authenticator",
            isConfiguredByUser: true,
          },
          {
            strategy: "verificationCode",
            channel: "sms",
            isConfiguredByUser: false,
          },
        ],
      },
    };
  },
  mfaSetupRequired: async () => {
    return {
      mode: "test",
      message: "MFA required",
      isMfaRequired: true,
      firstFactorToken: "uf_test_first_factor_207a4d56ce7e40bc9dafb0918fb6599a",
      authentication: {
        firstFactor: {
          strategy: "link",
          channel: "email",
        },
        secondFactors: [
          {
            strategy: "totp",
            channel: "authenticator",
            isConfiguredByUser: false,
          },
          {
            strategy: "verificationCode",
            channel: "sms",
            isConfiguredByUser: false,
          },
        ],
      },
    };
  },
  login: async () => {
    return {
      mode: "test",
      message: "OK",
      redirectTo: "https://example.com/path",
      sessionId: "8976836f-f43d-425d-ab93-86e620c51e5c",
      nonce: "71539dd5-7efc-43d1-b355-9c7e48f165b5",
      tokens: {
        access: {
          value: "e2y...",
          cookieOptions: {
            secure: true,
            sameSite: "Strict",
            expires: 7,
          },
        },
        id: {
          value: "e2y...",
          cookieOptions: {
            secure: true,
            sameSite: "Strict",
            expires: 7,
          },
        },
        refresh: {
          value: "e2y...",
          cookieOptions: {
            secure: true,
            sameSite: "Strict",
            expires: 1,
          },
        },
      },
      userId: 5,
      tenantId: "demo1234",
      userUuid: "a9c9b41c-ce76-4f7e-915a-abf18a36a4ae",
      username: "janedoe",
      email: "user@example.com",
      phoneNumber: "+15558675309",
      name: "Jane Doe",
      image:
        "https://res.cloudinary.com/component/image/upload/avatars/avatar-16.png",
      locked: false,
      data: {
        custom: "data",
      },
      isConfirmed: true,
      isMfaRequired: false,
      lastActiveAt: "2022-12-15T23:36:33.299Z",
      lastMessagedAt: "2022-12-15T16:15:14.372Z",
      confirmedAt: "2022-12-15T06:33:43.416Z",
      createdAt: "2022-12-13T20:21:45.837Z",
      updatedAt: "2022-12-16T00:06:45.138Z",
      tenant: {
        tenantId: "demo1234",
        name: "Demo Account",
      },
      authentication: {
        firstFactors: [
          {
            strategy: "password",
            channel: "email",
          },
          {
            strategy: "link",
            channel: "email",
          },
          {
            strategy: "google",
            channel: "email",
          },
        ],
        secondFactors: [
          {
            strategy: "totp",
            channel: "authenticator",
          },
        ],
      },
      authorization: {
        demo1234: {
          roles: [],
        },
      },
    };
  },
  signup: async () => {
    return {
      mode: "test",
      message: "OK",
      redirectTo: "https://example.com/path",
      sessionId: "8976836f-f43d-425d-ab93-86e620c51e5c",
      nonce: "71539dd5-7efc-43d1-b355-9c7e48f165b5",
      tokens: {
        access: {
          value: "e2y...",
          cookieOptions: {
            secure: true,
            sameSite: "Strict",
            expires: 7,
          },
        },
        id: {
          value: "e2y...",
          cookieOptions: {
            secure: true,
            sameSite: "Strict",
            expires: 7,
          },
        },
        refresh: {
          value: "e2y...",
          cookieOptions: {
            secure: true,
            sameSite: "Strict",
            expires: 1,
          },
        },
      },
      userId: 5,
      tenantId: "demo1234",
      userUuid: "a9c9b41c-ce76-4f7e-915a-abf18a36a4ae",
      username: "janedoe",
      email: "user@example.com",
      phoneNumber: "+15558675309",
      name: "Jane Doe",
      image:
        "https://res.cloudinary.com/component/image/upload/avatars/avatar-16.png",
      locked: false,
      data: {
        custom: "data",
      },
      isConfirmed: true,
      isMfaRequired: false,
      lastActiveAt: "2022-12-15T23:36:33.299Z",
      lastMessagedAt: "2022-12-15T16:15:14.372Z",
      confirmedAt: "2022-12-15T06:33:43.416Z",
      createdAt: "2022-12-13T20:21:45.837Z",
      updatedAt: "2022-12-16T00:06:45.138Z",
      tenant: {
        tenantId: "demo1234",
        name: "Demo Account",
      },
      authentication: {
        firstFactors: [
          {
            strategy: "password",
            channel: "email",
          },
          {
            strategy: "link",
            channel: "email",
          },
          {
            strategy: "google",
            channel: "email",
          },
        ],
        secondFactors: [
          {
            strategy: "totp",
            channel: "authenticator",
          },
        ],
      },
      authorization: {
        demo1234: {
          roles: [],
        },
      },
    };
  },
  sendVerificationCode: async () => {
    return {};
  },
  logout: async () => {
    return {
      message: "OK",
      redirectTo: "https://example.com/path",
    };
  },
  redirectIfLoggedIn: async () => {
    return undefined;
  },
  resetPassword: async () => {
    return {
      mode: "test",
      message: "OK",
      redirectTo: "https://example.com/path",
      sessionId: "8976836f-f43d-425d-ab93-86e620c51e5c",
      nonce: "71539dd5-7efc-43d1-b355-9c7e48f165b5",
      tokens: {
        access: {
          value: "e2y...",
          cookieOptions: {
            secure: true,
            sameSite: "Strict",
            expires: 7,
          },
        },
        id: {
          value: "e2y...",
          cookieOptions: {
            secure: true,
            sameSite: "Strict",
            expires: 7,
          },
        },
        refresh: {
          value: "e2y...",
          cookieOptions: {
            secure: true,
            sameSite: "Strict",
            expires: 1,
          },
        },
      },
    };
  },
  updatePassword: async () => {
    return {
      mode: "test",
      message: "OK",
      redirectTo: "https://example.com/path",
      sessionId: "8976836f-f43d-425d-ab93-86e620c51e5c",
      nonce: "71539dd5-7efc-43d1-b355-9c7e48f165b5",
      tokens: {
        access: {
          value: "e2y...",
          cookieOptions: {
            secure: true,
            sameSite: "Strict",
            expires: 7,
          },
        },
        id: {
          value: "e2y...",
          cookieOptions: {
            secure: true,
            sameSite: "Strict",
            expires: 7,
          },
        },
        refresh: {
          value: "e2y...",
          cookieOptions: {
            secure: true,
            sameSite: "Strict",
            expires: 1,
          },
        },
      },
    };
  },
  sendLoginLink: async () => {
    return {
      message: "OK",
      result: {
        email: "user@example.com",
        submittedAt: "2022-12-16T00:08:26.172Z",
        messageId: "ed2052f6-da85-48aa-a24e-3eab4c5b08d0",
      },
    };
  },
  sendResetLink: async () => {
    return {
      message: "OK",
      result: {
        email: "user@example.com",
        submittedAt: "2022-12-16T00:08:26.172Z",
        messageId: "ed2052f6-da85-48aa-a24e-3eab4c5b08d0",
      },
    };
  },
  setMode: async () => {
    return {
      mode: "live",
      authentication: {
        firstFactors: [
          { channel: "email", strategy: "link" },
          { channel: "email", strategy: "azure" },
          { channel: "email", strategy: "verificationCode" },
          { channel: "email", strategy: "password" },
          { channel: "sms", strategy: "verificationCode" },
          { channel: "email", strategy: "google" },
          { channel: "email", strategy: "apple" },
          { channel: "email", strategy: "github" },
          { channel: "email", strategy: "okta" },
        ],
      },
    };
  },
};

class MockUserfront {
  constructor({ authFlow, mode }) {
    this.store = {
      tenantId: "demo1234",
      tokens: {},
      user: {
        getTotp: async () => ({
          totpSecret: "ABYBCGY6PELUWISB",
          qrCode:
            "data:image/png;base64,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",
          backupCodes: [
            "60bb6-9393a",
            "1b8ef-e3e4b",
            "1488f-7cd2e",
            "3169e-fa7e3",
          ],
        }),
      },
    };
    this.logAllMethodCalls = false;
    this.requireMfa = true;
    this.requireMfaSetup = false;
    this.isAwaitingSecondFactor = false;
    this.authFlow = authFlow;
    this.mode = mode;

    this.login = this.login.bind(this);
    this.signup = this.signup.bind(this);
    this.resetPassword = this.resetPassword.bind(this);
    this.updatePassword = this.updatePassword.bind(this);
    this.setMode = this.setMode.bind(this);
  }

  attachToWindow() {
    if (typeof window !== undefined) {
      window._mockUserfront = this;
    }
  }

  async login() {
    if (this.isAwaitingSecondFactor) {
      this.isAwaitingSecondFactor = false;
      return mockUserfrontResponses.login();
    }
    if (this.requireMfaSetup) {
      this.isAwaitingSecondFactor = true;
      return mockUserfrontResponses.mfaSetupRequired();
    }
    if (this.requireMfa) {
      this.isAwaitingSecondFactor = true;
      return mockUserfrontResponses.mfaRequired();
    }
    return mockUserfrontResponses.login();
  }

  async signup() {
    if (this.isAwaitingSecondFactor) {
      this.isAwaitingSecondFactor = false;
      return mockUserfrontResponses.signup();
    }
    if (this.requireMfaSetup) {
      this.isAwaitingSecondFactor = true;
      return mockUserfrontResponses.mfaSetupRequired();
    }
    return mockUserfrontResponses.signup();
  }

  async sendVerificationCode() {
    return mockUserfrontResponses.sendVerificationCode();
  }

  async logout() {
    return mockUserfrontResponses.logout();
  }

  async redirectIfLoggedIn() {
    return mockUserfrontResponses.redirectIfLoggedIn();
  }

  async resetPassword() {
    return this.updatePassword();
  }

  async updatePassword() {
    if (this.isAwaitingSecondFactor) {
      this.isAwaitingSecondFactor = false;
      return mockUserfrontResponses.updatePassword();
    }
    if (this.requireMfa) {
      this.isAwaitingSecondFactor = true;
      return mockUserfrontResponses.mfaRequired();
    }
    return mockUserfrontResponses.updatePassword();
  }

  async sendLoginLink() {
    return mockUserfrontResponses.sendLoginLink();
  }

  async sendResetLink() {
    return mockUserfrontResponses.sendResetLink();
  }

  async setMode() {
    const modeResponse = mockUserfrontResponses.setMode();
    if (this.authFlow) {
      return {
        mode: this.mode,
        authentication: this.authFlow,
      };
    }
    return modeResponse;
  }
}

const createMockUserfront = ({ authFlow, mode = "live" } = {}) =>
  new MockUserfront({ authFlow, mode });

export const useMockUserfront = ({ authFlow, mode = "live" } = {}) => {
  const mockUserfront = createMockUserfront({ authFlow, mode });
  overrideUserfrontSingleton(mockUserfront);
  return mockUserfront;
};

export default createMockUserfront;
