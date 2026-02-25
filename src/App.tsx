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
  // 캘린더에 보여줄 달 (화살표로만 변경, 날짜 탭과 무관)
  const [viewMonth, setViewMonth] = useState(() => startOfMonth(new Date()));

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
    openSheet(iso);
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
            />

            <div className="footerHint mutedText">
              팁: 날짜를 탭하면 바텀시트가 열리고, 선택 즉시 저장됩니다.
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