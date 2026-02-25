import { addDays, endOfMonth, endOfWeek, format, isSameMonth, parseISO, startOfMonth, startOfWeek } from "date-fns";
import type { Records, ISODate } from "../app/types";
import { watchById } from "../app/watches";

export function CalendarGrid({
  monthDate,
  records,
  onPickDate,
  onPrevMonth,
  onNextMonth,
}: {
  monthDate: Date;
  records: Records;
  onPickDate: (isoDate: ISODate) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}) {
  const monthStart = startOfMonth(monthDate);
  const monthEnd = endOfMonth(monthDate);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 0 }); // Sunday
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const days: Date[] = [];
  for (let d = gridStart; d <= gridEnd; d = addDays(d, 1)) {
    days.push(d);
  }

  // 이번 달에 기록된 날짜 · 시계 풀네임 목록 (날짜순)
  const monthRecords: { iso: ISODate; watchName: string }[] = [];
  for (let d = monthStart; d <= monthEnd; d = addDays(d, 1)) {
    const iso = format(d, "yyyy-MM-dd") as ISODate;
    const watch = watchById(records[iso]);
    if (watch) monthRecords.push({ iso, watchName: watch.name });
  }

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

      {monthRecords.length > 0 && (
        <div className="calendarSummary">
          <div className="calendarSummaryTitle">이번 달 기록</div>
          <ul className="calendarSummaryList">
            {monthRecords.map(({ iso, watchName }) => (
              <li key={iso} className="calendarSummaryItem">
                <span className="calendarSummaryDate">{format(parseISO(iso), "M월 d일")}</span>
                <span className="calendarSummarySep"> · </span>
                <span className="calendarSummaryWatch">{watchName}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}