import { AuthContext, FormError, FormType } from "../../src/models/types";
import { overrideUserfrontSingleton } from "../../src/services/userfront";
import Userfront from "@userfront/core";
import { expect } from "vitest";

import { factorConfig } from "../../src/models/config/utils";

/**
 * Create a reasonable context for a particular factor's model.
 *
 * @param name Factor to create context for
 * @returns context to use with createMachine(...)
 */
export const createAuthContextForFactor = (name: string): AuthContext<any> => {
  const key = name as keyof typeof factorConfig;
  const view = factorConfig[key]?.viewContext ?? {};
  const context = {
    user: {
      email: "test@email.com",
      phoneNumber: "+15555555",
    },
    config: {
      type: "signup" as FormType,
      compact: false,
      locale: "en-US",
      mode: "live",
      shouldFetchFlow: true,
    },
    view,
    isSecondFactor: false,
    allowBack: false,
    query: {
      token: "",
      uuid: "",
    },
  };
  return context;
};

/**
 * A call to a mock Userfront singleton method
 */
type Call = {
  method: string;
  args: any[];
  resolve: (result: any) => Promise<any>;
  reject: (error: FormError) => Promise<any>;
  id?: number;
};

// Throw if
const unexpectedResolve = async () => {
  expect.fail(`Tried to resolve a call to the mock Userfront singleton before any calls were made.
    The test subject may not have made the expected method call, or the test may have tried to resolve the call before the subject made it.`);
};

const unexpectedReject = async () => {
  expect.fail(`Tried to reject a call to the mock Userfront singleton before any calls were made.
    The test subject may not have made the expected method call, or the test may have tried to reject the call before the subject made it.`);
};

/**
 * @typedef {Object} MockUserfrontService
 * @property {object} singleton - the underlying object for the mock Userfront singleton
 * @property {Proxy<object>} proxy - the singleton wrapped in a proxy to trap method calls;
 *   this is what should actually be provided to overrideUserfrontSingleton to use as the mock
 * @property {Call[]} calls - an array of all calls to methods on the mock singleton
 * @property {Call} lastCall - the most recent call to a method on the mock singleton
 * @property {function} resolve - resolve the last call with a value
 *   @returns {Promise} - the promise returned by the mock singleton for the last call,
 *     if you need to await some action the test subject takes in response
 * @property {function} reject - reject the last call with an error
 *   @returns {Promise} - the promise returned by the mock singleton for the last call,
 *     if you need to await some action the test subject takes in response
 * @property {function} restoreUserfront - restore the Userfront singleton
 */

/**
 * Create a mock Userfront service
 *
 * @returns {MockUserfrontService} - the mock Userfront service. Use service.proxy as the mock singleton.
 */
export const createMockUserfront = (modifiedStore?: object) => {
  const calls: Call[] = [];
  const singleton = {
    store: {
      tenantId: "tenantId",
      ...modifiedStore,
    },
  };
  const service = {
    /**
     * Array of all calls to methods on the mock singleton, in chronological order.
     * @property
     */
    get calls() {
      return calls;
    },
    /**
     * The most recent call to a method on the mock singleton
     * @property
     */
    get lastCall() {
      if (calls.length === 0) {
        return null;
      }
      return calls[calls.length - 1];
    },
    /**
     * Resolve the most recent method call with some value, and return the Promise that the method call returned,
     * in case you need to await some action the test subject takes in response.
     * @property {function}
     *   @returns {Promise}
     */
    get resolve() {
      if (calls.length === 0) {
        return unexpectedResolve;
      }
      return calls[calls.length - 1].resolve;
    },
    /**
     * Reject the most recent method call with some error value, and return the Promise that the method call returned,
     * in case you need to await some action the test subject takes in response.
     * @property {function}
     *   @returns {Promise}
     */
    get reject() {
      if (calls.length === 0) {
        return unexpectedReject;
      }
      return calls[calls.length - 1].reject;
    },
    singleton,
    proxy: {} as object,
    /**
     * Restore the global Userfront singleton.
     * Doing this in the middle of a test is likely to have odd results.
     * @property {function}
     */
    restoreUserfront: () => overrideUserfrontSingleton(Userfront),
  };

  let id = 0;
  /**
   * Make a mock Userfront singleton method, which returns a promise that can be manually
   * resolved/rejected with service.resolve/service.reject (if it's the most recent call)
   * or with service.calls[n].resolve/service.calls[n].reject
   * @param key key of the method being called
   * @returns {function} a mock method which adds each call to the calls array,
   *   and returns a Promise that we can manually resolve or reject with call.resolve/call.reject
   */
  const makeMethod = (key: string) => {
    return (...args: any[]) => {
      const promise = new Promise(
        (
          _resolve: (...args: any[]) => void,
          _reject: (...args: any[]) => void
        ) => {
          const resolve = (...args: any[]) => {
            _resolve(...args);
            return promise;
          };
          const reject = (...args: any[]) => {
            _reject(...args);
            return promise;
          };
          calls.push({
            method: key,
            args,
            resolve,
            reject,
            id: id++,
          });
        }
      );
      return promise;
    };
  };
  /**
   * Handler for the proxy wrapping the singleton object
   */
  const singletonHandler = {
    /**
     * Trap every attempt to get a property of the singleton.
     * If the property exists on the singleton object, return it.
     * Otherwise, return a mock method.
     * @param target the singleton object
     * @param key the key being accessed
     * @returns either singleton[key] if it exists, or a mock method
     */
    get(target: object, key: keyof object) {
      if (target[key]) {
        return target[key];
      }
      return makeMethod(key);
    },
  };
  /**
   * Proxy-wrapped singleton object, to be used as the mock singleton.
   * The wrapper traps attempts to get properties of the singleton:
   *   - if the property exists, return it
   *   - otherwise, return a mock method
   * @property
   */
  service.proxy = new Proxy(singleton, singletonHandler);
  return service;
};

/**
 * Override the Userfront singleton with a mock, then return the mock's service
 *
 * @returns {MockUserfrontService} - the mock service; the Userfront singleton has already been overridden with service.proxy.
 */
export const useMockUserfront = (modifiedStore?: object) => {
  const service = createMockUserfront(modifiedStore);
  overrideUserfrontSingleton(service.proxy);
  return service;
};

/**
 * Add states with id "backToFactors" and "beginSecondFactor" to a machine config.
 * Convenience function. The form machines each have a backToFactors state
 * that every view's machine references by id if its "Back" button is pressed
 * when on the view's first screen. This adds the appropriate state to a view
 * machine config, so the machine can run outside the context of a form's machine.
 *
 * @param machineConfig the machine config to augment
 * @returns {object} the machine config with a "backToFactors" state added
 */
export function addGlobalStates<T extends { states?: object }>(
  machineConfig: T
): T {
  const states = {
    ...machineConfig.states,
    backToFactors: {
      id: "backToFactors",
    },
    beginSecondFactor: {
      id: "beginSecondFactor",
    },
  };
  return {
    ...machineConfig,
    states,
  };
}
