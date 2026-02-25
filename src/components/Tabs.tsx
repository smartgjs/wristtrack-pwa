type TabKey = "calendar" | "stats";

export function Tabs({
  active,
  onChange,
}: {
  active: TabKey;
  onChange: (t: TabKey) => void;
}) {
  return (
    <div className="tabs">
      <button
        className={`tab ${active === "calendar" ? "active" : ""}`}
        onClick={() => onChange("calendar")}
        type="button"
      >
        Calendar
      </button>
      <button
        className={`tab ${active === "stats" ? "active" : ""}`}
        onClick={() => onChange("stats")}
        type="button"
      >
        Stats
      </button>
    </div>
  );
}