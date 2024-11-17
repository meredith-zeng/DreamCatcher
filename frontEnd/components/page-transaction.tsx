"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";


const getPageTitle = (path: string) => {
  if (path === "/") return "Home";
  if (path.startsWith("/create")) return "🧙‍♀️ Let's create your dream together!";
  if (path.startsWith("/profile")) return "👤 Profile";
  return "";
};

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsTransitioning(true);

    
    const transitionTimer = setTimeout(() => setIsTransitioning(false), 1000);
    
    return () => {
      clearTimeout(transitionTimer);
    };
  }, [pathname]);

  const pageTitle = getPageTitle(pathname);

  return (
    <div ref={containerRef} className="relative min-h-screen">
      <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial="initial"
            animate="animate"
            exit="exit"
            className="relative"
          >
            <motion.div
              className="fixed inset-0 bg-background z-40"
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: isTransitioning ? 1 : 0,
                transitionEnd: {
                  display: isTransitioning ? "block" : "none"
                }
              }}
              transition={{ duration: 0.3 }}
            />
            {!isTransitioning && children}
            <motion.div
              className="fixed inset-0 z-50 pointer-events-none"
              initial={false}
              animate={isTransitioning ? "animate" : "exit"}
              variants={{
                animate: {
                  clipPath: 'inset(0% 0% 0% 0%)',
                  transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] },
                },
                exit: {
                  clipPath: 'inset(100% 0% 0% 0%)',
                  transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] },
                },
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/100" />
              <motion.div 
                className="absolute inset-0 flex items-center justify-center px-4 sm:px-6 md:px-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: isTransitioning ? 1 : 0, 
                  y: isTransitioning ? 0 : 20,
                  transition: { duration: 0.3, delay: 0.2 }
                }}
              >
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white text-center max-w-3xl break-words">
                  {pageTitle}
                </h1>
              </motion.div>
            </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
