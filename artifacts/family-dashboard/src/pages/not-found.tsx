import React from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/core";
import { MapPinOff } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <div className="text-center max-w-md p-8">
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
          <MapPinOff className="w-12 h-12 text-muted-foreground" />
        </div>
        <h1 className="text-4xl font-display font-bold text-foreground mb-4">Lost your way?</h1>
        <p className="text-lg text-muted-foreground mb-8">
          We can't seem to find the page you're looking for. It might have been moved or doesn't exist.
        </p>
        <Link href="/" className="inline-block">
          <Button size="lg">Return Home</Button>
        </Link>
      </div>
    </div>
  );
}
