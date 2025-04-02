"use client";

import Image from "next/image";

// The Sidebar component has been modified to temporarily remove mobile and tablet navigations.
// Previous code for mobile and tablet navigation has been commented out for future reference.
export default function Sidebar() {
  return (
    <>
      {/* Desktop Sidebar - Only shows Termina logo */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-[220px] bg-gray-100 p-6">
        <div className="flex items-center space-x-2">
          <Image
            src="/Termina-logo.png"
            alt="Termina Logo"
            width={100}
            height={60}
            className="hidden md:block my-4"
          />
        </div>
      </aside>

      {/*
      // Previous Desktop Sidebar code with full navigation:

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

      // Previous Tablet Sidebar code:

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

      // Previous Mobile Bottom Navigation code:

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
      */}
    </>
  );
}
