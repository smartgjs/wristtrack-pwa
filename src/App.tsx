import { useEffect, useMemo, useState } from "react";
import "./index.css";
import type { ISODate, Records } from "./app/types";
import { loadRecords, saveRecords, setRecord, deleteRecord } from "./app/storage";
import { Tabs } from "./components/Tabs";
import { CalendarGrid } from "./components/CalendarGrid";
import { DayPickerSheet } from "./components/DayPickerSheet";
import { StatsView } from "./components/StatsView";
import { parseISO, isValid, format, startOfMonth } from "date-fns";

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

  // 캘린더가 표시할 "현재 월"은 pickedDate가 있으면 그 달, 없으면 오늘 달
  const monthDate = useMemo(() => {
    const base = pickedDate ? isoToDate(pickedDate) : new Date();
    return startOfMonth(base);
  }, [pickedDate]);

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

  // month nav 버튼이 pickedDate를 "yyyy-MM-01" 형태로 주기 때문에, 시트를 바로 열지 않고 월만 바꾸는 용도도 필요
  // CalendarGrid에서 onPickDate를 공유하므로, 여기서 "1일 선택"이면 시트를 열지 않고 month만 바꾸도록 처리
  const handlePickFromGrid = (iso: ISODate) => {
    openSheet(iso);
  };

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
            <CalendarGrid monthDate={monthDate} records={records} onPickDate={handlePickFromGrid} />

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