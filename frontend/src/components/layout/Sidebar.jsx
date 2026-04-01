import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, PenLine, Trophy, ScrollText, User, Swords, Backpack } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { path: "/", icon: LayoutDashboard, label: "Штаб" },
  { path: "/log", icon: PenLine, label: "Запис" },
  { path: "/quests", icon: Swords, label: "Квести" },
  { path: "/achievements", icon: Trophy, label: "Досягнення" },
  { path: "/journal", icon: ScrollText, label: "Журнал" },
  { path: "/inventory", icon: Backpack, label: "Інвентар" },
  { path: "/profile", icon: User, label: "Профіль" },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-64 flex-col bg-sidebar border-r border-sidebar-border z-40">
        <div className="p-6">
          <Link to="/" className="flex items-center gap-3">
            <Swords className="w-8 h-8 text-primary" />
            <div>
              <h1 className="font-pixel text-xs text-primary tracking-wider">WEIGHT</h1>
              <h1 className="font-pixel text-xs text-accent tracking-wider">QUEST</h1>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {NAV_ITEMS.map(({ path, icon: Icon, label }) => {
            const active = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium",
                  active
                    ? "bg-primary/15 text-primary glow-purple"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 mx-3 mb-4 rounded-lg bg-secondary/50 border border-border">
          <p className="font-pixel text-accent text-[8px] leading-relaxed">⚔️ Кожен день — нова битва</p>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-sidebar border-t border-sidebar-border z-40 flex justify-around py-2 px-1 safe-area-pb">
        {NAV_ITEMS.map(({ path, icon: Icon, label }) => {
          const active = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg transition-all text-[10px]",
                active
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}