import { vi } from "vitest"

import Userfront from "../src/index.js";
import api from "../src/api.js";
import { unsetUser } from "../src/user.js";
import {
  createAccessToken,
  createIdToken,
  createRefreshToken,
  idTokenUserDefaults,
  createMfaRequiredResponse,
  setMfaRequired,
} from "./config/utils.js";
import {
  assertAuthenticationDataMatches,
  mfaHeaders,
  noMfaHeaders,
  pkceParams,
} from "./config/assertions.js";
import { signupWithPassword, loginWithPassword } from "../src/password.js";
import { defaultHandleRedirect } from "../src/url.js";
import { defaultHandleTokens } from "../src/tokens.js";
import * as Pkce from "../src/pkce.js";

vi.mock("../src/api.js");
vi.mock("../src/refresh.js");
vi.mock("../src/url.js");
vi.mock("../src/tokens.js");
vi.mock("../src/pkce.js");

const tenantId = "abcd9876";

// Mock API response
const mockResponse = {
  data: {
    tokens: {
      access: { value: createAccessToken() },
      id: { value: createIdToken() },
      refresh: { value: createRefreshToken() },
    },
    nonce: "nonce-value",
    redirectTo: "/dashboard",
  },
};

// Mock "MFA Required" API response
const mockMfaRequiredResponse = createMfaRequiredResponse({
  firstFactor: {
    strategy: "password",
    channel: "email",
  },
});

const mockPkceRequiredResponse = {
  data: {
    message: "PKCE required",
    authorizationCode: "auth-code",
    redirectTo: "my-app:/login",
  },
};

describe("signupWithPassword()", () => {
  beforeEach(() => {
    Userfront.init(tenantId);
    vi.resetAllMocks();
    unsetUser();
  });

  it("should send a request, set access and ID cookies, and initiate nonce exchange", async () => {
    // Mock the API response
    api.post.mockImplementationOnce(() => mockResponse);

    // Call signupWithPassword()
    const payload = {
      email: idTokenUserDefaults.email,
      name: idTokenUserDefaults.name,
      userData: idTokenUserDefaults.data,
      password: "something",
    };
    const data = await signupWithPassword(payload);

    // Should have sent the proper API request
    expect(api.post).toHaveBeenCalledWith(
      `/tenants/${tenantId}/auth/create`,
      {
        email: payload.email,
        name: payload.name,
        data: payload.userData,
        password: payload.password,
      },
      noMfaHeaders
    );

    // Should have returned the proper value
    expect(data).toEqual(mockResponse.data);

    // Should call defaultHandleTokens correctly
    expect(defaultHandleTokens).toHaveBeenCalledWith(data.tokens, data);

    // Should call defaultHandleRedirect correctly
    expect(defaultHandleRedirect).toHaveBeenCalledWith(data.redirectTo, data);
  });

  it("should sign up and redirect to provided path", async () => {
    // Mock the API response
    api.post.mockImplementationOnce(() => mockResponse);

    // Call signupWithPassword()
    const payload = {
      email: idTokenUserDefaults.email,
      password: "something",
      redirect: "/custom",
    };
    const data = await signupWithPassword(payload);

    // Should have sent the proper API request
    expect(api.post).toHaveBeenCalledWith(
      `/tenants/${tenantId}/auth/create`,
      {
        email: payload.email,
        password: payload.password,
      },
      noMfaHeaders
    );

    // Should have returned the proper value
    expect(data).toEqual(mockResponse.data);

    // Should call defaultHandleTokens correctly
    expect(defaultHandleTokens).toHaveBeenCalledWith(data.tokens, data);

    // Should call defaultHandleRedirect correctly
    expect(defaultHandleRedirect).toHaveBeenCalledWith(payload.redirect, data);
  });

  it("should sign up and not redirect if redirect = false", async () => {
    // Update the userId to ensure it is overwritten
    const newAttrs = {
      userId: 891,
      email: "another@example.com",
    };
    const mockResponseCopy = JSON.parse(JSON.stringify(mockResponse));
    mockResponseCopy.data.tokens.id.value = createIdToken(newAttrs);

    // Mock the API response
    api.post.mockImplementationOnce(() => mockResponseCopy);

    // Call signupWithPassword() with redirect = false
    const payload = {
      email: newAttrs.email,
      password: "something",
    };
    const data = await signupWithPassword({
      redirect: false,
      ...payload,
    });

    // Should have sent the proper API request
    expect(api.post).toHaveBeenCalledWith(
      `/tenants/${tenantId}/auth/create`,
      payload,
      noMfaHeaders
    );

    // Should have returned the proper value
    expect(data).toEqual(mockResponseCopy.data);

    // Should call defaultHandleTokens correctly
    expect(defaultHandleTokens).toHaveBeenCalledWith(data.tokens, data);

    // Should not call defaultHandleRedirect
    expect(defaultHandleRedirect).not.toHaveBeenCalled();
  });

  it("should respond with whatever error the server sends", async () => {
    // Mock the API response
    const mockResponse = {
      response: {
        data: {
          error: "Bad Request",
          message: `That's a dumb email address.`,
          statusCode: 400,
        },
      },
    };
    api.post.mockImplementationOnce(() => Promise.reject(mockResponse));
    expect(
      signupWithPassword({
        email: "valid@example.com",
        password: "somevalidpassword",
      })
    ).rejects.toEqual(new Error(mockResponse.response.data.message));
  });

  it("should handle an MFA Required response", async () => {
    // Return an MFA Required response
    api.post.mockImplementationOnce(() => mockMfaRequiredResponse);

    const payload = {
      email: "email@example.com",
      password: "something",
    };
    const data = await signupWithPassword(payload);

    // Should have sent the correct API request
    expect(api.post).toHaveBeenCalledWith(
      `/tenants/${tenantId}/auth/create`,
      {
        email: payload.email,
        password: payload.password,
      },
      noMfaHeaders
    );

    // Should have updated the MFA service state
    assertAuthenticationDataMatches(mockMfaRequiredResponse);

    // Should not have set the user object or redirected
    expect(defaultHandleTokens).not.toHaveBeenCalled();
    expect(defaultHandleRedirect).not.toHaveBeenCalled();

    // Should have returned MFA options & firstFactorToken
    expect(data).toEqual(mockMfaRequiredResponse.data);
  });

  it("should include the firstFactorToken if this is the second factor", async () => {
    // Set up the MFA service
    setMfaRequired();
    api.post.mockImplementationOnce(() => mockResponse);
    const payload = {
      email: "email@example.com",
      password: "something",
    };
    await signupWithPassword(payload);

    // Should have sent the correct API request, with MFA headers
    expect(api.post).toHaveBeenCalledWith(
      `/tenants/${tenantId}/auth/create`,
      {
        email: payload.email,
        password: payload.password,
      },
      mfaHeaders
    );
  });
});

describe("loginWithPassword()", () => {
  beforeEach(() => {
    Userfront.init(tenantId);
    vi.resetAllMocks();
    unsetUser();
  });

  describe("with username & password", () => {
    it("should send a request, set access and ID cookies, and initiate nonce exchange", async () => {
      // Mock the API response
      api.post.mockImplementationOnce(() => mockResponse);

      // Call loginWithPassword()
      const payload = {
        emailOrUsername: idTokenUserDefaults.email,
        password: "something",
      };
      const data = await loginWithPassword(payload);

      // Should have sent the proper API request
      expect(api.post).toHaveBeenCalledWith(
        `/tenants/${tenantId}/auth/basic`,
        payload,
        noMfaHeaders
      );

      // Should have returned the proper value
      expect(data).toEqual(mockResponse.data);

      // Should call defaultHandleTokens correctly
      expect(defaultHandleTokens).toHaveBeenCalledWith(data.tokens, data);

      // Should call defaultHandleRedirect correctly
      expect(defaultHandleRedirect).toHaveBeenCalledWith(data.redirectTo, data);
    });

    it("should login and not redirect if redirect = false", async () => {
      // Update the userId to ensure it is overwritten
      const newAttrs = {
        userId: 1009,
        email: "someone-else@example.com",
      };
      const mockResponseCopy = JSON.parse(JSON.stringify(mockResponse));
      mockResponseCopy.data.tokens.id.value = createIdToken(newAttrs);

      // Mock the API response
      api.post.mockImplementationOnce(() => mockResponseCopy);

      // Call loginWithPassword() with redirect = false
      const payload = {
        email: newAttrs.email,
        password: "something",
      };
      const data = await loginWithPassword({
        redirect: false,
        ...payload,
      });

      // Should have sent the proper API request
      expect(api.post).toHaveBeenCalledWith(
        `/tenants/${tenantId}/auth/basic`,
        {
          emailOrUsername: payload.email,
          password: payload.password,
        },
        noMfaHeaders
      );

      // Should have returned the proper value
      expect(data).toEqual(mockResponseCopy.data);

      // Should call defaultHandleTokens correctly
      expect(defaultHandleTokens).toHaveBeenCalledWith(data.tokens, data);

      // Should not call defaultHandleRedirect
      expect(defaultHandleRedirect).not.toHaveBeenCalled();
    });

    it("should login and redirect to a provided path", async () => {
      api.post.mockImplementationOnce(() => mockResponse);

      // Call loginWithPassword() with redirect = false
      const payload = {
        emailOrUsername: idTokenUserDefaults.email,
        password: "something",
      };
      const data = await loginWithPassword({
        redirect: false,
        ...payload,
      });

      // Should have sent the proper API request
      expect(api.post).toHaveBeenCalledWith(
        `/tenants/${tenantId}/auth/basic`,
        payload,
        noMfaHeaders
      );

      // Should have returned the proper value
      expect(data).toEqual(mockResponse.data);

      // Should call defaultHandleTokens correctly
      expect(defaultHandleTokens).toHaveBeenCalledWith(data.tokens, data);

      // Should not call defaultHandleRedirect
      expect(defaultHandleRedirect).not.toHaveBeenCalled();
    });

    it("should set the noResetEmail option if provided", async () => {
      // Mock the API response
      api.post.mockImplementationOnce(() => mockResponse);

      // Call loginWithPassword()
      const payload = {
        emailOrUsername: idTokenUserDefaults.email,
        password: "something",
        options: {
          noResetEmail: true,
        },
      };
      await loginWithPassword(payload);

      // Should have sent the proper API request
      expect(api.post).toHaveBeenCalledWith(
        `/tenants/${tenantId}/auth/basic`,
        {
          ...payload,
          options: {
            noResetEmail: true,
          },
        },
        noMfaHeaders
      );
    });

    it("should respond with whatever error the server sends", async () => {
      // Mock the API response
      const mockResponse = {
        response: {
          data: {
            error: "Bad Request",
            message: `That's a dumb email address.`,
            statusCode: 400,
          },
        },
      };
      api.post.mockImplementationOnce(() => Promise.reject(mockResponse));
      expect(
        loginWithPassword({
          email: "valid@example.com",
          password: "somevalidpassword",
        })
      ).rejects.toEqual(new Error(mockResponse.response.data.message));
    });

    it("should handle an MFA Required response", async () => {
      // Return an MFA Required response
      api.post.mockImplementationOnce(() => mockMfaRequiredResponse);

      const payload = {
        email: "email@example.com",
        password: "something",
      };
      const data = await loginWithPassword(payload);

      // Should have sent the correct API request
      expect(api.post).toHaveBeenCalledWith(
        `/tenants/${tenantId}/auth/basic`,
        {
          emailOrUsername: payload.email,
          password: payload.password,
        },
        noMfaHeaders
      );

      // Should have updated the MFA service state
      assertAuthenticationDataMatches(mockMfaRequiredResponse);

      // Should not have set the user object or redirected
      expect(defaultHandleTokens).not.toHaveBeenCalled();
      expect(defaultHandleRedirect).not.toHaveBeenCalled();

      // Should have returned MFA options & firstFactorToken
      expect(data).toEqual(mockMfaRequiredResponse.data);
    });

    it("should include the firstFactorToken if this is the second factor", async () => {
      // Set up the MFA service
      setMfaRequired();
      api.post.mockImplementationOnce(() => mockResponse);
      const payload = {
        email: "email@example.com",
        password: "something",
      };
      await loginWithPassword(payload);

      // Should have sent the correct API request, with MFA headers
      expect(api.post).toHaveBeenCalledWith(
        `/tenants/${tenantId}/auth/basic`,
        {
          emailOrUsername: payload.email,
          password: payload.password,
        },
        mfaHeaders
      );
    });

    it("should call handleRedirect instead of defaultHandleRedirect if present", async () => {
      // Mock the API response
      api.post.mockImplementationOnce(() => mockResponse);

      const handleRedirect = vi.fn();

      // Call loginWithPassword()
      const payload = {
        emailOrUsername: idTokenUserDefaults.email,
        password: "something",
      };
      const data = await loginWithPassword({ ...payload, handleRedirect });

      // Should have sent the proper API request
      expect(api.post).toHaveBeenCalledWith(
        `/tenants/${tenantId}/auth/basic`,
        payload,
        noMfaHeaders
      );

      // Should have returned the proper value
      expect(data).toEqual(mockResponse.data);

      // Should call defaultHandleTokens correctly
      expect(defaultHandleTokens).toHaveBeenCalledWith(data.tokens, data);

      // Should call handleRedirect correctly
      expect(handleRedirect).toHaveBeenCalledWith(data.redirectTo, data);

      // Should not call defaultHandleRedirect
      expect(defaultHandleRedirect).not.toHaveBeenCalled();
    });

    it("should call handleTokens instead of defaultHandleTokens if present", async () => {
      // Mock the API response
      api.post.mockImplementationOnce(() => mockResponse);

      const handleTokens = vi.fn();

      // Call loginWithPassword()
      const payload = {
        emailOrUsername: idTokenUserDefaults.email,
        password: "something",
      };
      const data = await loginWithPassword({ ...payload, handleTokens });

      // Should have sent the proper API request
      expect(api.post).toHaveBeenCalledWith(
        `/tenants/${tenantId}/auth/basic`,
        payload,
        noMfaHeaders
      );

      // Should have returned the proper value
      expect(data).toEqual(mockResponse.data);

      // TODO update to set the user object even when custom handleTokens() method is used
      // https://linear.app/userfront/issue/DEV-327/corejs-set-the-userfrontuser-object-when-custom-handletokens-method-is
      // Should not have set the user object
      expect(Userfront.user.email).toEqual(undefined);
      expect(Userfront.user.userId).toEqual(undefined);

      // Should call defaultHandleRedirect correctly
      expect(defaultHandleRedirect).toHaveBeenCalledWith(
        mockResponse.data.redirectTo,
        mockResponse.data
      );

      // Should call handleTokens correctly
      expect(handleTokens).toHaveBeenCalledWith(
        mockResponse.data.tokens,
        mockResponse.data
      );

      // Should not call defaultHandleTokens
      expect(defaultHandleTokens).not.toHaveBeenCalled();
    });

    describe("with PKCE", () => {
      it("signup: should send a PKCE request if PKCE is required", async () => {
        Pkce.getPkceRequestQueryParams.mockImplementationOnce(() => ({
          code_challenge: "code",
        }));
        // Mock the API response
        api.post.mockImplementationOnce(() => mockResponse);

        // Call loginWithPassword()
        const payload = {
          email: idTokenUserDefaults.email,
          password: "something",
        };
        await signupWithPassword(payload);

        // Should have sent the proper API request
        expect(api.post).toHaveBeenCalledWith(
          `/tenants/${tenantId}/auth/create`,
          {
            email: payload.email,
            password: payload.password,
          },
          pkceParams("code")
        );
      });

      it("signup: should handle a PKCE Required response", async () => {
        Pkce.getPkceRequestQueryParams.mockImplementationOnce(() => ({
          code_challenge: "code",
        }));
        api.post.mockImplementationOnce(() => mockPkceRequiredResponse);
        // Call loginWithPassword()
        const payload = {
          email: idTokenUserDefaults.email,
          password: "something",
        };
        const data = await signupWithPassword(payload);

        // Should have sent the proper API request
        expect(api.post).toHaveBeenCalledWith(
          `/tenants/${tenantId}/auth/create`,
          {
            email: payload.email,
            password: payload.password,
          },
          pkceParams("code")
        );

        // Should have requested PKCE redirect with the correct params
        expect(Pkce.defaultHandlePkceRequired).toHaveBeenCalledWith(
          data.authorizationCode,
          data.redirectTo,
          data
        );
      });
      it("login: should send a PKCE request if PKCE is required", async () => {
        Pkce.getPkceRequestQueryParams.mockImplementationOnce(() => ({
          code_challenge: "code",
        }));
        // Mock the API response
        api.post.mockImplementationOnce(() => mockResponse);

        // Call loginWithPassword()
        const payload = {
          emailOrUsername: idTokenUserDefaults.email,
          password: "something",
        };
        await loginWithPassword(payload);

        // Should have sent the proper API request
        expect(api.post).toHaveBeenCalledWith(
          `/tenants/${tenantId}/auth/basic`,
          payload,
          pkceParams("code")
        );
      });

      it("login: should handle a PKCE Required response", async () => {
        Pkce.getPkceRequestQueryParams.mockImplementationOnce(() => ({
          code_challenge: "code",
        }));
        api.post.mockImplementationOnce(() => mockPkceRequiredResponse);
        // Call loginWithPassword()
        const payload = {
          emailOrUsername: idTokenUserDefaults.email,
          password: "something",
        };
        const data = await loginWithPassword(payload);

        // Should have sent the proper API request
        expect(api.post).toHaveBeenCalledWith(
          `/tenants/${tenantId}/auth/basic`,
          payload,
          pkceParams("code")
        );

        // Should have requested PKCE redirect with the correct params
        expect(Pkce.defaultHandlePkceRequired).toHaveBeenCalledWith(
          data.authorizationCode,
          data.redirectTo,
          data
        );
      });
    });
  });
});
