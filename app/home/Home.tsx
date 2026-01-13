"use client";
import { useEffect, useRef, useState } from "react";

// Extend Window interface for webview detection
interface WindowWithWebView extends Window {
  ReactNativeWebView?: unknown;
  MSStream?: unknown;
  chrome?: unknown;
}

interface NavigatorWithStandalone extends Navigator {
  standalone?: boolean;
}

/**
 * Detects if the app is running in a webview
 * @returns true if running in a webview, false otherwise
 */
function isWebView(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  const win = window as WindowWithWebView;
  const nav = window.navigator as NavigatorWithStandalone;
  const userAgent = nav.userAgent.toLowerCase();

  // Check for common webview indicators in user agent
  const webviewIndicators = [
    "wv", // Android WebView
    "webview", // iOS WebView
    "mobile", // Often combined with webview
  ];

  // Check if user agent contains webview indicators
  const hasWebViewIndicator = webviewIndicators.some((indicator) =>
    userAgent.includes(indicator)
  );

  console.log("hasWebViewIndicator", hasWebViewIndicator);

  // Check for React Native WebView
  const isReactNativeWebView = win.ReactNativeWebView !== undefined;
  console.log("isReactNativeWebView", isReactNativeWebView);

  // Check for Android WebView (more specific check)
  const isAndroidWebView =
    userAgent.includes("android") &&
    userAgent.includes("wv") &&
    !userAgent.includes("chrome");
  console.log("isAndroidWebView", isAndroidWebView);
  // Check for iOS WebView (UIWebView or WKWebView)
  const isIOSWebView =
    /iphone|ipad|ipod/.test(userAgent) && !nav.standalone && !win.MSStream;
  console.log("isIOSWebView", isIOSWebView);
  // Additional check: webviews often don't have certain browser features
  const hasWebViewCharacteristics = !win.chrome;
  console.log("hasWebViewCharacteristics", hasWebViewCharacteristics);

  return (
    hasWebViewIndicator ||
    isReactNativeWebView ||
    isAndroidWebView ||
    (isIOSWebView && hasWebViewCharacteristics)
  );
}

export function HomePage() {
  const hasTriggered = useRef(false);
  const [sessionURL, setSessionURL] = useState("");
  const [, setIsLoading] = useState(false);
  const isInWebView = typeof window !== "undefined" ? isWebView() : false;

  useEffect(() => {
    function getSession() {
      if (hasTriggered.current && sessionURL) {
        return;
      }

      hasTriggered.current = true;

      setIsLoading(true);
      fetch("/api/session")
        .then((res) => res.json())
        .then((data) => {
          console.log("data", data);
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

    window.location.href = sessionURL;
    // Set state asynchronously to avoid cascading renders
  }, [sessionURL, isInWebView]);

  return (
    <div className="flex h-svh w-full flex-col items-center justify-center">
      <p>Loading ...</p>
    </div>
  );
}
