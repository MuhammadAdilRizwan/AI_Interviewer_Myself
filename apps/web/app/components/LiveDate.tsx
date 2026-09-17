"use client";

import { useEffect, useState } from "react";

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  weekday: "long",
  month: "long",
  day: "numeric",
  year: "numeric",
});

export default function LiveDate() {
  const [date, setDate] = useState("");

  useEffect(() => {
    const updateDate = () => setDate(dateFormatter.format(new Date()));
    updateDate();
    const timer = window.setInterval(updateDate, 60_000);
    return () => window.clearInterval(timer);
  }, []);

  return <p className="text-xs font-medium text-slate-400">{date || "Loading date..."}</p>;
}
