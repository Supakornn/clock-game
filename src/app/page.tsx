"use client";

import { useState, useEffect } from "react";
import ErrorPage from "./components/errorPage";

// ดึงค่าจาก env
const targetTime = parseFloat(process.env.NEXT_PUBLIC_TARGET_TIME || "0");
const btn_running_times = parseFloat(process.env.NEXT_PUBLIC_BTN_RUNNING_TIMES || "0");
const ticketCode = process.env.NEXT_PUBLIC_TICKET_CODE || "";

const getRandomNumber = () => (Math.random() * 100).toFixed(0);

export default function Home() {
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [result, setResult] = useState<string | null>(null);

  interface Raindrop {
    number: string;
    left: number;
    animationDelay: string;
    animationDuration: string;
  }

  const [raindrops, setRaindrops] = useState<Raindrop[]>([]);
  const [timerPosition, setTimerPosition] = useState({ top: "50%", left: "50%" });
  let [clickCount,setClickCount] = useState<number>(0);
  const [showError, setShowError] = useState<boolean>(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isRunning) {
      timer = setInterval(() => {
        setTimeElapsed((prev) => {
          const newTime = parseFloat((prev + 0.01).toFixed(2));

          // Show error at 10 to 15 seconds
          if (newTime >= 100 && newTime < 105) {
            setShowError(true);
            // Hide error after 5 seconds
            setTimeout(() => {
              setShowError(false);
            }, 5000);
          }

          return newTime;
        });
      }, 10);
    }

    return () => clearInterval(timer);
  }, [isRunning]);

  const startGame = () => {
    setTimeElapsed(0);
    setIsRunning(true);
    setResult(null);
    setRaindrops([]);
    
    setShowError(false);
  };

  const stopGame = () => {
    if (timeElapsed > targetTime-10 && clickCount < btn_running_times) { // btn is running  x times
      setClickCount(clickCount + 1);
  
      const timer_btn = document.querySelector('.timer_btn') as HTMLElement;
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
  
      const randomTop = Math.floor(Math.random() * (windowHeight - timer_btn.offsetHeight));
      const randomLeft = Math.floor(Math.random() * (windowWidth - timer_btn.offsetWidth));
  
      timer_btn.style.position = 'absolute';
      timer_btn.style.top = `${randomTop}px`;
      timer_btn.style.left = `${randomLeft}px`;
      timer_btn.style.transition = 'top 0.5s, left 0.5s';
      return
    }
    setClickCount(0);
    setIsRunning(false);
    const timer_btn = document.querySelector('.timer_btn') as HTMLElement;
    timer_btn.style.position = 'unset';
    const difference = Math.abs(timeElapsed).toFixed(2);

    // ตรวจสอบว่าเวลาหยุดตรงกับที่ตั้งไว้ใน env หรือไม่
    if (Math.abs(timeElapsed - targetTime) < 0.5) {
      setResult(`ยินดีด้วย! คุณได้รับตั๋ว! รหัสตั๋วของคุณคือ: ${ticketCode}`);
    } else {
      setResult(`คุณหยุดที่ ${difference} วินาที!`);
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
            ถ้าอยากได้บัตรก็หยุดเวลาให้ได้ {targetTime} วินาทีสิ อิอิอิ
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

          <button
            onClick={isRunning ? stopGame : startGame}
            className="px-8 py-4 bg-blue-500 text-white text-lg rounded-lg hover:bg-blue-700 transition duration-200 shadow-lg timer_btn"
          >
            {isRunning ? "หยุดเวลา!" : "เริ่มเกมใหม่"}
          </button>
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
