"use client";

import Image from "next/image";
import {
  ArrowLeftRight,
  Target,
  List,
  Settings,
  Home,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  // Get current pathname to determine active route
  const pathname = usePathname();

  // Navigation links data
  const navLinks = [
    { imgURL: "/HomeSwap.svg", route: "/", id: 2, name: "Home" },
    { imgURL: "/SwapSwap.svg", route: "/swap", id: 3, name: "Swap" },
    { imgURL: "/DiamondSwap.svg", route: "/spot", id: 4, name: "Spot" },
    { imgURL: "/WatchSwap.svg", route: "/watchlist", id: 5, name: "Watchlist" },
    // { imgURL: "/UserFrame.svg", route: "/", id: 6, name: "Settings" },
  ];

  // Map icons to names for fallback when imgURL is empty
  const iconMap = (name, isActive) => {
    const iconColor = isActive ? "text-blue-500" : "text-gray-800";

    switch (name) {
      case "Home":
        return <Home className={`w-5 h-5 lg:w-6 lg:h-6 ${iconColor}`} />;
      case "Swap":
        return (
          <ArrowLeftRight className={`w-5 h-5 lg:w-6 lg:h-6 ${iconColor}`} />
        );
      case "Spot":
        return <Target className={`w-5 h-5 lg:w-6 lg:h-6 ${iconColor}`} />;
      case "Watchlist":
        return <List className={`w-5 h-5 lg:w-6 lg:h-6 ${iconColor}`} />;
      case "Settings":
        return <Settings className={`w-5 h-5 lg:w-6 lg:h-6 ${iconColor}`} />;
      default:
        return null;
    }
  };

  // Check if the link is active
  const isLinkActive = (route) => {
    return pathname === route;
  };

  return (
    <>
      {/* Desktop Sidebar - Hidden on mobile, shown on lg breakpoint and up */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-[220px] bg-gray-100 p-6 space-y-8">
        <div className="flex items-center space-x-2">
          <Image
            src="/Termina-logo.png"
            alt="Home"
            width={100}
            height={60}
            className="hidden md:block my-4"
          />
        </div>

        <nav className="space-y-8">
          {navLinks.map((link) => {
            const active = isLinkActive(link.route);
            return (
              <Link
                key={link.id}
                href={link.route}
                className={`flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-200 ${
                  active ? "text-blue-500" : "text-gray-800"
                }`}
              >
                {link.imgURL ? (
                  <div className={active ? "text-blue-500" : ""}>
                    <Image
                      src={link.imgURL}
                      alt={link.name}
                      width={28}
                      height={28}
                      className={active ? "filter-blue-500" : ""}
                    />
                  </div>
                ) : (
                  iconMap(link.name, active)
                )}
                <span className="text-[20px] font-medium">{link.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Tablet Sidebar - Hidden on mobile and desktop, shown on md breakpoint */}
      <aside className="hidden md:lg:hidden md:flex flex-col fixed left-0 top-0 bottom-0 w-[80px] bg-gray-100 p-4 items-center">
        <div className="flex flex-col items-center space-y-1 mb-8">
          <Image
            src="/Terminapng.png"
            alt="Home"
            width={60}
            height={60}
            className=""
          />
        </div>

        <nav className="flex flex-col items-center space-y-6">
          {navLinks.map((link) => {
            const active = isLinkActive(link.route);
            return (
              <Link
                key={link.id}
                href={link.route}
                className={`p-2 rounded-lg hover:bg-gray-200 ${
                  active ? "text-blue-500" : "text-gray-800"
                }`}
              >
                {link.imgURL ? (
                  <div className={active ? "text-blue-500" : ""}>
                    <Image
                      src={link.imgURL}
                      alt={link.name}
                      width={28}
                      height={28}
                      className={active ? "filter-blue-500" : ""}
                    />
                  </div>
                ) : (
                  iconMap(link.name, active)
                )}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Bottom Navigation - Only visible on mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around items-center p-2">
        {navLinks.slice(0, 4).map((link) => {
          const active = isLinkActive(link.route);
          return (
            <Link
              key={link.id}
              href={link.route}
              className={`p-2 flex flex-col items-center ${
                active ? "text-blue-500" : "text-gray-500"
              }`}
            >
              {link.imgURL ? (
                <div className={active ? "text-blue-500" : ""}>
                  <Image
                    src={link.imgURL}
                    alt={link.name}
                    width={24}
                    height={24}
                    className={active ? "filter-blue-500" : ""}
                  />
                </div>
              ) : (
                iconMap(link.name, active)
              )}
            </Link>
          );
        })}
      </nav>

      {/* Add this style to color SVG images blue when active */}
      <style jsx global>{`
        .filter-blue-500 {
          filter: brightness(0) saturate(100%) invert(59%) sepia(15%)
            saturate(1974%) hue-rotate(168deg) brightness(90%) contrast(95%);
          filter: brightness(0) saturate(100%) invert(33%) sepia(100%)
            saturate(1967%) hue-rotate(189deg) brightness(99%) contrast(91%);
        }
      `}</style>
    </>
  );
}
