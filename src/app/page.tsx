// src/app/page.tsx - Server Component
import Home from "./Home";

export default function HomePage() {
  const targetTime = parseFloat(process.env.TARGET_TIME || "0");
  const btn_running_times = parseFloat(process.env.BTN_RUNNING_TIMES || "0");
  const ticketCode = process.env.TICKET_CODE || "";
  const errorPageTime = parseInt(process.env.ERROR_PAGE_TIME || "0");

  return (
    <Home
      targetTime={targetTime}
      btn_running_times={btn_running_times}
      ticketCode={ticketCode}
      errorPageTime={errorPageTime}
    />
  );
}
