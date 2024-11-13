"use client";

import { useState, useEffect } from "react";

// Helper function to generate a random number
const getRandomNumber = () => (Math.random() * 100).toFixed(0);

export default function Home() {
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [result, setResult] = useState<string | null>(null);
  const [raindrops, setRaindrops] = useState<any[]>([]);
  const [timerPosition, setTimerPosition] = useState({ top: "50%", left: "50%" });
  let [clickCount,setClickCount] = useState<number>(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isRunning) {
      timer = setInterval(() => {
        setTimeElapsed((prev) => parseFloat((prev + 0.01).toFixed(2)));
      }, 10);
    }
    return () => clearInterval(timer);
  }, [isRunning]);

  const startGame = () => {
    setTimeElapsed(0);
    setIsRunning(true);
    setResult(null);
    setRaindrops([]);
    
  };

  const stopGame = () => {
    if (timeElapsed > 120 && clickCount < 10) { // btn is running  x times
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
    const difference = Math.abs(timeElapsed).toFixed(2);
    setResult(`คุณหยุดที่ ${difference} วินาที!`);
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

  // Move the timer position every 1.5 seconds
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 relative overflow-hidden">
      <div className="text-center z-10 space-y-6">
        <h1 className="text-5xl font-bold mb-2">
          Stupid Hackathon <span className="text-orange-400">KMUTT</span>
        </h1>
        <p className="text-2xl mb-6">ถ้าอยากได้บัตรก็หยุดเวลาให้ได้ 133.XX วินาทีสิ อิอิอิ</p>
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
            <div className="glitch text-6xl font-semibold mb-6" data-text={timeElapsed.toFixed(2)}>
              {timeElapsed.toFixed(2)} วินาที
            </div>
          </div>
        )}

        <button
          onClick={isRunning ? stopGame : startGame}
          className="px-8 py-4 bg-blue-500 text-white text-lg rounded-lg hover:bg-blue-700 transition duration-200 shadow-lg"
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
      {/* CSS for raindrop effect */}
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
  );
}
