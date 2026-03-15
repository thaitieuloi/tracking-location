import React, { useState, useEffect, useRef } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useGetFamilyMessages, useSendMessage } from "@workspace/api-client-react";
import { useAuth } from "@/contexts/AuthContext";
import { Input, Button } from "@/components/ui/core";
import { Send, MapPin, Image as ImageIcon } from "lucide-react";
import { format } from "date-fns";
import { getInitials, getMemberColor, cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";

export default function ChatPage() {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const { data: messages = [], isLoading } = useGetFamilyMessages({ limit: 100 }, {
    query: { refetchInterval: 3000 }
  });
  
  const { mutate: sendMessage, isPending } = useSendMessage();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    sendMessage({ data: { content, message_type: "text" } }, {
      onSuccess: () => {
        setContent("");
        queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
      }
    });
  };

  const userId = user?.id ?? "";

  return (
    <AppLayout>
      <div className="flex flex-col h-full bg-muted/20">
        {/* Chat Header */}
        <div className="bg-card px-6 py-4 border-b border-border/50 shadow-sm z-10">
          <h2 className="text-xl font-display font-bold">Trò chuyện gia đình</h2>
          <p className="text-sm text-muted-foreground">Nhắn tin với các thành viên trong gia đình</p>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {isLoading && messages.length === 0 ? (
            <div className="flex justify-center items-center h-full text-muted-foreground">Đang tải tin nhắn...</div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-2">
              <MessageCircleIcon />
              <p>Chưa có tin nhắn nào. Hãy bắt đầu cuộc trò chuyện!</p>
            </div>
          ) : (
            [...messages].reverse().map((msg, idx, arr) => {
              const isMe = msg.user_id === userId;
              const showAvatar = idx === arr.length - 1 || arr[idx + 1].user_id !== msg.user_id;
              
              return (
                <div key={msg.id} className={cn("flex gap-3", isMe ? "justify-end" : "justify-start")}>
                  {!isMe && (
                    <div className="flex flex-col justify-end w-8">
                      {showAvatar && (
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm"
                          style={{ backgroundColor: getMemberColor(idx) }}
                        >
                          {getInitials(msg.profile?.full_name || "U")}
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className={cn("flex flex-col max-w-[75%]", isMe ? "items-end" : "items-start")}>
                    {!isMe && showAvatar && (
                      <span className="text-xs text-muted-foreground mb-1 ml-1 font-medium">{msg.profile?.full_name}</span>
                    )}
                    
                    <div className={cn(
                      "px-4 py-3 rounded-2xl shadow-sm relative group",
                      isMe 
                        ? "bg-primary text-primary-foreground rounded-br-sm" 
                        : "bg-card text-foreground border border-border/50 rounded-bl-sm"
                    )}>
                      <p className="text-sm md:text-base leading-relaxed break-words">{msg.content}</p>
                      
                      <span className={cn(
                        "text-[10px] mt-2 block",
                        isMe ? "text-primary-foreground/70 text-right" : "text-muted-foreground"
                      )}>
                        {format(new Date(msg.created_at), 'HH:mm')}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-card border-t border-border/50">
          <form onSubmit={handleSend} className="max-w-4xl mx-auto flex items-end gap-3">
            <div className="flex gap-2">
              <Button type="button" variant="ghost-muted" size="icon" className="text-muted-foreground hover:text-primary rounded-full shrink-0">
                <ImageIcon className="w-5 h-5" />
              </Button>
              <Button type="button" variant="ghost-muted" size="icon" className="text-muted-foreground hover:text-primary rounded-full shrink-0 hidden sm:flex">
                <MapPin className="w-5 h-5" />
              </Button>
            </div>
            
            <Input 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Nhập tin nhắn..." 
              className="rounded-full px-6 bg-muted border-none shadow-inner"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(e as any);
                }
              }}
            />
            
            <Button 
              type="submit" 
              size="icon" 
              className="rounded-full shrink-0 shadow-lg shadow-primary/25"
              disabled={isPending || !content.trim()}
            >
              <Send className="w-5 h-5" />
            </Button>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}

function MessageCircleIcon() {
  return (
    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-2">
      <Send className="w-8 h-8 text-primary" />
    </div>
  );
}
