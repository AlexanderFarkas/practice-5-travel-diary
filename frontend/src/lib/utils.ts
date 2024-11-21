import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import React from "react";
import {ApiError} from "@/api.ts";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function useVm<T>(storeContext: React.Context<T | null>) {
  const store = React.useContext(storeContext);
  if (!store) {
    // this is especially useful in TypeScript so you don't need to be checking for null all the time
    throw new Error("useVM must be used within a VMProvider.");
  }
  return store;
}



export const clamp = (value: number, min: number, max: number) => {
  return Math.max(min, Math.min(max, value));
};

export const alertOnError = async <T>(cb: () => Promise<T>) => {
  try {
    return await cb();
  } catch (e) {
    if (e instanceof ApiError) {
      alert(e.message);
    } else {
      alert("Произошла ошибка");
    }
    throw e;
  }
};

