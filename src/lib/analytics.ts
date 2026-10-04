export function trackAnalyticsEvent(
  eventName: string,
  params: Record<string, string | number | boolean> = {},
) {
  if (typeof window === "undefined") return;

  const analyticsWindow = window as Window & {
    gtag?: (command: string, eventName: string, params?: Record<string, unknown>) => void;
  };

  if (typeof analyticsWindow.gtag !== "function") return;

  analyticsWindow.gtag("event", eventName, {
    ...params,
    page_path: window.location.pathname,
  });
}
