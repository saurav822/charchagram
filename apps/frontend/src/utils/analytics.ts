/**
 * Google Analytics (gtag) helper utilities.
 *
 * All calls guard against server-side rendering (typeof window check) and
 * a missing gtag script — both are no-ops rather than errors.
 *
 * The gtag measurement ID is configured in layout.tsx via the Google Tag
 * Manager script tag.
 */

declare global {
  interface Window {
    /** Google Analytics global tag function injected by the GTM script. */
    gtag: (...args: unknown[]) => void;
  }
}

/** Extra parameters passed to gtag events — string/number/boolean values only. */
type GtagEventParams = Record<string, string | number | boolean>;

/**
 * Returns true if gtag is available in the current environment.
 * Always false during SSR.
 */
function isGtagAvailable(): boolean {
  return typeof window !== 'undefined' && typeof window.gtag === 'function';
}

/**
 * Tracks a page view event.
 *
 * @param pageName - Human-readable page title (e.g. 'Home', 'Post Detail')
 * @param pagePath - URL path (e.g. '/post/abc123')
 */
export function trackPageView(pageName: string, pagePath: string): void {
  if (!isGtagAvailable()) return;
  window.gtag('event', 'page_view', {
    page_title: pageName,
    page_location: window.location.href,
    page_path: pagePath,
  });
}

/**
 * Sends a custom event to Google Analytics.
 *
 * @param eventName - GA4 event name (snake_case recommended)
 * @param parameters - Optional key-value pairs attached to the event
 */
export function trackEvent(eventName: string, parameters?: GtagEventParams): void {
  if (!isGtagAvailable()) return;
  window.gtag('event', eventName, parameters);
}

/**
 * Tracks a UI button click with the button label and page location.
 *
 * @param buttonName - Identifies the button (e.g. 'submit_post', 'like_button')
 * @param location   - Page or section where the button appears
 */
export function trackButtonClick(buttonName: string, location: string): void {
  trackEvent('button_click', {
    event_category: 'engagement',
    event_label: buttonName,
    custom_parameter_1: location,
  });
}

/**
 * Tracks a form submission with success/failure outcome.
 *
 * @param formName - Identifies the form (e.g. 'login_form', 'create_post')
 * @param success  - Whether the submission succeeded
 */
export function trackFormSubmission(formName: string, success: boolean): void {
  trackEvent('form_submit', {
    event_category: 'engagement',
    event_label: formName,
    success: success ? 1 : 0,
  });
}

/**
 * Tracks a generic user action with optional metadata.
 *
 * @param action  - Action identifier (e.g. 'voted_in_poll', 'shared_post')
 * @param details - Optional additional parameters
 */
export function trackUserAction(action: string, details?: GtagEventParams): void {
  trackEvent('user_action', {
    event_category: 'user_interaction',
    event_label: action,
    ...details,
  });
}
