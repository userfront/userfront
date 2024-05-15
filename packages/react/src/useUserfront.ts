import * as React from "react";
import { useIsomorphicLayoutEffect, useToggle } from "react-use";
import Userfront from "@userfront/toolkit/react";
import type { Simplify } from "type-fest";
import type * as _Userfront from "@userfront/core";

type UserfrontInstance = Simplify<typeof Userfront>;

/**
 * Internal hook
 */
export function useUserfront({ tenantId }: { tenantId: string }) {
  const [userfront, setUserfront] = React.useState<UserfrontInstance | null>(
    null,
  );
  const [isLoading, setLoading] = useToggle(true);

  useIsomorphicLayoutEffect(() => {
    if (!tenantId) return;

    (async () => {
      await Userfront.init(tenantId);

      const userfrontInstance = Userfront;

      setUserfront(userfrontInstance);
    })().catch(console.error);
  }, [tenantId]);

  useIsomorphicLayoutEffect(() => {
    if (!userfront) return;

    setLoading(false);
  }, [userfront]);

  return { ...userfront, isLoading };
}
