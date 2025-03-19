import { describe, it, expect } from "vitest";

import { assign } from "xstate";
import { AuthContext, SelectFactorEvent, Factor } from "@/models/types";
import { factorConfig } from "@/models/config/utils";
import { createAuthContextForFactor } from "@test/utils";
import { setupView, setTenantIdIfPresent } from "@/models/config/actions";

describe("models/actions.ts", () => {
  describe("setupView", () => {
    it("should set up the Password view context if no factor is given", () => {
      const event = {
        type: "selectFactor",
        factor: {} as Factor,
        isSecondFactor: false,
      };
      const expected = assign({
        view: {
          password: "",
        },
      });
      const actual = setupView(
        {} as AuthContext<any>,
        event as SelectFactorEvent
      );
      expect(actual).toEqual(expected);
    });
    Object.entries(factorConfig).forEach(([key, factorData]) => {
      it(`should set up the correct context for the ${key} factor`, () => {
        const event = {
          type: "selectFactor",
          factor: {
            channel: factorData.channel,
            strategy: factorData.strategy,
          },
          isSecondFactor: false,
        };
        const expected = assign({
          view: factorData.viewContext,
        });
        const actual = setupView(
          {} as AuthContext<any>,
          event as SelectFactorEvent
        );
        expect(actual).toEqual(expected);
      });
    });
  });
  describe("setTenantIdIfPresent", () => {
    it("should set the tenantId if one is available", () => {
      const event = {
        type: "done" as any,
        data: "demo1234",
      };
      const context = createAuthContextForFactor("password");
      const expected = {
        config: {
          ...context.config,
          tenantId: "demo1234",
        },
      };
      const actual = (<Function>setTenantIdIfPresent.assignment)(
        context,
        event
      );
      expect(actual).toEqual(expected);
    });
    it("should set shouldFetchFlow = false if no tenantId is available", () => {
      const event = {
        type: "done" as any,
        data: "",
      };
      const context = createAuthContextForFactor("password");
      const expected = {
        config: {
          ...context.config,
          shouldFetchFlow: false,
        },
      };
      const actual = (<Function>setTenantIdIfPresent.assignment)(
        context,
        event
      );
      expect(actual).toEqual(expected);
    });
  });
});
