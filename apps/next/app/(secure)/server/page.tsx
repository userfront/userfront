/**
 * This is an example of a server component with `@userfront/next/server`
 * that gets the current environment's workspace.
 */
"use server";

import Link from "next/link";
import Image from "next/image";
import { getWorkspace } from "@userfront/next/server";

function DescriptionList({ data }: { data: (boolean | React.ReactNode[])[] }) {
  return (
    <dl className="text-sm">
      {data.filter(Boolean).map((dataItem: boolean | React.ReactNode[]) =>
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

export default async function DashboardPage() {
  const workspace = await getWorkspace();

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
            src={workspace.image}
            alt={workspace.name}
            width={320}
            height={320}
            className="w-12 h-12 mx-auto"
          />
          <DescriptionList
            data={[
              ["UUID", workspace.uuid],
              ["Name", workspace.name],
              ["Tenant ID", workspace.tenantId],
              [
                "Alias",
                workspace.aliasId ?? <span className="opacity-50">None</span>,
              ],
              ["Type", workspace.type],
            ]}
          />
        </div>
        <div className="flex flex-col gap-y-4 pt-4">
          <h2 className="font-bold">Parent Workspace</h2>
          <Image
            src={workspace.parent.image}
            alt={workspace.parent.name}
            width={320}
            height={320}
            className="w-12 h-12 mx-auto"
          />
          <DescriptionList
            data={[
              ["Name", workspace.parent.name],
              ["Tenant ID", workspace.parent.tenantId],
              ["mode", workspace.parent.mode],
            ]}
          />
        </div>
        <div className="flex flex-col gap-y-4 pt-4">
          <h2 className="font-bold">Workspace Creator</h2>
          <Image
            src={workspace.creator.image}
            alt={workspace.creator.name}
            width={320}
            height={320}
            className="w-12 h-12 mx-auto"
          />
          <DescriptionList
            data={[
              !!workspace.creator.name && ["Name", workspace.creator.name],
              ["Email Address", workspace.creator.email],
              ["User ID", workspace.creator.userId],
              ["Username", workspace.creator.username],
              [
                "Last Active",
                new Date(workspace.creator.lastActiveAt).toLocaleString(),
              ],
            ].filter(Boolean)}
          />
        </div>
      </div>
    </>
  );
}
