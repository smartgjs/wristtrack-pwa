import { addDays, endOfMonth, endOfWeek, format, isSameMonth, parseISO, startOfMonth, startOfWeek } from "date-fns";
import type { Records, ISODate } from "../app/types";
import { watchById } from "../app/watches";

export function CalendarGrid({
  monthDate,
  records,
  onPickDate,
  onPrevMonth,
  onNextMonth,
  bottomDisplayDate,
}: {
  monthDate: Date;
  records: Records;
  onPickDate: (isoDate: ISODate) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  bottomDisplayDate: ISODate | null;
}) {
  const monthStart = startOfMonth(monthDate);
  const monthEnd = endOfMonth(monthDate);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 0 }); // Sunday
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const days: Date[] = [];
  for (let d = gridStart; d <= gridEnd; d = addDays(d, 1)) {
    days.push(d);
  }

  const bottomWatch = bottomDisplayDate ? watchById(records[bottomDisplayDate]) : null;
  const monthLabel = format(monthDate, "yyyy년 M월");

  return (
    <div className="calendar">
      <div className="calendarHeader">
        <div className="calendarTitle">{monthLabel}</div>

        <div className="calendarNav">
          <button
            type="button"
            className="ghostBtn"
            onClick={onPrevMonth}
            title="이전 달"
          >
            ◀
          </button>
          <button
            type="button"
            className="ghostBtn"
            onClick={() => onPickDate(format(new Date(), "yyyy-MM-dd") as ISODate)}
            title="오늘 선택"
          >
            오늘
          </button>
          <button
            type="button"
            className="ghostBtn"
            onClick={onNextMonth}
            title="다음 달"
          >
            ▶
          </button>
        </div>
      </div>

      <div className="dowRow">
        {["일", "월", "화", "수", "목", "금", "토"].map((d) => (
          <div key={d} className="dowCell">
            {d}
          </div>
        ))}
      </div>

      <div className="grid">
        {days.map((day) => {
          const iso = format(day, "yyyy-MM-dd") as ISODate;
          const watchId = records[iso];
          const watch = watchById(watchId);
          const inMonth = isSameMonth(day, monthDate);

          return (
            <button
              key={iso}
              type="button"
              className={`dayCell ${inMonth ? "" : "muted"}`}
              onClick={() => onPickDate(iso)}
            >
              <div className="dayTop">
                <span className="dayNum">{format(day, "d")}</span>
              </div>

              <div className="dayBottom">
                {watch ? <span className="dayCheck" title={watch.name}>✓</span> : <span className="dayCheck empty">—</span>}
              </div>
            </button>
          );
        })}
      </div>

      {bottomWatch && bottomDisplayDate && (
        <div className="calendarSummary">
          <div className="calendarSummaryItem">
            <span className="calendarSummaryDate">{format(parseISO(bottomDisplayDate), "M월 d일")}</span>
            <span className="calendarSummarySep"> · </span>
            <span className="calendarSummaryWatch">{bottomWatch.name}</span>
          </div>
        </div>
      )}
    </div>
  );
}