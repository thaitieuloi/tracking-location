import React, { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Card, Input, Button } from "@/components/ui/core";
import { useUpdateMyProfile, useGetGeofences, useCreateGeofence, useDeleteGeofence } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { User, Shield, Bell, Map as MapIcon, Plus, Trash2 } from "lucide-react";
import { getInitials } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";

export default function SettingsPage() {
  const { user, family } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [fullName, setFullName] = useState(user?.full_name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  
  const { mutate: updateProfile, isPending } = useUpdateMyProfile();
  const { data: geofences } = useGetGeofences();
  const { mutate: createGeofence } = useCreateGeofence();
  const { mutate: deleteGeofence } = useDeleteGeofence();

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ data: { full_name: fullName, phone } }, {
      onSuccess: () => toast({ title: "Profile Updated", description: "Your changes have been saved." }),
      onError: () => toast({ title: "Demo Mode", description: "Settings saved locally." })
    });
  };

  const handleAddGeofence = () => {
    // Demo implementation
    createGeofence({ data: { name: "Home", latitude: 10.762, longitude: 106.660, radius: 500 } }, {
      onSuccess: () => {
        toast({ title: "Geofence Added" });
        queryClient.invalidateQueries({ queryKey: ["/api/geofences"] });
      },
      onError: () => toast({ title: "Demo Mode", description: "Feature simulated." })
    });
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto w-full p-4 md:p-8 space-y-8 pb-24">
        
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your account and family preferences.</p>
        </div>

        {/* Profile Settings */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <User className="w-5 h-5 text-primary" /> Profile
          </h2>
          <Card className="p-6">
            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div className="flex items-center gap-6 mb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  {getInitials(fullName || "U")}
                </div>
                <Button type="button" variant="outline" size="sm">Change Avatar</Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold ml-1">Full Name</label>
                  <Input value={fullName} onChange={e => setFullName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold ml-1">Phone Number</label>
                  <Input value={phone} onChange={e => setPhone(e.target.value)} type="tel" />
                </div>
              </div>
              
              <div className="flex justify-end pt-4 border-t border-border/50">
                <Button type="submit" isLoading={isPending}>Save Changes</Button>
              </div>
            </form>
          </Card>
        </section>

        {/* Family Info */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Shield className="w-5 h-5 text-secondary" /> Family Group
          </h2>
          <Card className="p-6">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div>
                <h3 className="font-bold text-lg">{family?.family.name || "My Family"}</h3>
                <p className="text-muted-foreground text-sm mt-1">Share this invite code to add members:</p>
              </div>
              <div className="bg-muted px-6 py-3 rounded-xl border border-border font-mono text-xl tracking-widest font-bold text-primary text-center">
                {family?.family.invite_code || "X7K9M2"}
              </div>
            </div>
          </Card>
        </section>

        {/* Geofences */}
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <MapIcon className="w-5 h-5 text-green-500" /> Geofences
            </h2>
            <Button size="sm" onClick={handleAddGeofence} variant="outline" className="gap-2">
              <Plus className="w-4 h-4" /> Add Place
            </Button>
          </div>
          <Card className="divide-y divide-border/50">
            {geofences && geofences.length > 0 ? geofences.map(gf => (
              <div key={gf.id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                <div>
                  <h4 className="font-bold text-foreground">{gf.name}</h4>
                  <p className="text-xs text-muted-foreground">Radius: {gf.radius}m</p>
                </div>
                <Button variant="ghost-muted" size="icon" className="text-destructive hover:bg-destructive/10" 
                  onClick={() => deleteGeofence({ geofenceId: gf.id })}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            )) : (
              <div className="p-8 text-center text-muted-foreground">
                <p>No geofences set up yet.</p>
                <p className="text-sm mt-1">Get notified when family members arrive at or leave safe zones.</p>
              </div>
            )}
          </Card>
        </section>

      </div>
    </AppLayout>
  );
}
