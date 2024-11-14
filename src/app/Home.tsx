"use client";

import { useState, useEffect } from "react";
import ErrorPage from "./components/errorPage";

export default function Home() {
  const [targetTime, setTargetTime] = useState<number>(0);
  const [btnRunningTimes, setBtnRunningTimes] = useState<number>(0);
  const [errorPageTime, setErrorPageTime] = useState<number>(0);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [result, setResult] = useState<string | null>(null);
  const [raindrops, setRaindrops] = useState<
    { number: string; left: number; animationDelay: string; animationDuration: string }[]
  >([]);
  const [timerPosition, setTimerPosition] = useState({ top: "50%", left: "50%" });
  const [clickCount, setClickCount] = useState<number>(0);
  const [patternLv, setPatternLv] = useState<number>(1);
  const [showError, setShowError] = useState<boolean>(false);
  const [errorCount, setErrorCount] = useState<number>(0);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);

  const [ticketCode, setTicketCode] = useState<string | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      const response = await fetch("/api/getGameData");
      const data = await response.json();
      setTargetTime(data.targetTime);
      setBtnRunningTimes(data.btnRunningTimes);
      setErrorPageTime(data.errorPageTime);
    };
    fetchConfig();
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isRunning) {
      timer = setInterval(() => {
        setTimeElapsed((prev) => {
          const newTime = parseFloat((prev + 0.01).toFixed(2));

          // Show error at time range
          if (newTime >= errorPageTime && newTime < errorPageTime + (15 + 30)) {
            setShowError(true);
            setErrorCount(1);
            setTimeout(() => setShowError(false), 1000 * (15 + 15));
          }

          return newTime;
        });
      }, 10);
    }

    return () => clearInterval(timer);
  }, [isRunning, errorPageTime, errorCount]);

  const startGame = () => {
    setTimeElapsed(0);
    setIsRunning(true);
    setResult(null);
    setRaindrops([]);
    setShowError(false);
  };

  const stopGame = async () => {
    if (timeElapsed > targetTime - 10 && clickCount < btnRunningTimes * patternLv) {
      if (patternLv > 5) setPatternLv(1);

      setClickCount(clickCount + 1);

      const timer_btn = document.querySelector(".timer_btn") as HTMLElement;
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      const randomTop = Math.floor(Math.random() * (windowHeight - timer_btn.offsetHeight));
      const randomLeft = Math.floor(Math.random() * (windowWidth - timer_btn.offsetWidth));

      timer_btn.style.position = "absolute";
      timer_btn.style.top = `${randomTop}px`;
      timer_btn.style.left = `${randomLeft}px`;
      timer_btn.style.transition = "top 0.1s, left 0.1s";
      return;
    }

    // รีเซ็ตค่าเมื่อหยุดเกม
    setClickCount(0);
    setErrorCount(0);

    if (timeElapsed > targetTime - 10) setPatternLv(patternLv + 1);

    setIsRunning(false);

    const timer_btn = document.querySelector(".timer_btn") as HTMLElement;
    timer_btn.style.position = "unset";

    const difference = Math.abs(timeElapsed).toFixed(2);

    if (Math.abs(timeElapsed - targetTime) < 0.5) {
      try {
        const response = await fetch("/api/getTicketCode", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ timeElapsed,btnRunningTimes,errorCount })
        });

        const data = await response.json();

        if (data.success) {
          setIsCorrect(true);
          setTicketCode(data.ticketCode);
          setResult(
            `เก่งมากกกกกก! รหัสตั๋วคือ: ${data.ticketCode} เอาไปใส่ใน "ใส่โปรโมชันโค้ด" บนหน้าอีเวนต์ป๊อป ได้เลย!`
          );
        } else {
          setResult(`ได้ ${difference} วินาที! ยังไม่ได้นะพยายามอีกนิดนุง`);
        }
      } catch (error) {
        console.error("Error fetching ticket code:", error);
        setResult(`เกิดข้อผิดพลาดในการขอรหัสตั๋ว!`);
      }
    } else {
      setResult(`ได้ ${difference} วินาที! ยังไม่ได้นะพยายามอีกนิดนุง`);
    }
  };

  const generateRaindrop = () => {
    setRaindrops((prev) => {
      if (prev.length >= 50) return prev;
      return [
        ...prev,
        {
          number: getRandomNumber(),
          left: Math.random() * 100,
          animationDelay: Math.random() * 0.001 + "s",
          animationDuration: Math.random() * 3 + 2 + "s"
        }
      ];
    });
  };

  useEffect(() => {
    const interval = setInterval(generateRaindrop, 200);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setRaindrops((prev) => prev.filter((drop) => drop.animationDuration !== "0s"));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimerPosition({
        top: `${Math.random() * 80 + 10}%`,
        left: `${Math.random() * 80 + 10}%`
      });
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {showError && <ErrorPage />}
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 relative overflow-hidden">
        <div className="text-center z-10 space-y-6">
          <div className="text-5xl font-bold mb-2">
            Stupid Hackathon <span className="text-orange-400">KMUTT</span>
          </div>
          <p className="text-2xl mb-6">
            ถ้าอยากได้บัตรก็หยุดเวลาให้ได้ {errorCount < 1 ? 15 : targetTime} วินาทีสิ อิอิอิ
          </p>
          {isRunning && (
            <div
              className="absolute"
              style={{
                top: timerPosition.top,
                left: timerPosition.left,
                transform: "translate(-50%, -50%)",
                transition: "top 0.5s, left 0.5s"
              }}
            >
              <div
                className="glitch text-6xl font-semibold mb-6"
                data-text={timeElapsed.toFixed(2)}
              >
                {timeElapsed.toFixed(2)} วินาที
              </div>
            </div>
          )}

          {!isCorrect && (
            <button
              tabIndex={-1}
              onClick={(e) => {
                (() => (isRunning ? stopGame() : startGame()))();
                (e.target as HTMLButtonElement).blur();
              }}
              className="px-8 py-4 bg-blue-500 text-white text-lg rounded-lg hover:bg-blue-700 transition duration-200 shadow-lg timer_btn"
            >
              {isRunning ? "หยุดเวลา!" : "เริ่มเกมใหม่"}
            </button>
          )}

          {result && <p className="mt-6 text-xl text-green-600 font-semibold">{result}</p>}
        </div>

        {/* Raindrops */}
        {isRunning && (
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            {raindrops.map((drop, index) => (
              <div
                key={index}
                className="falling-number absolute text-8xl font-semibold text-gray-600 opacity-75"
                style={{
                  left: `${drop.left}vw`,
                  animation: `fall ${drop.animationDuration} linear infinite`,
                  animationDelay: drop.animationDelay
                }}
              >
                {drop.number}
              </div>
            ))}
          </div>
        )}

        <style jsx>{`
          @keyframes fall {
            0% {
              transform: translateY(-100px);
              opacity: 1;
            }
            100% {
              transform: translateY(100vh);
              opacity: 0;
            }
          }
        `}</style>
      </div>
    </>
  );
}

function getRandomNumber(): string {
  return Math.floor(Math.random() * 10).toString();
}
