import React, { useState } from "react";
import { Card, Input, Button } from "@/components/ui/core";
import { Users, KeyRound, MapPin, LogOut } from "lucide-react";
import { useCreateFamily, useJoinFamily } from "@workspace/api-client-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";

export default function SetupPage() {
  const [activeTab, setActiveTab] = useState<"create" | "join">("create");
  const [familyName, setFamilyName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  
  const { mutate: createFamily, isPending: isCreating } = useCreateFamily();
  const { mutate: joinFamily, isPending: isJoining } = useJoinFamily();
  
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { logout } = useAuth();

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createFamily({ data: { name: familyName } }, {
      onSuccess: () => {
        toast({ title: "Gia đình đã tạo", description: "Bạn có thể mời thành viên ngay bây giờ." });
        queryClient.invalidateQueries();
        setLocation("/");
      },
      onError: (err: any) => {
        toast({ title: "Lỗi", description: err?.message || "Không thể tạo gia đình.", variant: "destructive" });
      }
    });
  };

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    joinFamily({ data: { invite_code: inviteCode } }, {
      onSuccess: () => {
        toast({ title: "Đã tham gia gia đình", description: "Chào mừng bạn vào nhóm!" });
        queryClient.invalidateQueries();
        setLocation("/");
      },
      onError: (err: any) => {
        toast({ title: "Mã không hợp lệ", description: err?.message || "Vui lòng kiểm tra mã mời.", variant: "destructive" });
      }
    });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-muted/30 p-4 relative overflow-hidden">
      <div className="absolute top-1/4 -left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-20 w-72 h-72 bg-secondary/20 rounded-full blur-3xl" />

      <button
        onClick={logout}
        className="absolute top-6 right-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <LogOut className="w-4 h-4" />
        Đăng xuất
      </button>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-xl mx-auto mb-4">
            <MapPin className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl font-display font-bold">Thiết lập gia đình</h1>
          <p className="text-muted-foreground mt-2">Tạo nhóm gia đình mới hoặc tham gia nhóm đã có.</p>
        </div>

        <Card className="p-2 bg-card/80 backdrop-blur-xl border-border/50">
          <div className="flex p-1 bg-muted rounded-xl mb-6">
            <button 
              className={`flex-1 py-3 text-sm font-semibold rounded-lg transition-all ${activeTab === 'create' ? 'bg-white dark:bg-card shadow text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              onClick={() => setActiveTab('create')}
            >
              Tạo gia đình
            </button>
            <button 
              className={`flex-1 py-3 text-sm font-semibold rounded-lg transition-all ${activeTab === 'join' ? 'bg-white dark:bg-card shadow text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              onClick={() => setActiveTab('join')}
            >
              Tham gia
            </button>
          </div>

          <div className="p-4">
            {activeTab === 'create' ? (
              <form onSubmit={handleCreate} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold ml-1">Tên gia đình</label>
                  <div className="relative">
                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <Input 
                      className="pl-12" 
                      placeholder="vd: Gia Đình Nguyễn" 
                      value={familyName}
                      onChange={e => setFamilyName(e.target.value)}
                      required 
                    />
                  </div>
                </div>
                <Button type="submit" size="lg" className="w-full" isLoading={isCreating}>Tạo nhóm</Button>
              </form>
            ) : (
              <form onSubmit={handleJoin} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold ml-1">Mã mời</label>
                  <div className="relative">
                    <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <Input 
                      className="pl-12 font-mono tracking-widest uppercase" 
                      placeholder="vd: X7K9M2" 
                      value={inviteCode}
                      onChange={e => setInviteCode(e.target.value.toUpperCase())}
                      required 
                    />
                  </div>
                </div>
                <Button type="submit" size="lg" className="w-full" isLoading={isJoining}>Tham gia nhóm</Button>
              </form>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
