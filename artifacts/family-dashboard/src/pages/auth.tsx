import React, { useState } from "react";
import { Card, Input, Button } from "@/components/ui/core";
import { MapPin, ArrowRight, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useLocation } from "wouter";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, setLocation] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setLocation("/");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
          },
        });
        if (error) throw error;
        setLocation("/setup");
      }
    } catch (err: any) {
      setError(err?.message || "Đã xảy ra lỗi. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-background">
      <div className="md:w-1/2 relative bg-primary/10 hidden md:flex items-center justify-center p-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 mix-blend-multiply" />
        <img 
          src={`${import.meta.env.BASE_URL}images/auth-bg.png`} 
          alt="Gia đình đoàn kết" 
          className="relative z-10 w-full max-w-lg object-contain drop-shadow-2xl"
        />
        <div className="absolute bottom-12 left-12 right-12 z-20">
          <h2 className="text-4xl font-display font-bold text-foreground mb-4">Luôn bên gia đình.</h2>
          <p className="text-xl text-muted-foreground">Chia sẻ vị trí thời gian thực, an tâm mỗi ngày.</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 md:p-12 relative">
        <div className="absolute top-8 left-8 flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
            <MapPin className="text-white w-6 h-6" />
          </div>
          <span className="font-display font-bold text-xl">FamilyTracker</span>
        </div>

        <Card className="w-full max-w-md p-8 pt-12">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-display font-bold mb-2">
              {isLogin ? "Chào mừng trở lại" : "Tạo tài khoản"}
            </h1>
            <p className="text-muted-foreground">
              {isLogin ? "Đăng nhập để xem bảng theo dõi gia đình." : "Đăng ký để bắt đầu theo dõi cùng gia đình."}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-destructive/10 rounded-lg flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-sm font-semibold ml-1">Họ và tên</label>
                <Input
                  placeholder="Nguyễn Văn A"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-semibold ml-1">Email</label>
              <Input
                type="email"
                placeholder="ban@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold ml-1">Mật khẩu</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" size="lg" className="w-full mt-6" isLoading={isLoading}>
              {isLogin ? "Đăng nhập" : "Đăng ký"}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </form>

          <div className="mt-8 text-center text-sm">
            <span className="text-muted-foreground">
              {isLogin ? "Chưa có tài khoản? " : "Đã có tài khoản? "}
            </span>
            <button onClick={() => { setIsLogin(!isLogin); setError(null); }} className="font-bold text-primary hover:underline">
              {isLogin ? "Đăng ký ngay" : "Đăng nhập"}
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
