"use client";
import { useState, useEffect } from "react";
import { Shield, ShieldOff } from "lucide-react";

interface PrivacyToggleProps {
  onToggle?: (isPrivate: boolean) => void;
  defaultPrivate?: boolean;
}

export default function PrivacyToggle({
  onToggle,
  defaultPrivate = false,
}: PrivacyToggleProps) {
  const [isPrivate, setIsPrivate] = useState(defaultPrivate);

  useEffect(() => {
    // Load privacy preference from localStorage
    const stored = localStorage.getItem("bsd-privacy-mode");
    if (stored !== null) {
      const value = stored === "true";
      setIsPrivate(value);
    }
  }, []);

  const toggle = () => {
    const newValue = !isPrivate;
    setIsPrivate(newValue);
    localStorage.setItem("bsd-privacy-mode", String(newValue));
    onToggle?.(newValue);
  };

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 border border-zinc-700 hover:border-green-500 transition-all"
      aria-label={isPrivate ? "Disable ZK Private Mode" : "Enable ZK Private Mode"}
    >
      {isPrivate ? (
        <>
          <Shield className="w-4 h-4 text-green-400" />
          <span className="text-green-400 text-sm font-medium">
            ZK Private Mode
          </span>
        </>
      ) : (
        <>
          <ShieldOff className="w-4 h-4 text-zinc-400" />
          <span className="text-zinc-400 text-sm font-medium">
            Public Mode
          </span>
        </>
      )}
    </button>
  );
}
