// Interface for userfront-core,
// for uniformity for Logout and PasswordReset forms that don't
// need a state machine to describe their behavior.

import Userfront from "@userfront/core";
import { get } from "lodash";

interface Store {
  tenantId?: string;
}

declare module "@userfront/core" {
  const store: Store;
}

let singleton = Userfront;
let isSingletonOverridden = false;

/**
 * Override the Userfront singleton imported from @userfront/core with an object of your choice.
 *
 * @param newSingleton object to use in place of the Userfront singleton
 */
export const overrideUserfrontSingleton = (newSingleton: any) => {
  singleton = newSingleton as typeof Userfront;
  isSingletonOverridden = true;
};

// A type with the keys of all functions in Type
type Functions<Type> = {
  [Key in keyof Type]-?: Type[Key] extends Function
    ? Key
    : Type[Key] extends object
    ? Functions<Type[Key]> // Recursively check nested objects
    : never;
}[keyof Type];

export interface CallUserfront {
  method: Functions<typeof singleton>;
  args: Array<Object>;
}

/**
 * Get a property by key from the Userfront singleton, wrapped in a Promise
 * so that this can be invoked as an XState service.
 * The key may be a path ("path.to.value" -> Userfront.path.to.value)
 * The target singleton can be changed with overrideUserfrontSingleton.
 *
 * @param key key of the property to get from Userfront
 * @returns value of Userfront[key]
 */
export const getUserfrontProperty = async (key: string) => {
  if (!key) {
    console.warn(
      "Tried to read a key from the Userfront object, but no key was provided."
    );
    return Promise.reject();
  }
  if (get(singleton, key)) {
    return get(singleton, key);
  }
  console.warn(
    `Tried to read key ${key} from the Userfront object, but no such key was found in the object or object.store.`
  );
  return undefined;
};

/**
 * Get a property by key from the Userfront singleton without wrapping in a Promise.
 * The key may be a path ("path.to.value" -> Userfront.path.to.value)
 * The target singleton can be changed with overrideUserfrontSingleton.
 *
 * @param key key to retrieve
 * @returns value of Userfront[key]
 */
export const getUserfrontPropertySync = (key: string) => {
  if (!key) {
    console.warn(
      "Tried to read a key from the Userfront object, but no key was provided."
    );
    throw new Error();
  }
  if (get(singleton, key)) {
    return get(singleton, key);
  }
  console.warn(
    `Tried to read key ${key} from the Userfront object, but no such key was found in the object or object.store.`
  );
  return undefined;
};

/**
 * Call a method on the Userfront singleton, ensuring that a Promise is returned so that this can be
 * invoked as a service in XState models.
 * The target singleton can be changed with overrideUserfrontSingleton.
 *
 * @param {object} config
 * @param {string} config.method method name to call; may be a path ("path.to.method" -> Userfront.path.to.method())
 * @param {Array} config.args arguments to pass to the method
 * @returns {Promise} result of the call, wrapped in a Promise even if the method is sync
 */
export const callUserfront = async ({ method, args = [] }: CallUserfront) => {
  // Allow Userfront.init() when singleton is present but not initialized
  if (method === "init" && !!singleton) {
    return (<any>singleton.init)(...args);
  }
  if (!singleton || !singleton.store?.tenantId) {
    console.warn(
      "Tried to call a Userfront method before the Userfront service was initialized."
    );
    return Promise.reject();
  }
  const _method = get(singleton, method);
  if (!_method || !(typeof _method === "function")) {
    console.warn(`Method ${method} not found on Userfront object.`);
    return Promise.reject();
  }
  try {
    const res = await (<any>_method)(...args);
    // Workaround to avoid flickering when CoreJS redirects:
    // wait for the current iteration of the event loop to finish,
    // and for the async task queue to finish,
    // and for the NEXT event loop cycle to finish,
    // then return.
    // TODO DEV-658 fix this in a nicer and more reliable way
    if (isSingletonOverridden) {
      // Don't wait if we've overridden the CoreJS singleton,
      // i.e. mocked it out for tests.
      return res;
    }
    return new Promise((resolve) => {
      setTimeout(() => resolve(res), 1);
    });
  } catch (err: any) {
    console.warn(
      `Method ${method} on Userfront object threw. Error: ${err.message}`
    );
    return Promise.reject(err);
  }
};

/**
 * Call a method on the Userfront singleton, immediately returning the result (which may be a Promise).
 * The target singleton can be changed with overrideUserfrontSingleton.
 * @param {object} config
 * @param {string} config.method method name to call; may be a path ("path.to.method" -> Userfront.path.to.method())
 * @param {Array} config.args arguments to pass to the method
 * @returns result of the call, which may be a Promise if the method is async
 */
export const callUserfrontSync = ({ method, args = [] }: CallUserfront) => {
  // Allow Userfront.init() when singleton is present but not initialized
  if (method === "init" && !!singleton) {
    return (<any>singleton.init)(...args);
  }
  if (!singleton || !singleton.store?.tenantId) {
    console.warn(
      "Tried to call a Userfront method before the Userfront service was initialized."
    );
    throw new Error();
  }
  const _method = get(singleton, method);
  if (!_method || !(typeof _method === "function")) {
    console.warn(`Method ${method} not found on Userfront object.`);
    throw new Error();
  }
  try {
    return (<any>_method)(...args);
  } catch (err: any) {
    console.warn(
      `Method ${method} on Userfront object threw. Error: ${err.message}`
    );
    throw err;
  }
};
