"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, ComponentType } from "react";

type WithAuthProps = {
  [key: string]: unknown;
};

export function withLoggedIn<P extends WithAuthProps>(
  WrappedComponent: ComponentType<P>
): ComponentType<P> {
  return function AuthenticatedComponent(props: P) {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
      if (status === "loading") return;
      if (!session) {
        router.push(
          `/login?callbackUrl=${encodeURIComponent(window.location.href)}`
        );
        return;
      }
    }, [session, status, router]);

    if (status === "loading") {
      return <div>Loading...</div>;
    }

    return <WrappedComponent {...props} />;
  };
}
