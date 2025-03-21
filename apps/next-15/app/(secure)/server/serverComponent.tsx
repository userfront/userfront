import { getTenant } from "@userfront/next/server";
import DashboardPage from "./dashboardClient";

export default async function DashboardServer() {
    const tenant = await getTenant();

    return <DashboardPage tenant={tenant} />;
}
