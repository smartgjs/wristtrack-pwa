import type { ISODate } from "../app/types";
import { WATCHES, watchById } from "../app/watches";

export function DayPickerSheet({
  open,
  date,
  selectedWatchId,
  onClose,
  onSelect,
  onClear,
}: {
  open: boolean;
  date: ISODate | null;
  selectedWatchId?: string;
  onClose: () => void;
  onSelect: (watchId: string) => void;
  onClear: () => void;
}) {
  if (!open || !date) return null;

  const current = watchById(selectedWatchId);

  return (
    <div className="sheetOverlay" onClick={onClose} role="presentation">
      <div className="sheet" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="sheetHandle" />
        <div className="sheetHeader">
          <div>
            <div className="sheetTitle">{date}</div>
            <div className="sheetSub">
              현재: <b>{current ? current.name : "기록 없음"}</b>
            </div>
          </div>
          <button type="button" className="ghostBtn" onClick={onClose}>
            닫기
          </button>
        </div>

        <div className="sheetBody">
          <label className="label">시계 선택</label>
          <select
            className="select"
            value={selectedWatchId ?? ""}
            onChange={(e) => {
              const v = e.target.value;
              if (v) onSelect(v);
            }}
          >
            <option value="">선택하세요…</option>
            {WATCHES.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name}
              </option>
            ))}
          </select>

          <div className="quickGrid">
            {WATCHES.map((w) => (
              <button
                key={w.id}
                type="button"
                className={`quickBtn ${selectedWatchId === w.id ? "active" : ""}`}
                onClick={() => onSelect(w.id)}
              >
                <span className="pill">{w.short}</span>
                <span className="quickName">{w.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="sheetFooter">
          <button type="button" className="dangerBtn" onClick={onClear} disabled={!selectedWatchId}>
            기록 삭제
          </button>
          <button type="button" className="primaryBtn" onClick={onClose}>
            완료
          </button>
        </div>
      </div>
    </div>
  );
}