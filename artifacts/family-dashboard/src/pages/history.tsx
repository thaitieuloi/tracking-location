import React, { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useGetMemberLocationHistory, useGetFamilyMembers } from "@workspace/api-client-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRoute, useLocation } from "wouter";
import { Card, Button } from "@/components/ui/core";
import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { Clock, Navigation2, CalendarDays, History } from "lucide-react";
import { format } from "date-fns";

const dotIcon = L.divIcon({
  className: "bg-transparent",
  html: `<div class="w-3 h-3 rounded-full bg-blue-500 border-2 border-white shadow-md"></div>`,
  iconSize: [12, 12],
});

export default function HistoryPage() {
  const [, params] = useRoute("/history/:userId");
  const { family } = useAuth();
  const familyId = family?.family.id || "";
  const [, setLocation] = useLocation();

  const [hours, setHours] = useState(3);

  const { data: members } = useGetFamilyMembers(familyId, {
    query: { enabled: !!familyId, queryKey: ["/api/families", familyId, "members"] } as any,
  });
  const activeUserId = params?.userId || members?.[0]?.user_id || "";

  const { data: historyPoints, isLoading } = useGetMemberLocationHistory(
    activeUserId,
    { hours },
    { query: { enabled: !!activeUserId, queryKey: ["/api/locations", activeUserId, "history", hours] } as any }
  );

  const activeMember = members?.find((m) => m.user_id === activeUserId);

  const timeRanges = [
    { hours: 1, label: "1 giờ" },
    { hours: 3, label: "3 giờ" },
    { hours: 6, label: "6 giờ" },
    { hours: 24, label: "24 giờ" },
  ];

  return (
    <AppLayout>
      <div className="flex flex-col md:flex-row h-full">
        {/* Left Panel */}
        <div className="w-full md:w-80 bg-card border-r border-border/50 flex flex-col z-10 shadow-lg">
          <div className="p-6 border-b border-border/50">
            <h2 className="text-2xl font-display font-bold flex items-center gap-2">
              <History className="text-primary w-6 h-6" /> Lịch sử vị trí
            </h2>
            <p className="text-muted-foreground text-sm mt-1">Xem hành trình đã đi</p>
          </div>

          <div className="p-4 space-y-6 flex-1 overflow-y-auto">
            {/* Member Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Chọn thành viên
              </label>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {members?.map((m) => (
                  <button
                    key={m.user_id}
                    onClick={() => setLocation(`/history/${m.user_id}`)}
                    className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${
                      activeUserId === m.user_id
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-transparent bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {m.profile.full_name?.split(" ")[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Time Range */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Khoảng thời gian
              </label>
              <div className="grid grid-cols-2 gap-2">
                {timeRanges.map(({ hours: h, label }) => (
                  <Button
                    key={h}
                    variant={hours === h ? "default" : "outline"}
                    size="sm"
                    onClick={() => setHours(h)}
                  >
                    {label} qua
                  </Button>
                ))}
              </div>
            </div>

            {/* Timeline */}
            {isLoading ? (
              <div className="py-8 text-center text-muted-foreground animate-pulse">
                Đang tải lịch sử...
              </div>
            ) : historyPoints && historyPoints.length > 0 ? (
              <div className="space-y-4 pt-4 border-t border-border/50">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Tổng điểm:</span>
                  <span className="font-bold">{historyPoints.length}</span>
                </div>

                <div className="relative pl-4 border-l-2 border-muted space-y-6">
                  {historyPoints.slice(0, 10).map((pt) => (
                    <div key={pt.id} className="relative">
                      <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-primary ring-4 ring-card" />
                      <p className="text-sm font-semibold">
                        {format(new Date(pt.recorded_at), "HH:mm")}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <Navigation2 className="w-3 h-3" /> {Math.round(pt.speed || 0)} km/h
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-muted-foreground flex flex-col items-center">
                <CalendarDays className="w-12 h-12 mb-3 opacity-20" />
                <p>Không có dữ liệu vị trí<br />trong khoảng thời gian này.</p>
              </div>
            )}
          </div>
        </div>

        {/* Map Area */}
        <div className="flex-1 relative z-0 min-h-[50vh]">
          <MapContainer
            center={[21.0285, 105.8542]}
            zoom={13}
            className="w-full h-full"
            zoomControl={false}
          >
            <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />

            {historyPoints && historyPoints.length > 0 && (
              <>
                <Polyline
                  positions={historyPoints.map((p) => [p.latitude, p.longitude] as [number, number])}
                  pathOptions={{
                    color: "#6366f1",
                    weight: 4,
                    opacity: 0.8,
                    lineCap: "round",
                    lineJoin: "round",
                  }}
                />

                {historyPoints
                  .filter((_, i) => i % 5 === 0)
                  .map((p) => (
                    <Marker key={p.id} position={[p.latitude, p.longitude]} icon={dotIcon}>
                      <Popup>
                        <div className="text-sm">
                          <p className="font-bold">
                            {format(new Date(p.recorded_at), "dd/MM HH:mm")}
                          </p>
                          <p className="text-gray-500">{Math.round(p.speed || 0)} km/h</p>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
              </>
            )}
          </MapContainer>
        </div>
      </div>
    </AppLayout>
  );
}
