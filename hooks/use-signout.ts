"use client";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function useSignout() {
  const router = useRouter();
  const handleSignOut = async function signOut() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/"); // redirect to login page
          toast.success("Logged out successfully");
        },
        onError: () => {
          toast.error("Something went wrong");
        },
      },
    });
  };
  return handleSignOut;
}
