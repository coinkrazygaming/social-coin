/**
 * Device Detection Utility
 * Provides functions to detect device type, parse user agents, and extract IP addresses
 */

import { Request } from "express";

export interface DeviceInfo {
  type: "mobile" | "tablet" | "desktop" | "web";
  browser: string;
  os: string;
  userAgent: string;
}

/**
 * Detect device type from user agent string
 */
export function detectDevice(userAgent: string): DeviceInfo["type"] {
  const ua = userAgent.toLowerCase();

  // Check for mobile devices
  if (
    /mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(ua)
  ) {
    return "mobile";
  }

  // Check for tablets
  if (/tablet|ipad|playbook|silk/i.test(ua)) {
    return "tablet";
  }

  // Default to desktop
  return "desktop";
}

/**
 * Parse user agent to extract browser and OS information
 */
export function parseUserAgent(userAgent: string): DeviceInfo {
  const ua = userAgent;
  const deviceType = detectDevice(ua);

  // Detect browser
  let browser = "Unknown";
  if (ua.includes("Chrome")) browser = "Chrome";
  else if (ua.includes("Firefox")) browser = "Firefox";
  else if (ua.includes("Safari")) browser = "Safari";
  else if (ua.includes("Edge")) browser = "Edge";
  else if (ua.includes("Opera")) browser = "Opera";

  // Detect OS
  let os = "Unknown";
  if (ua.includes("Windows")) os = "Windows";
  else if (ua.includes("Mac OS")) os = "macOS";
  else if (ua.includes("Linux")) os = "Linux";
  else if (ua.includes("Android")) os = "Android";
  else if (ua.includes("iOS") || ua.includes("iPhone") || ua.includes("iPad"))
    os = "iOS";

  return {
    type: deviceType,
    browser,
    os,
    userAgent: ua,
  };
}

/**
 * Extract IP address from Express request
 * Handles proxies and load balancers
 */
export function extractIPAddress(req: Request): string {
  // Check for X-Forwarded-For header (common with proxies)
  const forwardedFor = req.headers["x-forwarded-for"];
  if (forwardedFor) {
    const ips = Array.isArray(forwardedFor)
      ? forwardedFor[0]
      : forwardedFor.split(",")[0];
    return ips.trim();
  }

  // Check for X-Real-IP header
  const realIP = req.headers["x-real-ip"];
  if (realIP) {
    return Array.isArray(realIP) ? realIP[0] : realIP;
  }

  // Fall back to remote address
  return req.ip || req.socket.remoteAddress || "0.0.0.0";
}

/**
 * Get complete device information from request
 */
export function getDeviceInfo(req: Request): DeviceInfo & { ip: string } {
  const userAgent = req.headers["user-agent"] || "Unknown";
  const deviceInfo = parseUserAgent(userAgent);
  const ip = extractIPAddress(req);

  return {
    ...deviceInfo,
    ip,
  };
}

/**
 * Check if request is from a mobile device
 */
export function isMobile(req: Request): boolean {
  const userAgent = req.headers["user-agent"] || "";
  return detectDevice(userAgent) === "mobile";
}

/**
 * Check if request is from a tablet device
 */
export function isTablet(req: Request): boolean {
  const userAgent = req.headers["user-agent"] || "";
  return detectDevice(userAgent) === "tablet";
}

/**
 * Check if request is from a desktop device
 */
export function isDesktop(req: Request): boolean {
  const userAgent = req.headers["user-agent"] || "";
  return detectDevice(userAgent) === "desktop";
}
