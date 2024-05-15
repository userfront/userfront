import * as React from "react";
import { useIsomorphicLayoutEffect, useToggle } from "react-use";
import Userfront from "@userfront/toolkit/react";
import type { Simplify } from "type-fest";
import type * as _Userfront from "@userfront/core";

type UserfrontInstance = Required<typeof Userfront>;

interface UserfrontOptions {
  /**
   * Tenant ID from Userfront (**required**)
   */
  tenantId: string;
}

// Internal hook
export function useUserfront({ tenantId }: UserfrontOptions) {
  const [userfront, setUserfront] =
    React.useState<UserfrontInstance>(Userfront);
  const [isLoading, setLoading] = useToggle(true);
  const [isAuthenticated, setAuthenticated] = useToggle(false);

  // Initialize Userfront
  useIsomorphicLayoutEffect(() => {
    if (!tenantId) return;

    (async () => {
      await Userfront.init(tenantId);

      // Update the Userfront state
      setUserfront(Userfront);
      // Userfront is ready
      setLoading(false);
    })().catch(console.error);
  }, [tenantId]);

  // Update the authenticated state
  useIsomorphicLayoutEffect(() => {
    if (!userfront) return;

    if (userfront.user.email) {
      setAuthenticated(true);
    }
  }, [userfront]);

  return { ...userfront, isAuthenticated, isLoading };
}
