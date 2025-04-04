"use client";
import { createContext, useContext, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  MoreVertical,
  ChevronLast,
  ChevronFirst,
  LayoutDashboard,
  ClipboardList,
  Contact,
  Info,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface SidebarContextType {
  expanded: boolean;
  setExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}

const SidebarContext = createContext<SidebarContextType | null>(null);
const Sidebar = ({ children }: { children: React.ReactNode }) => {
  const [expanded, setExpanded] = useState<boolean>(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  return (
    <aside
      className={`${
        expanded ? "max-w-[300px]" : "max-w-[100px]"
      } duration-150 h-screen fixed top-0 w-full left-0 bg-black border-r shadow-sm z-40`}
    >
      <nav className={`h-screen flex flex-col`}>
        <div className="p-4 pb-2 flex justify-between items-center">
          {/* <div className="relative w-6 h-6">
            <Image
              src="https://img.logoipsum.com/243.svg"
              fill={true}
              className={`overflow-hidden transition-all`}
              alt="logo"
            />
          </div> */}
          <button
            onClick={() => setExpanded((curr) => !curr)}
            className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-900 cursor-pointer duration-100"
          >
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </button>
        </div>
        <SidebarContext.Provider value={{ expanded, setExpanded }}>
          <ul className="flex-1 px-3">{children}</ul>
        </SidebarContext.Provider>

        <div
          className={`border-t flex items-center justify-between ${
            session && "p-3"
          }`}
        >
          {session ? (
            <>
              <div
                onClick={() => router.push("/profile?id=" + session.user?.id)}
                className="relative w-10 h-10 rounded-full overflow-hidden cursor-pointer"
              >
                <Image
                  priority={true}
                  src={session.user?.image || "/pfp.png"}
                  alt="pfp"
                  fill={true}
                  sizes="100%"
                />
              </div>
              <div
                className={`
              flex justify-between items-center transition-all overflow-hidden ${
                expanded ? "w-52 ml-3" : "w-0"
              }
          `}
              >
                <div className="leading-4">
                  <h4 className="font-semibold capitalize">
                    {session.user?.firstName}
                  </h4>
                  <span className="text-xs text-gray-600">
                    {session.user?.email}
                  </span>
                </div>
              </div>

              <div className="relative">
                <button onClick={() => setMoreOpen(!moreOpen)}>
                  <MoreVertical size={20} />
                </button>

                <AnimatePresence>
                  {moreOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                      className="absolute left-0 -top-16 bg-black border border-slate-950 shadow shadow-white/20 rounded-md *:px-4 *:py-2"
                    >
                      {/* logout button */}
                      <button
                        onClick={() => signOut()}
                        className="flex items-center gap-2 hover:bg-slate-900 duration-100 rounded-md"
                      >
                        <LogOut size={20} />
                        <span>Logout</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <Link
              onClick={() => setExpanded(false)}
              href="/login"
              className="flex justify-center text-center w-full font-bold rounded-lg p-3 hover:bg-slate-950 duration-100 items-center"
            >
              Login
            </Link>
          )}
        </div>
      </nav>
    </aside>
  );
};

interface SidebarItemProps {
  icon: React.ReactNode;
  text: string;
  active?: boolean;
  alert?: boolean;
  href: string;
  size?: number;
}

const SidebarItem = ({
  icon,
  size = 30,
  text,
  active,
  alert,
  href,
}: SidebarItemProps) => {
  const context = useContext(SidebarContext);

  if (!context) {
    throw new Error(
      "SidebarItem must be used within a SidebarContext.Provider"
    );
  }

  const { expanded, setExpanded } = context;

  return (
    <Link
      onClick={() => expanded && setExpanded(false)}
      href={href}
      className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer
        transition-colors group
        ${
          active
            ? "bg-gradient-to-tr from-indigo-900 to-indigo-100 text-indigo-800"
            : "hover:bg-indigo-950 text-gray-300"
        }
    `}
    >
      <div className={`w-[${size}px] h-[${size}px]`}>{icon}</div>
      <span
        className={`overflow-hidden text-nowrap transition-all ${
          expanded ? "w-full ml-3" : "w-0"
        }`}
      >
        {text}
      </span>
      {alert && (
        <div
          className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${
            expanded ? "" : "top-2"
          }`}
        />
      )}

      {!expanded && (
        <div
          className={`
          absolute left-full rounded-md px-2 py-1 ml-6
          bg-indigo-100 text-indigo-800 text-sm
          invisible opacity-20 -translate-x-3 transition-all
          group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
      `}
        >
          {text}
        </div>
      )}
    </Link>
  );
};

const Navigation = () => {
  return (
    <Sidebar>
      <SidebarItem href="/" icon={<LayoutDashboard size={30} />} text="Home" />
      <SidebarItem
        href="/blogs"
        icon={<ClipboardList size={30} />}
        text="Test"
      />
      <SidebarItem
        href="/blogs/write"
        icon={<Contact size={30} />}
        text="Contact"
      />
      <SidebarItem href="/" icon={<Info size={30} />} text="About Us" />
    </Sidebar>
  );
};

export default Navigation;
