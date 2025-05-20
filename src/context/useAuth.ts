"use client";
import { useContext } from "react";
import { AuthContext } from "./ClientProvider";

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within a ClientProvider");
  }
  return context;
}; 