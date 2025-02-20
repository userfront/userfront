/**
 * This is an example of a server component with `@userfront/next/server`
 * that gets the current environment's workspace.
 */
"use server";

import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { getTenant } from "@userfront/next/server";
import dynamic from "next/dynamic";

function DescriptionList({ data }: { data: (boolean | ReactNode[])[] }) {
  return (
    <dl className="text-sm">
      {data.filter(Boolean).map((dataItem: boolean | ReactNode[]) =>
        !!Array.isArray(dataItem) ? (
          <div className="grid grid-cols-2 gap-4" key={String(dataItem[1])}>
            <dt className="font-bold text-right">{dataItem[0]}</dt>
            <dd className="text-left">{dataItem[1]}</dd>
          </div>
        ) : null,
      )}
    </dl>
  );
}

async function DashboardPage() {
  const tenant = await getTenant();

  if (!tenant) {
    return (
      <Link
        href="/dashboard"
        className="absolute top-0 left-0 p-4 text-sm text-gray-200 hover:text-gray-400 dark:text-gray-400 dark:hover:text-gray-200 transition-all ease-in-out duration-300"
      >
        &#8592; Go Back
      </Link>
    );
  }

  return (
    <>
      <Link
        href="/dashboard"
        className="absolute top-0 left-0 p-4 text-sm text-gray-200 hover:text-gray-400 dark:text-gray-400 dark:hover:text-gray-200 transition-all ease-in-out duration-300"
      >
        &#8592; Go Back
      </Link>
      <div className="flex flex-col p-4 gap-y-4 divide-y divide-gray-500/25">
        <div className="flex flex-col gap-y-4">
          <h2 className="font-bold">Current Workspace</h2>
          <Image
            src={tenant.image}
            alt={tenant.name}
            width={320}
            height={320}
            className="w-12 h-12 mx-auto"
          />
          <DescriptionList
            data={[
              ["UUID", tenant.uuid],
              ["Name", tenant.name],
              ["Tenant ID", tenant.tenantId],
              [
                "Alias",
                tenant.aliasId ?? <span className="opacity-50">None</span>,
              ],
              ["Type", tenant.type],
            ]}
          />
        </div>
        {tenant?.parent && (
          <div className="flex flex-col gap-y-4 pt-4">
            <h2 className="font-bold">Parent Workspace</h2>
            <Image
              src={tenant.parent.image}
              alt={tenant.parent.name}
              width={320}
              height={320}
              className="w-12 h-12 mx-auto"
            />
            <DescriptionList
              data={[
                ["Name", tenant.parent.name],
                ["Tenant ID", tenant.parent.tenantId],
                ["mode", tenant.parent.mode],
              ]}
            />
          </div>
        )}
        {tenant?.creator && (
          <div className="flex flex-col gap-y-4 pt-4">
            <h2 className="font-bold">Workspace Creator</h2>
            <Image
              src={tenant.creator.image}
              alt={tenant.creator.name}
              width={320}
              height={320}
              className="w-12 h-12 mx-auto"
            />
            <DescriptionList
              data={[
                !!tenant.creator.name && ["Name", tenant.creator.name],
                ["Email Address", tenant.creator.email],
                ["User ID", tenant.creator.userId],
                ["Username", tenant.creator.username],
                [
                  "Last Active",
                  new Date(tenant.creator.lastActiveAt).toLocaleString(),
                ],
              ].filter(Boolean)}
            />
          </div>
        )}
      </div>
    </>
  );
}

export default dynamic(() => Promise.resolve(DashboardPage), { ssr: false });
