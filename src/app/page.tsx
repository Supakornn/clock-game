"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning) {
      timer = setInterval(() => {
        setTimeElapsed((prev) => prev + 0.1);
      }, 100);
    }
    return () => clearInterval(timer);
  }, [isRunning]);

  const startGame = () => {
    setTimeElapsed(0);
    setIsRunning(true);
    setResult(null);
  };

  const stopGame = () => {
    setIsRunning(false);
    const difference = Math.abs(timeElapsed).toFixed(2);
    setResult(`คุณหยุดที่ ${difference} วินาที!`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">จับเวลา</h1>
        <p className="mb-4">หยุดเวลาให้ได้ 5.00 วินาที!</p>
        <h2 className="text-6xl font-semibold mb-4">{timeElapsed.toFixed(2)} วินาที</h2>
        <button
          onClick={isRunning ? stopGame : startGame}
          className="px-6 py-3 bg-blue-500 text-white text-lg rounded-lg hover:bg-blue-700 transition duration-200"
        >
          {isRunning ? "หยุดเวลา!" : "เริ่มเกมใหม่"}
        </button>
        {result && <p className="mt-4 text-xl text-green-600">{result}</p>}
      </div>
    </div>
  );
}
