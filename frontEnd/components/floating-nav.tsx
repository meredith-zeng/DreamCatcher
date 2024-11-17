"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, PlusCircle, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const navItems = [
  {
    path: "/",
    name: "Home",
    icon: Home,
  },
  {
    path: "/create",
    name: "Create", 
    icon: PlusCircle,
    requiresAuth: true,
    isCreating: (pathname: string) =>
      pathname.startsWith("/create") ||
      pathname.startsWith("/mcq") ||
      pathname.startsWith("/view"),
  },
  {
    path: "/profile",
    name: "Profile",
    icon: User,
  },
];

export function FloatingNav() {
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const handleNavClick = (item: (typeof navItems)[0], e: React.MouseEvent) => {
    const isActive = item.isCreating 
      ? item.isCreating(pathname)
      : pathname === item.path;

    if (isActive) {
      e.preventDefault();
      return;
    }

    if (item.requiresAuth && !isAuthenticated) {
      e.preventDefault();
      //   showLoginDialog();
      setIsAuthenticated(true);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed inset-x-0 bottom-0 flex justify-center z-40 pb-safe-bottom"
    >
      <nav className="mb-8 flex items-center justify-center gap-1 w-fit px-4 py-2 rounded-full bg-background/80 shadow-lg backdrop-blur-md border">
        {navItems.map((item) => {
          const isActive = item.isCreating
            ? item.isCreating(pathname)
            : pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              onClick={(e) => handleNavClick(item, e)}
              className={cn(
                "relative flex items-center justify-center w-16 h-14 rounded-full transition-colors",
                isActive
                  ? "text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute inset-0 bg-primary rounded-full"
                  transition={{
                    type: "spring",
                    stiffness: 350,
                    damping: 30,
                  }}
                />
              )}
              <span className="relative">
                <item.icon className="w-5 h-5" />
              </span>
            </Link>
          );
        })}
      </nav>
    </motion.div>
  );
}
