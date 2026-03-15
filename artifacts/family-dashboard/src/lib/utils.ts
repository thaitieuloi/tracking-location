import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInitials(name: string = "") {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase() || "?";
}

export function getMemberColor(index: number) {
  const colors = [
    "#FF6B6B", // Coral
    "#4ECDC4", // Teal
    "#FFD166", // Yellow
    "#6B5B95", // Purple
    "#88D498", // Green
    "#FF9F1C", // Orange
  ];
  return colors[index % colors.length];
}
