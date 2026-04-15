// DashboardFilters component.
import React, { useEffect, useMemo, useState } from "react";

const weekDays = ["S", "M", "T", "W", "T", "F", "S"];
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const buildCalendar = (year, month) => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const leading = firstDay.getDay();
  const total = lastDay.getDate();
  const cells = [];

  for (let i = 0; i < leading; i += 1) {
    cells.push(null);
  }

  for (let day = 1; day <= total; day += 1) {
    cells.push(new Date(year, month, day));
  }

  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  return cells;
};

const isSameDay = (a, b) => {
  if (!a || !b) return false;
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
};

const formatShort = (date) =>
  date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

function DashboardFilters({
  counties = [],
  states = [],
  propertyTypes = [],
  bidRange = { min: 0, max: 0 },
  onApply,
}) {
  const [search, setSearch] = useState("");
  const [county, setCounty] = useState("");
  const [state, setState] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [range, setRange] = useState({
    start: null,
    end: null,
  });
  const [draftRange, setDraftRange] = useState({
    start: null,
    end: null,
  });
  const [calendarMonth, setCalendarMonth] = useState(new Date(2026, 4, 1));
  const normalizedBidRange = useMemo(() => {
    const rawMin = Number(bidRange?.min);
    const rawMax = Number(bidRange?.max);
    let min = Number.isFinite(rawMin) ? Math.floor(rawMin) : 0;
    let max = Number.isFinite(rawMax) ? Math.ceil(rawMax) : 0;

    if (min < 0) min = 0;
    if (!Number.isFinite(max) || max <= 0) max = 4000;
    if (min > max) {
      const swap = min;
      min = max;
      max = swap;
    }

    return { min, max };
  }, [bidRange]);

  const [bidMin, setBidMin] = useState(normalizedBidRange.min);
  const [bidMax, setBidMax] = useState(normalizedBidRange.max);
  const bidMaxLimit = normalizedBidRange.max;

  useEffect(() => {
    setBidMin(normalizedBidRange.min);
    setBidMax(normalizedBidRange.max);
  }, [normalizedBidRange.min, normalizedBidRange.max]);

  const calendarCells = useMemo(
    () => buildCalendar(calendarMonth.getFullYear(), calendarMonth.getMonth()),
    [calendarMonth],
  );

  const isInRange = (date) => {
    if (!date || !draftRange.start || !draftRange.end) return false;
    return date >= draftRange.start && date <= draftRange.end;
  };

  const handleDateClick = (date) => {
    if (!date) return;
    if (!draftRange.start || (draftRange.start && draftRange.end)) {
      setDraftRange({ start: date, end: null });
      return;
    }
    if (date < draftRange.start) {
      setDraftRange({ start: date, end: draftRange.start });
      return;
    }
    setDraftRange({ start: draftRange.start, end: date });
  };

  const rangeLabel =
    range.start && range.end
      ? `${formatShort(range.start)} - ${formatShort(range.end)}`
      : range.start
        ? formatShort(range.start)
        : "Any date";

  const handleOpenCalendar = () => {
    setDraftRange({ start: range.start, end: range.end });
    setShowCalendar((prev) => !prev);
  };

  const handleApplyDate = () => {
    setRange({ start: draftRange.start, end: draftRange.end });
    setShowCalendar(false);
  };

  const handleCancelDate = () => {
    setDraftRange({ start: range.start, end: range.end });
    setShowCalendar(false);
  };

  const handleApplyFilters = () => {
    if (!onApply) return;
    onApply({
      search,
      county,
      state,
      propertyType,
      range,
      bidMin,
      bidMax,
    });
  };

  return (
    <div className="w-full container mx-auto mt-6 px-4 sm:px-6">
      <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm px-4 py-3">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[1.4fr_1fr_1fr_1fr_1fr_1.1fr_auto] md:items-end">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-zinc-600">Search</p>
            <div className="flex items-center gap-2 rounded-xl border border-zinc-200 px-3 py-2 text-sm text-zinc-500">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="m21 21-4.35-4.35"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <input
                type="text"
                placeholder="Search listings..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-full bg-transparent outline-none placeholder:text-zinc-400"
              />
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-semibold text-zinc-600">County</p>
            <div className="relative">
              <select
                value={county}
                onChange={(event) => setCounty(event.target.value)}
                className="w-full appearance-none rounded-xl border border-zinc-200 px-3 py-2 text-sm text-zinc-500"
              >
                <option value="">All Counties</option>
                {counties.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400">
                v
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-semibold text-zinc-600">State</p>
            <div className="relative">
              <select
                value={state}
                onChange={(event) => setState(event.target.value)}
                className="w-full appearance-none rounded-xl border border-zinc-200 px-3 py-2 text-sm text-zinc-500"
              >
                <option value="">All States</option>
                {states.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400">
                v
              </span>
            </div>
          </div>

          <div className="space-y-1 relative">
            <p className="text-xs font-semibold text-zinc-600">Date Range</p>
            <button
              type="button"
              className="w-full text-left rounded-xl border border-zinc-200 px-3 py-2 text-sm text-zinc-500"
              onClick={handleOpenCalendar}
            >
              {rangeLabel}
            </button>

            {showCalendar && (
              <div className="absolute left-0 top-[76px] z-20 w-[260px] rounded-2xl border border-zinc-200 bg-white p-4 shadow-xl">
                <div className="flex items-center justify-between text-sm font-semibold text-zinc-700">
                  <button
                    type="button"
                    className="text-zinc-400"
                    onClick={() =>
                      setCalendarMonth(
                        new Date(
                          calendarMonth.getFullYear(),
                          calendarMonth.getMonth() - 1,
                          1,
                        ),
                      )
                    }
                  >
                    &lt;
                  </button>
                  <span>
                    {monthNames[calendarMonth.getMonth()]}{" "}
                    {calendarMonth.getFullYear()}
                  </span>
                  <button
                    type="button"
                    className="text-zinc-400"
                    onClick={() =>
                      setCalendarMonth(
                        new Date(
                          calendarMonth.getFullYear(),
                          calendarMonth.getMonth() + 1,
                          1,
                        ),
                      )
                    }
                  >
                    &gt;
                  </button>
                </div>

                <div className="mt-3 grid grid-cols-7 gap-1 text-xs text-zinc-400">
                  {weekDays.map((day, index) => (
                    <div key={index} className="text-center">
                      {day}
                    </div>
                  ))}
                </div>

                <div className="mt-2 grid grid-cols-7 gap-1 text-sm">
                  {calendarCells.map((cell, index) => {
                    const isStart = isSameDay(cell, draftRange.start);
                    const isEnd = isSameDay(cell, draftRange.end);
                    const inRange = isInRange(cell);
                    return (
                      <button
                        key={`${cell ? cell.toDateString() : "empty"}-${index}`}
                        type="button"
                        onClick={() => handleDateClick(cell)}
                        className={
                          "h-8 w-8 rounded-full text-center" +
                          (cell
                            ? " hover:bg-amber-100"
                            : " text-transparent pointer-events-none") +
                          (inRange ? " bg-amber-100 text-amber-900" : "") +
                          (isStart || isEnd ? " bg-amber-400 text-white" : "")
                        }
                      >
                        {cell ? cell.getDate() : ""}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <button
                    type="button"
                    className="rounded-full px-4 py-2 text-sm text-zinc-500"
                    onClick={handleCancelDate}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="rounded-full bg-amber-400 px-4 py-2 text-sm font-semibold text-white"
                    onClick={handleApplyDate}
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-1">
            <p className="text-xs font-semibold text-zinc-600">Property Type</p>
            <div className="relative">
              <select
                value={propertyType}
                onChange={(event) => setPropertyType(event.target.value)}
                className="w-full appearance-none rounded-xl border border-zinc-200 px-3 py-2 text-sm text-zinc-500"
              >
                <option value="">All Types</option>
                {propertyTypes.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400">
                v
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-zinc-600">Bid Range</p>
              <p className="text-xs text-zinc-400">
                ${bidMin} - ${bidMax}
              </p>
            </div>
            <input
              type="range"
              min={bidMin}
              max={bidMaxLimit}
              value={bidMax}
              onChange={(event) => {
                const nextValue = Number(event.target.value);
                setBidMax(
                  Number.isFinite(nextValue)
                    ? Math.max(nextValue, bidMin)
                    : bidMin,
                );
              }}
              className="w-full accent-amber-400"
            />
          </div>

          <div className="flex md:justify-end">
            <button
              type="button"
              className="cursor-pointer rounded-xl bg-amber-400 px-5 py-2 text-sm font-semibold text-white"
              onClick={handleApplyFilters}
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardFilters;
