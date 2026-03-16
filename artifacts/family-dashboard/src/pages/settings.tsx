import React, { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Card, Input, Button } from "@/components/ui/core";
import { useUpdateMyProfile, useGetGeofences, useCreateGeofence, useDeleteGeofence } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { User, Shield, Map as MapIcon, Plus, Trash2, Copy, Check } from "lucide-react";
import { getInitials } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";

export default function SettingsPage() {
  const { user, family } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const currentProfile = family?.members.find((m) => m.user_id === user?.id)?.profile;

  const [fullName, setFullName] = useState(currentProfile?.full_name || "");
  const [phone, setPhone] = useState(currentProfile?.phone || "");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (currentProfile) {
      setFullName(currentProfile.full_name || "");
      setPhone(currentProfile.phone || "");
    }
  }, [currentProfile]);

  const { mutate: updateProfile, isPending } = useUpdateMyProfile();
  const { data: geofences } = useGetGeofences({ query: { enabled: !!family, queryKey: ["/api/geofences"] } } as any);
  const { mutate: createGeofence } = useCreateGeofence();
  const { mutate: deleteGeofence } = useDeleteGeofence();

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(
      { data: { full_name: fullName, phone } },
      {
        onSuccess: () => toast({ title: "Đã lưu", description: "Thông tin của bạn đã được cập nhật." }),
        onError: () => toast({ title: "Lỗi", description: "Không thể lưu thay đổi.", variant: "destructive" }),
      }
    );
  };

  const handleAddGeofence = () => {
    createGeofence(
      { data: { name: "Nhà", latitude: 21.0285, longitude: 105.8542, radius: 300 } },
      {
        onSuccess: () => {
          toast({ title: "Đã thêm vùng an toàn" });
          queryClient.invalidateQueries({ queryKey: ["/api/geofences"] });
        },
        onError: () => toast({ title: "Lỗi", description: "Không thể thêm vùng an toàn.", variant: "destructive" }),
      }
    );
  };

  const handleCopyCode = () => {
    const code = family?.family.invite_code;
    if (code) {
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto w-full p-4 md:p-8 space-y-8 pb-24 overflow-y-auto h-full">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-foreground">Cài đặt</h1>
          <p className="text-muted-foreground mt-1">Quản lý tài khoản và tuỳ chọn gia đình.</p>
        </div>

        {/* Profile Settings */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <User className="w-5 h-5 text-primary" /> Thông tin cá nhân
          </h2>
          <Card className="p-6">
            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div className="flex items-center gap-6 mb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  {getInitials(fullName || "U")}
                </div>
                <div>
                  <p className="font-semibold">{fullName || "Chưa đặt tên"}</p>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold ml-1">Họ và tên</label>
                  <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Nguyễn Văn A" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold ml-1">Số điện thoại</label>
                  <Input value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" placeholder="0901234567" />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-border/50">
                <Button type="submit" isLoading={isPending}>Lưu thay đổi</Button>
              </div>
            </form>
          </Card>
        </section>

        {/* Family Info */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Shield className="w-5 h-5 text-secondary" /> Nhóm gia đình
          </h2>
          <Card className="p-6">
            {family ? (
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                  <h3 className="font-bold text-lg">{family.family.name}</h3>
                  <p className="text-muted-foreground text-sm mt-1">
                    Chia sẻ mã mời để thêm thành viên:
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-muted px-6 py-3 rounded-xl border border-border font-mono text-xl tracking-widest font-bold text-primary">
                    {family.family.invite_code}
                  </div>
                  <Button variant="outline" size="icon" onClick={handleCopyCode}>
                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">Chưa tham gia nhóm gia đình nào.</p>
            )}
          </Card>
        </section>

        {/* Geofences */}
        {family && (
          <section className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <MapIcon className="w-5 h-5 text-green-500" /> Vùng an toàn
              </h2>
              <Button size="sm" onClick={handleAddGeofence} variant="outline" className="gap-2">
                <Plus className="w-4 h-4" /> Thêm địa điểm
              </Button>
            </div>
            <Card className="divide-y divide-border/50">
              {geofences && geofences.length > 0 ? (
                geofences.map((gf) => (
                  <div
                    key={gf.id}
                    className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
                  >
                    <div>
                      <h4 className="font-bold text-foreground">{gf.name}</h4>
                      <p className="text-xs text-muted-foreground">Bán kính: {gf.radius}m</p>
                    </div>
                    <Button
                      variant="ghost-muted"
                      size="icon"
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() =>
                        deleteGeofence(
                          { geofenceId: gf.id },
                          {
                            onSuccess: () => {
                              queryClient.invalidateQueries({ queryKey: ["/api/geofences"] });
                              toast({ title: "Đã xoá vùng an toàn" });
                            },
                          }
                        )
                      }
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  <p>Chưa có vùng an toàn nào.</p>
                  <p className="text-sm mt-1">
                    Nhận thông báo khi thành viên đến hoặc rời khỏi địa điểm an toàn.
                  </p>
                </div>
              )}
            </Card>
          </section>
        )}
      </div>
    </AppLayout>
  );
}
