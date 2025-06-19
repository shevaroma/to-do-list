import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const themes: { [key: string]: string } = {
  system: "System",
  light: "Light",
  dark: "Dark",
};
