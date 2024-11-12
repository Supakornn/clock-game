"use client";

import { useState, useEffect } from "react";

// Helper function to generate a random number
const getRandomNumber = () => (Math.random() * 100).toFixed(0);

export default function Home() {
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [result, setResult] = useState<string | null>(null);
  const [raindrops, setRaindrops] = useState<any[]>([]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning) {
      timer = setInterval(() => {
        setTimeElapsed((prev) => prev + 0.01);
      }, 10);
    }
    return () => clearInterval(timer);
  }, [isRunning]);

  const startGame = () => {
    setTimeElapsed(0);
    setIsRunning(true);
    setResult(null);
    setRaindrops([]); // Reset raindrops on game start
  };

  const stopGame = () => {
    setIsRunning(false);
    const difference = Math.abs(timeElapsed).toFixed(2);
    setResult(`คุณหยุดที่ ${difference} วินาที!`);
  };

  const generateRaindrop = () => {
    setRaindrops((prev) => {
      // Limit the number of raindrops
      if (prev.length >= 50) return prev;
      return [
        ...prev,
        {
          number: getRandomNumber(),
          left: Math.random() * 100,  // Random horizontal position
          animationDelay: Math.random() * .001 + 's', // Random delay for falling
          animationDuration: Math.random() * 3 + 2 + 's', // Random speed of falling
        }
      ];
    });
  };

  useEffect(() => {
    // Add raindrops every 200ms
    const interval = setInterval(generateRaindrop, 200);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Remove raindrops when they are out of the screen
    const interval = setInterval(() => {
      setRaindrops((prev) => prev.filter((drop) => drop.animationDuration !== "0s"));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 relative overflow-hidden">
      <div className="text-center z-10">
        <h1 className="text-3xl font-bold mb-4">จับเวลา</h1>
        <p className="mb-4">หยุดเวลาให้ได้ 50.00 วินาที!</p>
        <div className="glitch-wrapper">
          <div className="glitch text-6xl font-semibold mb-4" data-text={timeElapsed.toFixed(2)}> {timeElapsed.toFixed(2)} วินาที</div>
        </div>
        <button
          onClick={isRunning ? stopGame : startGame}
          className="px-6 py-3 bg-blue-500 text-white text-lg rounded-lg hover:bg-blue-700 transition duration-200"
        >
          {isRunning ? "หยุดเวลา!" : "เริ่มเกมใหม่"}
        </button>
        {result && <p className="mt-4 text-xl text-green-600">{result}</p>}
      </div>

      {/* Raindrops */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        {raindrops.map((drop, index) => (
          <div
            key={index}
            className="falling-number absolute text-8xl font-semibold text-[000]"
            style={{
              left: `${drop.left}vw`,
              animation: `fall ${drop.animationDuration} linear infinite`,
              animationDelay: drop.animationDelay,
            }}
          >
            {drop.number}
          </div>
        ))}
      </div>

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
