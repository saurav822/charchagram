/**
 * Share button component.
 *
 * Uses the Web Share API (navigator.share) when available.
 * Gracefully ignores AbortError (user cancelled the share sheet) and
 * silently falls back for other errors — the share action is non-critical.
 */
export default function Share({
  url,
  pathname,
  showText = true,
}: {
  url: string;
  pathname: string;
  showText?: boolean;
}) {
  const handleShare = async () => {
    try {
      await navigator.share({ url });
    } catch (error) {
      // AbortError = user dismissed the share sheet — not an error worth surfacing
      if (error instanceof Error && error.name !== 'AbortError') {
        // Share failed for an unexpected reason; silently ignore so the UI
        // remains usable even when navigator.share is unsupported or blocked.
      }
    }
  };

  return (
    <div className="flex gap-1">
      <button onClick={handleShare}>
        <img src={pathname} alt="Share" className="w-5 h-5" />
      </button>
      {showText && <span className="postsection-share-button my-auto">साझा</span>}
    </div>
  );
}
