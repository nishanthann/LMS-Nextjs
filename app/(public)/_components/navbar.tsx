"use client";
import Image from "next/image";
import Link from "next/link";
import Logo from "@/public/nlogowhite.png";
import { buttonVariants } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/theme-toggle";
import { authClient } from "@/lib/auth-client";
import Component from "./UserButton";
// import { useRouter } from "next/navigation";
// import { toast } from "sonner";

export default function Navbar() {
  // const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  // async function signOut() {
  //   await authClient.signOut({
  //     fetchOptions: {
  //       onSuccess: () => {
  //         router.push("/"); // redirect to login page
  //         toast.success("Logged out successfully");
  //       },
  //       onError: () => {
  //         toast.error("Something went wrong");
  //       },
  //     },
  //   });
  // }
  const menuItems = [
    { title: "Home", href: "/" },
    { title: "About", href: "/about" },
    { title: "Services", href: "/services" },
    { title: "Contact", href: "/contact" },
  ];

  return (
    <nav className="fixed top-0 z-50 w-full border-b bg-background/95  backdrop-blur-[backderop-filter]:bg-background/60">
      <div className="container mx-auto flex items-center justify-between py-3 px-4">
        {/* Left - Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image src={Logo} alt="Logo" width={32} height={32} />
          <span className="text-lg font-semibold">MyWebsite</span>
        </Link>

        {/* Center - Menu */}
        <div className="hidden md:flex items-center gap-6">
          {menuItems.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="text-sm font-medium  hover:text-black transition"
            >
              {item.title}
            </Link>
          ))}
        </div>

        {/* Right - Login Button */}
        <div className="flex items-center gap-4">
          <ModeToggle />
          {isPending ? null : session ? (
            <Component
              email={session.user.email}
              name={session.user.name}
              image={session.user.image || ""}
            />
          ) : (
            <Link
              href="/login"
              className={buttonVariants({ variant: "outline" })}
            >
              Login
            </Link>
          )}
          {/* <Link
            href="/login"
            className={buttonVariants({ variant: "outline", size: "lg" })}
          >
            Login
          </Link> */}
        </div>
      </div>
    </nav>
  );
}
