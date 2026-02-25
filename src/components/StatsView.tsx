import { useMemo, useState } from "react";
import type { Records } from "../app/types";
import { WATCHES } from "../app/watches";
import { getMonthlyStats, getYearlyStats } from "../app/stats";
import { format } from "date-fns";

function Table({
  title,
  total,
  byWatch,
  ratios,
}: {
  title: string;
  total: number;
  byWatch: Record<string, number>;
  ratios: Record<string, number>;
}) {
  return (
    <div className="card">
      <div className="cardHeader">
        <div className="cardTitle">{title}</div>
        <div className="cardSub">기록된 총 일수: <b>{total}</b></div>
      </div>

      <div className="tableWrap">
        <table className="table">
          <thead>
            <tr>
              <th>시계</th>
              <th className="num">횟수</th>
              <th className="num">비율(%)</th>
            </tr>
          </thead>
          <tbody>
            {WATCHES.map((w) => (
              <tr key={w.id}>
                <td>
                  <span className="pill">{w.short}</span>{" "}
                  <span className="mutedText">{w.name}</span>
                </td>
                <td className="num">{byWatch[w.id] ?? 0}</td>
                <td className="num">{(ratios[w.id] ?? 0).toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function BarList({
  title,
  total,
  ratios,
}: {
  title: string;
  total: number;
  ratios: Record<string, number>;
}) {
  const sorted = [...WATCHES].sort((a, b) => (ratios[b.id] ?? 0) - (ratios[a.id] ?? 0));

  return (
    <div className="card">
      <div className="cardHeader">
        <div className="cardTitle">{title} 비율(%)</div>
        <div className="cardSub">기록된 총 일수: <b>{total}</b></div>
      </div>

      <div className="barList">
        {sorted.map((w) => {
          const p = ratios[w.id] ?? 0;
          return (
            <div key={w.id} className="barRow">
              <div className="barLabel">
                <span className="pill">{w.short}</span>
                <span className="mutedText">{w.name}</span>
              </div>
              <div className="barTrack" aria-label={`${w.name} ${p.toFixed(1)}%`}>
                <div className="barFill" style={{ width: `${p}%` }} />
              </div>
              <div className="barValue">{p.toFixed(1)}%</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StackedBar({
  title,
  total,
  ratios,
}: {
  title: string;
  total: number;
  ratios: Record<string, number>;
}) {
  // 0%는 숨기고, 합이 100이 안 될 수 있어도 그대로 표시
  const items = WATCHES.map((w) => ({ w, p: ratios[w.id] ?? 0 })).filter((x) => x.p > 0);

  return (
    <div className="card">
      <div className="cardHeader">
        <div className="cardTitle">{title} 점유율</div>
        <div className="cardSub">기록된 총 일수: <b>{total}</b></div>
      </div>

      <div className="stackTrack">
        {items.length === 0 ? (
          <div className="mutedText">기록이 없습니다.</div>
        ) : (
          <div className="stackBar">
            {items.map(({ w, p }) => (
              <div
                key={w.id}
                className="stackSeg"
                title={`${w.name} ${p.toFixed(1)}%`}
                style={{ flex: p }}
              />
            ))}
          </div>
        )}
      </div>

      {items.length > 0 && (
        <div className="legend">
          {items.map(({ w, p }) => (
            <div key={w.id} className="legendItem">
              <span className="legendDot" data-id={w.id} />
              <span className="mutedText">{w.short}</span>
              <span className="legendPct">{p.toFixed(1)}%</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function StatsView({ records }: { records: Records }) {
  const now = new Date();
  const [year, setYear] = useState<number>(Number(format(now, "yyyy")));
  const [month, setMonth] = useState<number>(Number(format(now, "M")));

  const monthly = useMemo(() => getMonthlyStats(records, year, month), [records, year, month]);
  const yearly = useMemo(() => getYearlyStats(records, year), [records, year]);

  const yearsFromRecords = useMemo(() => {
    const set = new Set<number>();
    Object.keys(records).forEach((d) => {
      const y = Number(d.slice(0, 4));
      if (!Number.isNaN(y)) set.add(y);
    });
    const arr = Array.from(set).sort((a, b) => b - a);
    if (arr.length === 0) arr.push(Number(format(now, "yyyy")));
    return arr;
  }, [records, now]);

  return (
    <div className="stats">
      <div className="controls card">
        <div className="controlRow">
          <div className="control">
            <label className="label">연도</label>
            <select className="select" value={year} onChange={(e) => setYear(Number(e.target.value))}>
              {yearsFromRecords.map((y) => (
                <option key={y} value={y}>
                  {y}년
                </option>
              ))}
            </select>
          </div>

          <div className="control">
            <label className="label">월</label>
            <select className="select" value={month} onChange={(e) => setMonth(Number(e.target.value))}>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <option key={m} value={m}>
                  {m}월
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="hint mutedText">
          비율(%) = 해당 월/연에 기록된 총 일수 대비 시계별 점유율
        </div>
      </div>

      <StackedBar
        title={`${monthly.year}년 ${monthly.month}월`}
        total={monthly.total}
        ratios={monthly.ratios}
      />

      <BarList
        title={`${monthly.year}년 ${monthly.month}월`}
        total={monthly.total}
        ratios={monthly.ratios}
      />

      <Table
        title={`${monthly.year}년 ${monthly.month}월`}
        total={monthly.total}
        byWatch={monthly.byWatch}
        ratios={monthly.ratios}
      />

      <StackedBar
        title={`${yearly.year}년 (연간)`}
        total={yearly.total}
        ratios={yearly.ratios}
      />

      <BarList
        title={`${yearly.year}년 (연간)`}
        total={yearly.total}
        ratios={yearly.ratios}
      />

      <Table
        title={`${yearly.year}년 (연간)`}
        total={yearly.total}
        byWatch={yearly.byWatch}
        ratios={yearly.ratios}
      />
    </div>
  );
}