import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { router } from "expo-router";
import { useIncomingShare } from "expo-sharing";

import { useAuth } from "@/contexts/auth-context";
import { createOpportunity } from "@/lib/opportunities";
import type { OpportunitySource } from "@/types/opportunity";

function extractUrl(value: string): string | null {
  const match = value.match(/https?:\/\/[^\s]+/);

  return match?.[0] ?? null;
}

function detectSource(url: string): OpportunitySource {
  try {
    const hostname = new URL(url).hostname.toLowerCase();

    if (hostname.includes("linkedin.com")) {
      return "LINKEDIN";
    }

    if (hostname.includes("instagram.com")) {
      return "INSTAGRAM";
    }

    if (
      hostname === "x.com" ||
      hostname.endsWith(".x.com") ||
      hostname === "twitter.com" ||
      hostname.endsWith(".twitter.com")
    ) {
      return "X";
    }

    if (hostname.includes("facebook.com")) {
      return "FACEBOOK";
    }

    return "WEBSITE";
  } catch {
    return "OTHER";
  }
}

export default function HandleShareScreen() {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();

  const { sharedPayloads, clearSharedPayloads } = useIncomingShare();

  const [message, setMessage] = useState("Saving opportunity...");

  const hasProcessed = useRef(false);

  useEffect(() => {
    if (isAuthLoading || hasProcessed.current) {
      return;
    }

    if (!isAuthenticated) {
      const timer = setTimeout(() => {
        setMessage("Please log in to save opportunities.");
      }, 0);

      return () => clearTimeout(timer);
    }

    const payload = sharedPayloads.find(
      (item) => item.shareType === "url" || item.shareType === "text",
    );

    if (!payload?.value) {
      const timer = setTimeout(() => {
        setMessage("No valid link was shared.");
      }, 0);

      return () => clearTimeout(timer);
    }

    const url =
      payload.shareType === "url" ? payload.value : extractUrl(payload.value);

    if (!url) {
      const timer = setTimeout(() => {
        setMessage("No valid link was found.");
      }, 0);

      return () => clearTimeout(timer);
    }

    hasProcessed.current = true;

    const saveOpportunity = async () => {
      try {
        await createOpportunity({
          url,
          source: detectSource(url),
        });

        clearSharedPayloads();

        setMessage("✓ Saved to ApplyTMRW");

        setTimeout(() => {
          router.replace("/(tabs)");
        }, 800);
      } catch (error) {
        console.error("Failed to save shared opportunity:", error);

        setMessage(
          error instanceof Error
            ? error.message
            : "Failed to save opportunity.",
        );

        hasProcessed.current = false;
      }
    };

    void saveOpportunity();
  }, [clearSharedPayloads, isAuthenticated, isAuthLoading, sharedPayloads]);

  return (
    <View className="flex-1 items-center justify-center bg-white px-6">
      <ActivityIndicator size="large" />

      <Text className="mt-6 text-center text-lg font-semibold text-slate-900">
        {message}
      </Text>
    </View>
  );
}
