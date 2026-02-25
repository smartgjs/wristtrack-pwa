import { useEffect, useState } from "react";
import "./index.css";
import type { ISODate, Records } from "./app/types";
import { loadRecords, saveRecords, setRecord, deleteRecord } from "./app/storage";
import { Tabs } from "./components/Tabs";
import { CalendarGrid } from "./components/CalendarGrid";
import { DayPickerSheet } from "./components/DayPickerSheet";
import { StatsView } from "./components/StatsView";
import { addMonths, parseISO, isValid, format, startOfMonth } from "date-fns";

type TabKey = "calendar" | "stats";

function isoToDate(iso: ISODate): Date {
  const d = parseISO(iso);
  return isValid(d) ? d : new Date();
}

export default function App() {
  const [tab, setTab] = useState<TabKey>("calendar");
  const [records, setRecordsState] = useState<Records>(() => loadRecords());

  const [pickedDate, setPickedDate] = useState<ISODate | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [viewMonth, setViewMonth] = useState(() => startOfMonth(new Date()));
  // 시계가 있는 날짜: 첫 탭 = 하단에만 표시, 두 번째 탭 = 시트 열기
  const [lastTappedDateWithWatch, setLastTappedDateWithWatch] = useState<ISODate | null>(null);
  const [bottomDisplayDate, setBottomDisplayDate] = useState<ISODate | null>(null);

  useEffect(() => {
    saveRecords(records);
  }, [records]);

  const openSheet = (iso: ISODate) => {
    setPickedDate(iso);
    setSheetOpen(true);
  };

  const closeSheet = () => setSheetOpen(false);

  const selectedWatchId = pickedDate ? records[pickedDate] : undefined;

  const handleSelect = (watchId: string) => {
    if (!pickedDate) return;
    setRecordsState((prev) => setRecord(pickedDate, watchId, prev));
  };

  const handleClear = () => {
    if (!pickedDate) return;
    setRecordsState((prev) => deleteRecord(pickedDate, prev));
  };

  const handlePickFromGrid = (iso: ISODate) => {
    setViewMonth(startOfMonth(isoToDate(iso)));
    const hasWatch = Boolean(records[iso]);
    if (!hasWatch) {
      setLastTappedDateWithWatch(null);
      setBottomDisplayDate(null);
      openSheet(iso);
      return;
    }
    if (iso === lastTappedDateWithWatch) {
      setLastTappedDateWithWatch(null);
      openSheet(iso);
      return;
    }
    setLastTappedDateWithWatch(iso);
    setBottomDisplayDate(iso);
  };

  const goPrevMonth = () => setViewMonth((m) => startOfMonth(addMonths(m, -1)));
  const goNextMonth = () => setViewMonth((m) => startOfMonth(addMonths(m, 1)));

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <div className="brandTitle">WristTrack</div>
          <div className="brandSub">날짜 탭 → 바로 선택</div>
        </div>
      </header>

      <main className="main">
        <Tabs active={tab} onChange={setTab} />

        {tab === "calendar" ? (
          <>
            <CalendarGrid
              monthDate={viewMonth}
              records={records}
              onPickDate={handlePickFromGrid}
              onPrevMonth={goPrevMonth}
              onNextMonth={goNextMonth}
              bottomDisplayDate={bottomDisplayDate}
            />

            <div className="footerHint mutedText">
              팁: 빈 날짜는 탭하면 시계 선택. 이미 기록한 날짜는 한 번 탭하면 하단에 표시, 두 번 탭하면 수정.
            </div>

            <DayPickerSheet
              open={sheetOpen}
              date={pickedDate}
              selectedWatchId={selectedWatchId}
              onClose={closeSheet}
              onSelect={handleSelect}
              onClear={handleClear}
            />
          </>
        ) : (
          <StatsView records={records} />
        )}
      </main>

      <footer className="bottombar">
        <button
          className="primaryBtn"
          type="button"
          onClick={() => openSheet(format(new Date(), "yyyy-MM-dd") as ISODate)}
        >
          오늘 기록
        </button>
      </footer>
    </div>
  );
}