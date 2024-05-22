import { describe, expect, it } from "vitest";
import http, { DELETE, GET, POST, PUT } from "./http";
import { httpConfig as config } from "./test-utils";
import errorMissingAuth from "./mocks/error-missing-auth.json";

describe("HTTP", () => {
  // The client requests are intercepted by MSW
  describe("client", () => {
    it("has all of the methods", () => {
      expect(http).toBeDefined();
      expect(Object.keys(http).length).toBe(6);
      expect(Object.keys(http)).toStrictEqual([
        "fetcher",
        "fetchJson",
        "GET",
        "POST",
        "PUT",
        "DELETE",
      ]);
    });

    it("has a working GET fetcher", async () => {
      // Assert GET
      expect(http).toHaveProperty("GET");
      expect(http.GET).toBeInstanceOf(Function);
      expect(http.GET.bind(config)("/")).toBeInstanceOf(Promise);

      const response = await http.GET.bind(config)("/");

      // Assert the response
      expect(response).toBeInstanceOf(Object);
      expect(response).toStrictEqual({ method: "GET" });
    });

    it("has a working POST fetcher", async () => {
      // Assert POST
      expect(http).toHaveProperty("POST");
      expect(http.POST).toBeInstanceOf(Function);
      expect(http.POST.bind(config)("/")).toBeInstanceOf(Promise);

      const response = await http.POST.bind(config)("/");

      // Assert the response
      expect(response).toBeInstanceOf(Object);
      expect(response).toStrictEqual({ method: "POST" });
    });

    it("has a working PUT fetcher", async () => {
      // Assert PUT
      expect(http).toHaveProperty("PUT");
      expect(http.PUT).toBeInstanceOf(Function);
      expect(http.PUT.bind(config)("/")).toBeInstanceOf(Promise);

      const response = await http.PUT.bind(config)("/");

      // Assert the response
      expect(response).toBeInstanceOf(Object);
      expect(response).toStrictEqual({ method: "PUT" });
    });

    it("has a working DELETE fetcher", async () => {
      // Assert DELETE
      expect(http).toHaveProperty("DELETE");
      expect(http.DELETE).toBeInstanceOf(Function);
      expect(http.DELETE.bind(config)("/")).toBeInstanceOf(Promise);

      const response = await http.DELETE.bind(config)("/");

      // Assert the response
      expect(response).toBeInstanceOf(Object);
      expect(response).toStrictEqual({ method: "DELETE" });
    });
  });

  // FIXME: For some reason, the methods are not intercepted by MSW
  describe("methods", () => {
    it("has a working GET fetcher", async () => {
      // Assert GET
      expect(GET).toBeDefined();
      expect(GET).toBeInstanceOf(Function);
      expect(GET("/")).toBeInstanceOf(Promise);

      const response = await GET("/status");

      // Assert the response
      expect(response).toBeInstanceOf(Object);
      expect(response).toStrictEqual({ status: "ok" });
    });

    it("has a working POST fetcher", async () => {
      // Assert POST
      expect(POST).toBeDefined();
      expect(POST).toBeInstanceOf(Function);
      expect(POST("/")).toBeInstanceOf(Promise);

      const response = await POST("/tenants");

      // Assert the response
      expect(response).toBeInstanceOf(Object);
      expect(response).toStrictEqual(errorMissingAuth);
    });

    it("has a working PUT fetcher", async () => {
      // Assert PUT
      expect(PUT).toBeDefined();
      expect(PUT).toBeInstanceOf(Function);
      expect(PUT("/")).toBeInstanceOf(Promise);

      const response = await PUT("/tenants/mock1234");

      // Assert the response
      expect(response).toBeInstanceOf(Object);
      expect(response).toStrictEqual(errorMissingAuth);
    });

    it("has a working DELETE fetcher", async () => {
      // Assert DELETE
      expect(DELETE).toBeDefined();
      expect(DELETE).toBeInstanceOf(Function);
      expect(DELETE("/")).toBeInstanceOf(Promise);

      const response = await DELETE("/tenants/mock1234");

      // Assert the response
      expect(response).toBeInstanceOf(Object);
      expect(response).toStrictEqual(errorMissingAuth);
    });
  });
});
