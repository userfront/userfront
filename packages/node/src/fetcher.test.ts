import { describe, expect, it } from "vitest";
import fetcher from "./fetcher";

describe("fetcher", () => {
  it("exported", async () => {
    // Assert fetcher
    expect(fetcher).toBeDefined();
    expect(fetcher("https://api.userfront.com", {})).toBeInstanceOf(Promise);
  });

  it("works with GET requests", async () => {
    const response = await fetcher("https://api.userfront.com/v0/", {
      method: "GET",
    });

    // Assert the response
    expect(response).toBeInstanceOf(Object);
    expect(response.status).toBe(200);
    expect(response.statusText).toBe("OK");

    // Assert the response data
    const data = await response.json();
    expect(data).toBeInstanceOf(Object);
    expect(data).toStrictEqual({ method: "GET" });
  });

  it("has a working POST fetcher", async () => {
    const response = await fetcher("https://api.userfront.com/v0/", {
      method: "POST",
    });

    // Assert the response
    expect(response).toBeInstanceOf(Object);
    expect(response.status).toBe(200);
    expect(response.statusText).toBe("OK");

    // Assert the response data
    const data = await response.json();
    expect(data).toBeInstanceOf(Object);
    expect(data).toStrictEqual({ method: "POST" });
  });

  it("has a working PUT fetcher", async () => {
    const response = await fetcher("https://api.userfront.com/v0/", {
      method: "PUT",
    });

    // Assert the response
    expect(response).toBeInstanceOf(Object);
    expect(response.status).toBe(200);
    expect(response.statusText).toBe("OK");

    // Assert the response data
    const data = await response.json();
    expect(data).toBeInstanceOf(Object);
    expect(data).toStrictEqual({ method: "PUT" });
  });

  it("has a working DELETE fetcher", async () => {
    const response = await fetcher("https://api.userfront.com/v0/", {
      method: "DELETE",
    });

    // Assert the response
    expect(response).toBeInstanceOf(Object);
    expect(response.status).toBe(200);
    expect(response.statusText).toBe("OK");

    // Assert the response
    const data = await response.json();
    expect(data).toBeInstanceOf(Object);
    expect(data).toStrictEqual({ method: "DELETE" });
  });
});
