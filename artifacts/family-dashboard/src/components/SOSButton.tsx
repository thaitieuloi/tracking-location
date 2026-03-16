import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";
import { useSendSOS } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

export function SOSButton() {
  const [isCounting, setIsCounting] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const { mutate: sendSOS, isPending } = useSendSOS();
  const { toast } = useToast();

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (isCounting && countdown > 0) {
      timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    } else if (isCounting && countdown === 0) {
      triggerSOS();
    }
    return () => clearTimeout(timer);
  }, [isCounting, countdown]);

  const triggerSOS = () => {
    setIsCounting(false);
    setCountdown(5);

    const doSend = (lat?: number, lng?: number) => {
      sendSOS(
        {
          data: {
            latitude: lat,
            longitude: lng,
            message: "Tôi cần giúp đỡ ngay lập tức!",
          },
        },
        {
          onSuccess: () => {
            toast({
              title: "🚨 Đã gửi tín hiệu SOS",
              description: "Gia đình của bạn đã được thông báo.",
              variant: "destructive",
            });
          },
          onError: () => {
            toast({
              title: "Lỗi gửi SOS",
              description: "Không thể gửi tín hiệu. Vui lòng thử lại.",
              variant: "destructive",
            });
          },
        }
      );
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => doSend(pos.coords.latitude, pos.coords.longitude),
        () => doSend()
      );
    } else {
      doSend();
    }
  };

  const startSOS = () => {
    setIsCounting(true);
    setCountdown(5);
  };

  const cancelSOS = () => {
    setIsCounting(false);
    setCountdown(5);
  };

  return (
    <div className="fixed bottom-24 md:bottom-8 right-4 md:right-8 z-40">
      <AnimatePresence>
        {isCounting ? (
          <motion.div
            key="counting"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="relative flex items-center justify-center w-24 h-24">
              <motion.div
                className="absolute inset-0 rounded-full border-4 border-destructive"
                animate={{ scale: [1, 1.3, 1], opacity: [1, 0.4, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              <div className="absolute inset-0 rounded-full bg-destructive/20 animate-ping" />
              <div className="w-20 h-20 bg-destructive rounded-full flex items-center justify-center text-white font-display font-bold text-4xl shadow-2xl">
                {countdown}
              </div>
            </div>
            <button
              onClick={cancelSOS}
              className="bg-card text-foreground px-6 py-2 rounded-full font-bold shadow-lg border border-border flex items-center gap-2 hover:bg-muted transition-colors"
            >
              <X className="w-4 h-4" /> Huỷ
            </button>
          </motion.div>
        ) : (
          <motion.button
            key="sos"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startSOS}
            disabled={isPending}
            className="w-16 h-16 bg-destructive text-white rounded-full flex items-center justify-center shadow-xl shadow-destructive/40 hover:shadow-2xl hover:shadow-destructive/50 transition-all border-4 border-white dark:border-background"
            title="Gửi tín hiệu SOS khẩn cấp"
          >
            <AlertTriangle className="w-8 h-8" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
