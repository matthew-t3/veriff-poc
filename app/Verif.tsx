"use client";
import { createVeriffFrame, MESSAGES } from "@veriff/incontext-sdk";
import { useEffect, useState } from "react";

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

  const win = window;
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

  // Check for React Native WebView
  const isReactNativeWebView = win.ReactNativeWebView !== undefined;

  // Check for Android WebView (more specific check)
  const isAndroidWebView =
    userAgent.includes("android") &&
    userAgent.includes("wv") &&
    !userAgent.includes("chrome");

  // Check for iOS WebView (UIWebView or WKWebView)
  const isIOSWebView =
    /iphone|ipad|ipod/.test(userAgent) && !nav.standalone && !win.MSStream;

  // Additional check: webviews often don't have certain browser features
  const hasWebViewCharacteristics = !win.chrome;

  return (
    hasWebViewIndicator ||
    isReactNativeWebView ||
    isAndroidWebView ||
    (isIOSWebView && hasWebViewCharacteristics)
  );
}

export function Verif() {
  const [sessionURL, setSessionURL] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFinished, setIsFinished] = useState(true);
  // Detect if running in webview - available for conditional logic
  const isInWebView = typeof window !== "undefined" ? isWebView() : false;

  async function getSession() {
    setIsLoading(true);
    const response = await fetch("/api/session");

    if (!response.ok) {
      const error = await response.json();
      console.log("error", error);
      alert("Something went wrong");
    }

    const data = await response.json();
    if (!data.verification.sessionToken) {
      alert("Something went wrong with the response");
      return;
    }

    setSessionURL(data.verification.url);
    setIsLoading(false);
  }

  useEffect(() => {
    // Log webview detection status
    console.log("Running in webview:", isInWebView);
  }, [isInWebView]);

  useEffect(() => {
    if (!sessionURL) {
      return;
    }

    createVeriffFrame({
      url: sessionURL,
      embedded: true,
      embeddedOptions: {
        rootElementID: "veriff-container",
      },
      onEvent: (event) => {
        console.log("event", event);
        if ([MESSAGES.CANCELED, MESSAGES.RELOAD_REQUEST].includes(event)) {
          setSessionURL("");
        }

        if (event === MESSAGES.FINISHED) {
          setIsFinished(true);
        }
      },
      onReload: () => {
        console.log("reload");
        setSessionURL("");
      },
    });
  }, [sessionURL]);

  if (!isFinished) {
    return (
      <div className="flex h-svh w-full flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">Verification finished</h1>
      </div>
    );
  }

  return (
    <div className="flex h-svh w-full flex-col">
      {!sessionURL && (
        <button
          type="button"
          onClick={getSession}
          className="bg-blue-200 p-2 rounded-md w-fit mx-auto cursor-pointer disabled:bg-blue-50 disabled:cursor-not-allowed disabled:text-gray-300"
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Get Session"}
        </button>
      )}
      <div
        id="veriff-container"
        className="w-full h-full text-center justify-center flex items-center"
      >
        {!sessionURL && "Veriff will be loaded here"}
      </div>
    </div>
  );
}
