import { addMonths, endOfMonth, endOfWeek, format, isSameMonth, startOfMonth, startOfWeek, addDays } from "date-fns";
import type { Records, ISODate } from "../app/types";
import { watchById } from "../app/watches";

export function CalendarGrid({
  monthDate,
  records,
  onPickDate,
}: {
  monthDate: Date; // any date within the month
  records: Records;
  onPickDate: (isoDate: ISODate) => void;
}) {
  const monthStart = startOfMonth(monthDate);
  const monthEnd = endOfMonth(monthDate);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 0 }); // Sunday
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const days: Date[] = [];
  for (let d = gridStart; d <= gridEnd; d = addDays(d, 1)) {
    days.push(d);
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
            onClick={() => onPickDate(format(addMonths(monthDate, -1), "yyyy-MM-01") as ISODate)}
            title="이전 달로 이동(해당 달 1일 선택)"
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
            onClick={() => onPickDate(format(addMonths(monthDate, 1), "yyyy-MM-01") as ISODate)}
            title="다음 달로 이동(해당 달 1일 선택)"
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
                {watch ? <span className="pill" title={watch.name}>{watch.short}</span> : <span className="pill empty">—</span>}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}