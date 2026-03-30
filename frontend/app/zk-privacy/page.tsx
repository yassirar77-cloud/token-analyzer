"use client";
import { useState, useEffect, useCallback } from "react";
import {
  Shield,
  ShieldCheck,
  Download,
  Upload,
  Key,
  Radio,
  Wallet,
  AlertTriangle,
  Copy,
  Check,
} from "lucide-react";
import PrivacyToggle from "../../components/PrivacyToggle";
import { api } from "../../lib/api";

interface IdentityStatus {
  exists: boolean;
  commitment?: string;
  backedUp: boolean;
}

interface AnonymousSessionInfo {
  sessionToken: string;
  expiresAt: string;
  valid: boolean;
}

export default function ZKPrivacyPage() {
  const [identityStatus, setIdentityStatus] = useState<IdentityStatus>({
    exists: false,
    backedUp: false,
  });
  const [activeSession, setActiveSession] = useState<AnonymousSessionInfo | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [exportData, setExportData] = useState<string | null>(null);
  const [isPrivateMode, setIsPrivateMode] = useState(false);

  // Check for existing ZK identity on mount
  useEffect(() => {
    const stored = localStorage.getItem("bsd-zk-identity");
    const backedUp = localStorage.getItem("bsd-zk-identity-backed-up") === "true";
    if (stored) {
      setIdentityStatus({
        exists: true,
        commitment: stored.slice(0, 20) + "...",
        backedUp,
      });
    }

    const privacyMode = localStorage.getItem("bsd-privacy-mode");
    if (privacyMode === "true") {
      setIsPrivateMode(true);
    }

    // Check for active anonymous session
    const sessionToken = localStorage.getItem("bsd-anonymous-session");
    if (sessionToken) {
      validateSession(sessionToken);
    }
  }, []);

  const validateSession = async (sessionToken: string) => {
    try {
      const response = await api.get("/stream/session/validate", {
        headers: { "x-session-token": sessionToken },
      });
      if (response.data.valid) {
        setActiveSession({
          sessionToken: sessionToken.slice(0, 16) + "...",
          expiresAt: response.data.expiresAt,
          valid: true,
        });
      }
    } catch {
      localStorage.removeItem("bsd-anonymous-session");
      setActiveSession(null);
    }
  };

  const generateIdentity = useCallback(async () => {
    setIsGenerating(true);
    try {
      // Dynamic import for browser compatibility
      const { Identity } = await import("@semaphore-protocol/core");
      const identity = new Identity();
      const exported = identity.export();
      localStorage.setItem("bsd-zk-identity", exported);
      setIdentityStatus({
        exists: true,
        commitment: exported.slice(0, 20) + "...",
        backedUp: false,
      });
    } catch (error) {
      console.error("Failed to generate identity:", error);
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const exportIdentity = useCallback(() => {
    const stored = localStorage.getItem("bsd-zk-identity");
    if (stored) {
      setExportData(stored);
    }
  }, []);

  const copyExport = useCallback(async () => {
    if (exportData) {
      await navigator.clipboard.writeText(exportData);
      setCopied(true);
      localStorage.setItem("bsd-zk-identity-backed-up", "true");
      setIdentityStatus((prev) => ({ ...prev, backedUp: true }));
      setTimeout(() => setCopied(false), 2000);
    }
  }, [exportData]);

  const importIdentity = useCallback(() => {
    const input = prompt("Paste your ZK identity export string:");
    if (input && input.trim()) {
      localStorage.setItem("bsd-zk-identity", input.trim());
      setIdentityStatus({
        exists: true,
        commitment: input.trim().slice(0, 20) + "...",
        backedUp: true,
      });
    }
  }, []);

  const handlePrivacyToggle = (isPrivate: boolean) => {
    setIsPrivateMode(isPrivate);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Shield className="w-8 h-8 text-green-400" />
              ZK Privacy Dashboard
            </h1>
            <p className="text-zinc-400 mt-2">
              Manage your anonymous identity, private streaming, and private
              transactions
            </p>
          </div>
          <PrivacyToggle onToggle={handlePrivacyToggle} />
        </div>

        {/* Privacy Mode Status */}
        <div
          className={`mb-8 p-4 rounded-xl border ${
            isPrivateMode
              ? "bg-green-950/30 border-green-800"
              : "bg-zinc-900 border-zinc-700"
          }`}
        >
          <div className="flex items-center gap-3">
            {isPrivateMode ? (
              <ShieldCheck className="w-6 h-6 text-green-400" />
            ) : (
              <AlertTriangle className="w-6 h-6 text-yellow-400" />
            )}
            <div>
              <p className="font-medium">
                {isPrivateMode
                  ? "ZK Private Mode Active"
                  : "Public Mode — Your activity is visible"}
              </p>
              <p className="text-sm text-zinc-400">
                {isPrivateMode
                  ? "Streaming and transactions use zero-knowledge proofs. Your identity is hidden."
                  : "Enable private mode to use ZK proofs for anonymous streaming and transactions."}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ZK Identity Card */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Key className="w-5 h-5 text-purple-400" />
              <h2 className="text-lg font-semibold">ZK Identity</h2>
            </div>

            {identityStatus.exists ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                  <span className="text-sm text-green-400">
                    Identity Generated
                  </span>
                </div>
                <p className="text-xs text-zinc-500 font-mono">
                  {identityStatus.commitment}
                </p>

                {!identityStatus.backedUp && (
                  <div className="flex items-center gap-2 p-2 bg-yellow-950/30 border border-yellow-800 rounded-lg">
                    <AlertTriangle className="w-4 h-4 text-yellow-400 shrink-0" />
                    <p className="text-xs text-yellow-400">
                      Not backed up! Export your identity to avoid losing access.
                    </p>
                  </div>
                )}

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={exportIdentity}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Export
                  </button>
                  <button
                    onClick={importIdentity}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Import
                  </button>
                </div>

                {exportData && (
                  <div className="mt-3 p-3 bg-zinc-800 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-zinc-400">
                        Identity Export (keep this safe!)
                      </span>
                      <button
                        onClick={copyExport}
                        className="flex items-center gap-1 text-xs text-green-400 hover:text-green-300"
                      >
                        {copied ? (
                          <Check className="w-3 h-3" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                        {copied ? "Copied!" : "Copy"}
                      </button>
                    </div>
                    <p className="text-xs text-zinc-500 font-mono break-all">
                      {exportData}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-zinc-400">
                  Generate a ZK identity to prove BSD membership anonymously.
                  This identity is stored locally — never shared with servers.
                </p>
                <button
                  onClick={generateIdentity}
                  disabled={isGenerating}
                  className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:bg-zinc-700 rounded-lg text-sm font-medium transition-colors"
                >
                  {isGenerating ? "Generating..." : "Generate ZK Identity"}
                </button>
              </div>
            )}
          </div>

          {/* Anonymous Streaming Card */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Radio className="w-5 h-5 text-blue-400" />
              <h2 className="text-lg font-semibold">Anonymous Streaming</h2>
            </div>

            {activeSession ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-sm text-green-400">
                    Active Session
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-zinc-500">
                    Token: {activeSession.sessionToken}
                  </p>
                  <p className="text-xs text-zinc-500">
                    Expires:{" "}
                    {new Date(activeSession.expiresAt).toLocaleString()}
                  </p>
                </div>
                <p className="text-sm text-zinc-400">
                  You are streaming anonymously. The server cannot see your
                  identity or what you listen to.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-zinc-500" />
                  <span className="text-sm text-zinc-400">No Active Session</span>
                </div>
                <p className="text-sm text-zinc-400">
                  When private mode is enabled, streaming creates an anonymous
                  session using a ZK proof. The backend never knows who is
                  listening.
                </p>
              </div>
            )}
          </div>

          {/* Private Transactions Card */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Wallet className="w-5 h-5 text-orange-400" />
              <h2 className="text-lg font-semibold">Private Transactions</h2>
            </div>
            <div className="space-y-3">
              <p className="text-sm text-zinc-400">
                Deposit $BSD tokens into the private pool and withdraw from any
                wallet. ZK proofs break the on-chain link between deposit and
                withdrawal.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-zinc-800 rounded-lg">
                  <p className="text-xs text-zinc-500 mb-1">Supported Amounts</p>
                  <div className="flex flex-wrap gap-1">
                    {["10", "100", "1K", "10K"].map((amt) => (
                      <span
                        key={amt}
                        className="px-2 py-0.5 bg-zinc-700 rounded text-xs text-zinc-300"
                      >
                        {amt} BSD
                      </span>
                    ))}
                  </div>
                </div>
                <div className="p-3 bg-zinc-800 rounded-lg">
                  <p className="text-xs text-zinc-500 mb-1">Gas Cost</p>
                  <p className="text-sm text-zinc-300">~$0.01-0.05</p>
                  <p className="text-xs text-zinc-500">on Base L2</p>
                </div>
              </div>
            </div>
          </div>

          {/* How It Works Card */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <ShieldCheck className="w-5 h-5 text-green-400" />
              <h2 className="text-lg font-semibold">How ZK Privacy Works</h2>
            </div>
            <div className="space-y-3 text-sm text-zinc-400">
              <div className="flex gap-3">
                <span className="text-green-400 font-mono text-xs mt-0.5">
                  01
                </span>
                <p>
                  Generate a ZK identity locally. Only you have the private key.
                </p>
              </div>
              <div className="flex gap-3">
                <span className="text-green-400 font-mono text-xs mt-0.5">
                  02
                </span>
                <p>
                  Join the BSD members group with your identity commitment
                  (public).
                </p>
              </div>
              <div className="flex gap-3">
                <span className="text-green-400 font-mono text-xs mt-0.5">
                  03
                </span>
                <p>
                  Prove membership with ZK proofs — the verifier knows you are a
                  member, but not which one.
                </p>
              </div>
              <div className="flex gap-3">
                <span className="text-green-400 font-mono text-xs mt-0.5">
                  04
                </span>
                <p>
                  Stream and transact privately. No wallet address or user ID
                  stored.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
