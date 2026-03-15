import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { getInitials, getMemberColor } from "@/lib/utils";
import type { MemberWithLocation } from "@workspace/api-client-react/src/generated/api.schemas";
import { Battery, Zap, Navigation } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const createAvatarIcon = (color: string, name: string, isMoving: boolean) => {
  const initials = getInitials(name);
  const pulseHtml = isMoving ? `<div class="absolute inset-0 rounded-full bg-[${color}] animate-ping opacity-50 scale-150"></div>` : '';
  
  return L.divIcon({
    className: 'bg-transparent border-none',
    html: `
      <div class="relative flex flex-col items-center -mt-10">
        ${pulseHtml}
        <div style="background-color: ${color};" class="relative z-10 w-12 h-12 rounded-full border-4 border-white shadow-xl flex items-center justify-center text-white font-display font-bold text-lg">
          ${initials}
        </div>
        <div class="w-3 h-3 bg-white rotate-45 -mt-2 shadow-sm relative z-0"></div>
      </div>
    `,
    iconSize: [48, 48],
    iconAnchor: [24, 48],
    popupAnchor: [0, -40]
  });
};

function MapBoundsUpdater({ members }: { members: MemberWithLocation[] }) {
  const map = useMap();
  useEffect(() => {
    const locations = members.map(m => m.location).filter(Boolean);
    if (locations.length > 0) {
      const bounds = L.latLngBounds(locations.map(l => [l!.latitude, l!.longitude]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
    }
  }, [members, map]);
  return null;
}

export function FamilyMap({ members }: { members: MemberWithLocation[] }) {
  const defaultCenter: [number, number] = [10.762622, 106.660172]; // HCMC default
  
  return (
    <div className="w-full h-full relative z-0">
      <MapContainer 
        center={defaultCenter} 
        zoom={13} 
        className="w-full h-full"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        <MapBoundsUpdater members={members} />
        
        {members.map((member, idx) => {
          if (!member.location) return null;
          const color = getMemberColor(idx);
          const isMoving = member.location.is_moving || (member.location.speed && member.location.speed > 3) || false;
          
          return (
            <Marker 
              key={member.user_id}
              position={[member.location.latitude, member.location.longitude]}
              icon={createAvatarIcon(color, member.profile.full_name || "User", isMoving)}
            >
              <Popup className="min-w-[200px]">
                <div className="p-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div style={{ backgroundColor: color }} className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold">
                      {getInitials(member.profile.full_name || "")}
                    </div>
                    <div>
                      <h3 className="font-bold text-base m-0 leading-tight">{member.profile.full_name}</h3>
                      <p className="text-xs text-muted-foreground m-0">
                        {formatDistanceToNow(new Date(member.location.updated_at), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-1.5 bg-muted/50 p-2 rounded-lg">
                      <Battery className="w-4 h-4 text-green-500" />
                      <span className="font-medium">{member.location.battery_level || '--'}%</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-muted/50 p-2 rounded-lg">
                      <Navigation className="w-4 h-4 text-primary" />
                      <span className="font-medium">{Math.round(member.location.speed || 0)} km/h</span>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
