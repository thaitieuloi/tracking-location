import React from "react";
import { Link, useLocation } from "wouter";
import { Map, MessageCircle, Settings, History, MapPin, Menu, X, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn, getInitials } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/core";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { user, family, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const userId = user?.id ?? "";
  const displayName = family?.members.find(m => m.user_id === userId)?.profile.full_name
    || user?.email?.split("@")[0]
    || "Người dùng";

  const navItems = [
    { href: "/", icon: Map, label: "Bản đồ" },
    { href: "/chat", icon: MessageCircle, label: "Nhắn tin" },
    { href: `/history/${userId}`, icon: History, label: "Lịch sử" },
    { href: "/settings", icon: Settings, label: "Cài đặt" },
  ];

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden relative">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-72 bg-card border-r border-border/50 shadow-xl shadow-black/5 z-20">
        <div className="p-6 flex items-center gap-3 border-b border-border/50">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-inner">
            <MapPin className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="font-display font-bold text-xl text-foreground leading-none">FamilyTracker</h1>
            <p className="text-xs text-muted-foreground font-medium">{family?.family.name || "Chưa có nhóm"}</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href} className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-200 group",
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}>
                <item.icon className={cn("w-5 h-5 transition-transform group-hover:scale-110", isActive && "fill-primary/20")} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border/50">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 mb-4">
            <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
              {getInitials(displayName)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-foreground truncate">{displayName}</p>
              <p className="text-xs text-muted-foreground truncate">Trực tuyến</p>
            </div>
          </div>
          <Button variant="ghost-muted" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10" onClick={logout}>
            <LogOut className="w-5 h-5 mr-3" />
            Đăng xuất
          </Button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-card/80 backdrop-blur-lg border-b border-border/50 flex items-center justify-between px-4 z-30">
        <div className="flex items-center gap-2">
          <MapPin className="text-primary w-6 h-6" />
          <h1 className="font-display font-bold text-lg">{family?.family.name || "FamilyTracker"}</h1>
        </div>
        <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 -mr-2 text-foreground">
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div 
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              className="md:hidden fixed top-0 right-0 bottom-0 w-64 bg-card border-l border-border shadow-2xl z-50 flex flex-col"
            >
              <div className="p-4 flex justify-end">
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-muted rounded-full text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 px-4 py-2 space-y-2">
                {navItems.map((item) => (
                  <Link key={item.href} href={item.href} onClick={() => setIsMobileMenuOpen(false)} className={cn(
                    "flex items-center gap-3 px-4 py-4 rounded-xl font-semibold transition-all duration-200",
                    location === item.href ? "bg-primary/10 text-primary" : "text-muted-foreground"
                  )}>
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                ))}
              </div>
              <div className="p-4 border-t border-border">
                <Button variant="ghost-muted" className="w-full justify-start text-destructive" onClick={logout}>
                  <LogOut className="w-5 h-5 mr-3" /> Đăng xuất
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative h-full w-full pt-16 md:pt-0">
        {children}
      </main>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border/50 pb-safe z-30">
        <div className="flex justify-around items-center p-2">
          {navItems.slice(0, 4).map((item) => {
            const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href} className={cn(
                "flex flex-col items-center justify-center w-16 h-12 rounded-xl transition-all duration-200",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}>
                <item.icon className={cn("w-6 h-6 mb-1", isActive && "fill-primary/20")} />
                <span className="text-[10px] font-semibold">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
