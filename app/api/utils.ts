import crypto from "node:crypto";

export const VERIF_URL = "https://api.veriff.me/v1";

export const API_TOKEN = process.env.API_TOKEN || "";
export const API_SECRET = process.env.API_SECRET || "";

export function generateSignature(payload: any, secret: string) {
  if (payload.constructor === Object) {
    payload = JSON.stringify(payload);
  }

  // if (payload.constructor !== Buffer) {
  //   console.log("here?");
  //   payload = Buffer.from(payload, "utf8");
  // }

  console.log("payload", payload);

  const signature = crypto.createHmac("sha256", secret);
  signature.update(payload);
  return signature.digest("hex");
}

interface NavigatorWithStandalone extends Navigator {
  standalone?: boolean;
}

/**
 * Detects if the app is running in a webview
 * @returns true if running in a webview, false otherwise
 */
export function isWebView(): boolean {
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

export function isPostMessageSupported(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return typeof window?.ReactNativeWebView?.postMessage === "function";
}
