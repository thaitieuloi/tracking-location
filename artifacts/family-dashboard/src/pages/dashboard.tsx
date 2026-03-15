import React from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { FamilyMap } from "@/components/map/FamilyMap";
import { SOSButton } from "@/components/SOSButton";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/core";
import { Battery, Navigation, Clock, UserCircle2, Users } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { getInitials, getMemberColor } from "@/lib/utils";
import { useLocation } from "wouter";

export default function DashboardPage() {
  const { family, familyLoading } = useAuth();
  const [, setLocation] = useLocation();

  if (familyLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
        </div>
      </AppLayout>
    );
  }

  if (!family) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center h-full gap-4">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Users className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-xl font-bold">Chưa có nhóm gia đình</h2>
          <p className="text-muted-foreground text-sm">Tạo hoặc tham gia nhóm để bắt đầu theo dõi.</p>
          <button
            onClick={() => setLocation("/setup")}
            className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Thiết lập gia đình
          </button>
        </div>
      </AppLayout>
    );
  }

  const members = family.members;

  return (
    <AppLayout>
      <div className="absolute inset-0 z-0">
        <FamilyMap members={members} />
      </div>

      {/* Floating Members Panel (Desktop) */}
      <div className="hidden lg:block absolute top-6 right-6 z-10 w-80 space-y-4">
        <div className="px-1 pb-1">
          <h2 className="font-display font-bold text-lg text-white drop-shadow">{family.family.name}</h2>
          <p className="text-sm text-white/80 drop-shadow">{members.length} thành viên</p>
        </div>
        {members.map((member, idx) => {
          const loc = member.location;
          const isOnline = loc && (Date.now() - new Date(loc.updated_at).getTime() < 5 * 60000);
          
          return (
            <Card key={member.user_id} className="p-4 bg-card/90 backdrop-blur-xl border-white/20 hover:scale-[1.02] transition-transform cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-inner"
                    style={{ backgroundColor: getMemberColor(idx) }}
                  >
                    {getInitials(member.profile.full_name || "U")}
                  </div>
                  <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-foreground truncate">{member.profile.full_name || "Thành viên"}</h3>
                  <div className="flex items-center text-xs text-muted-foreground mt-1 gap-2">
                    {loc ? (
                      <>
                        <span className="flex items-center gap-1">
                          <Battery className={`w-3 h-3 ${(loc.battery_level ?? 0) < 20 ? 'text-red-500' : 'text-green-500'}`} />
                          {loc.battery_level ?? '--'}%
                        </span>
                        <span className="flex items-center gap-1">
                          <Navigation className="w-3 h-3 text-primary" />
                          {Math.round(loc.speed || 0)} km/h
                        </span>
                      </>
                    ) : (
                      <span className="flex items-center gap-1"><UserCircle2 className="w-3 h-3" /> Không có vị trí</span>
                    )}
                  </div>
                </div>
              </div>
              {loc && (
                <div className="mt-3 pt-3 border-t border-border/50 text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {formatDistanceToNow(new Date(loc.updated_at), { addSuffix: true })}
                </div>
              )}
            </Card>
          );
        })}
      </div>

      <SOSButton />
    </AppLayout>
  );
}
