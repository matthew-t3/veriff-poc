"use client";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { isWebView } from "../api/utils";

export function HomePage() {
  const hasTriggered = useRef(false);
  const [sessionURL, setSessionURL] = useState("");
  const router = useRouter();
  const [, setIsLoading] = useState(false);
  const isInWebView = typeof window !== "undefined" ? isWebView() : false;

  useEffect(() => {
    function getSession() {
      if (hasTriggered.current || sessionURL) {
        return;
      }

      hasTriggered.current = true;

      setIsLoading(true);
      fetch("/api/session")
        .then((res) => res.json())
        .then((data) => {
          setSessionURL(data.verification.url);
          setIsLoading(false);
          hasTriggered.current = false;
        });
    }

    getSession();
  }, [sessionURL]);

  useEffect(() => {
    console.log("Running in webview:", isInWebView);
    if (!sessionURL) {
      return;
    }

    router.push("/success");
    // window.location.href = sessionURL;
    // Set state asynchronously to avoid cascading renders
  }, [sessionURL, isInWebView, router]);

  return (
    <div className="flex h-svh w-full flex-col items-center justify-center">
      <p>Loading ...</p>
    </div>
  );
}
