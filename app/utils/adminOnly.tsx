"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, ComponentType } from "react";
import { toast } from "react-toastify";

type WithAuthProps = {
  [key: string]: unknown;
};

export function withAuth<P extends WithAuthProps>(
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

      if (
        session.user?.role !== "admin" &&
        session.user?.email !== "tengisteka0631@gmail.com"
      ) {
        toast.error("You are not authorized to access this page");
        router.push("/");
        return;
      }
    }, [session, status, router]);

    if (status === "loading" || !session) {
      return <div>Loading...</div>;
    }

    return <WrappedComponent {...props} />;
  };
}
