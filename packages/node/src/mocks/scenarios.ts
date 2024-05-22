import { http, HttpResponse } from "msw";
import error500 from "./error-500.json";
import mockTenant from "./tenants-mock1234-GET.json";
import demoTenant from "./tenants-demo1234-GET.json";
import mockUser from "./user-GET.json";

const apiUrl = (route = "") => `https://api.userfront.com/v0${route}`;

export const scenarios = {
  success: [
    http.get(
      `https://api.example.com/v0/tenants/${mockTenant.tenantId}`,
      () => {
        return HttpResponse.json({ name: "Different baseUrl" });
      },
    ),
    http.get(`https://api.example.com/tenants/${mockTenant.tenantId}`, () => {
      return HttpResponse.json({ name: "No version" });
    }),
    http.get(
      `https://api.example.com/v1/tenants/${mockTenant.tenantId}`,
      () => {
        return HttpResponse.json({ name: "Version 1" });
      },
    ),
    http.get(apiUrl("/"), () => {
      return HttpResponse.json({ method: "GET" }, { status: 200 });
    }),
    http.post(apiUrl("/"), () => {
      return HttpResponse.json({ method: "POST" }, { status: 200 });
    }),
    http.put(apiUrl("/"), () => {
      return HttpResponse.json({ method: "PUT" }, { status: 200 });
    }),
    http.delete(apiUrl("/"), () => {
      return HttpResponse.json({ method: "DELETE" }, { status: 200 });
    }),
    http.get(apiUrl(`/tenants/${mockTenant.tenantId}`), () => {
      return HttpResponse.json(mockTenant, { status: 200 });
    }),
    http.get(apiUrl(`/tenants/${demoTenant.tenantId}`), () => {
      return HttpResponse.json(demoTenant, { status: 200 });
    }),
    http.get(apiUrl(`/users/${mockUser.uuid}`), () => {
      return HttpResponse.json(mockUser, { status: 200 });
    }),
  ],
  error: [
    http.get(apiUrl(`/tenants/${mockTenant.tenantId}`), () => {
      return new HttpResponse(error500, { status: 500 });
    }),
  ],
};
