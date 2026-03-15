import React from "react";
import { cn } from "@/lib/utils";

// --- BUTTON ---
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "outline" | "ghost" | "destructive" | "ghost-muted";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", isLoading, children, disabled, ...props }, ref) => {
    const variants = {
      default: "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 border border-transparent",
      secondary: "bg-secondary text-secondary-foreground shadow hover:bg-secondary/90 hover:-translate-y-0.5",
      outline: "border-2 border-border bg-transparent hover:bg-accent hover:text-accent-foreground hover:border-primary/50",
      ghost: "bg-transparent hover:bg-accent hover:text-accent-foreground",
      "ghost-muted": "bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground",
      destructive: "bg-destructive text-destructive-foreground shadow-lg shadow-destructive/20 hover:bg-destructive/90 hover:-translate-y-0.5",
    };
    
    const sizes = {
      sm: "h-9 px-4 text-sm rounded-lg",
      md: "h-11 px-6 py-2 rounded-xl font-medium",
      lg: "h-14 px-8 py-3 rounded-2xl text-lg font-semibold",
      icon: "h-11 w-11 flex items-center justify-center rounded-xl",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap transition-all duration-300 ease-out active:translate-y-0 active:scale-95 disabled:pointer-events-none disabled:opacity-50 disabled:transform-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <svg className="animate-spin -ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        ) : null}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

// --- INPUT ---
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "flex h-12 w-full rounded-xl border-2 bg-card px-4 py-2 text-sm font-medium transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-50",
          error ? "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/10" : "border-border hover:border-border/80",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

// --- CARD ---
export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("rounded-2xl border border-border/50 bg-card text-card-foreground shadow-lg shadow-black/5 overflow-hidden", className)}>
      {children}
    </div>
  );
}
