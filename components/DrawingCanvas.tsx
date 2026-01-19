"use client";

import React, { useRef, useState, useEffect } from "react";

interface DrawingPoint {
  x: number;
  y: number;
}

export default function DrawingCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentTool, setCurrentTool] = useState<"pen" | "eraser">("pen");
  const [brushSize, setBrushSize] = useState(5);
  const [color, setColor] = useState("#000000");
  const [lastPoint, setLastPoint] = useState<DrawingPoint | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [guess, setGuess] = useState<string>("");
  const [confidence, setConfidence] = useState<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
      }
    }
  }, []);

  const getCanvasCoordinates = (
    e: React.MouseEvent | React.TouchEvent
  ): DrawingPoint => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX: number, clientY: number;

    if ("touches" in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDrawing(true);
    const point = getCanvasCoordinates(e);
    setLastPoint(point);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !lastPoint) return;
    e.preventDefault();

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const currentPoint = getCanvasCoordinates(e);

    ctx.beginPath();
    ctx.strokeStyle = currentTool === "eraser" ? "#ffffff" : color;
    ctx.lineWidth = brushSize;
    ctx.moveTo(lastPoint.x, lastPoint.y);
    ctx.lineTo(currentPoint.x, currentPoint.y);
    ctx.stroke();

    setLastPoint(currentPoint);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    setLastPoint(null);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (ctx && canvas) {
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      setGuess("");
      setConfidence(0);
    }
  };

  const getCanvasImage = (): string => {
    const canvas = canvasRef.current;
    if (canvas) {
      return canvas.toDataURL("image/png");
    }
    return "";
  };

  const submitToAI = async () => {
    setIsLoading(true);
    setGuess("");
    setConfidence(0);

    try {
      const imageData = getCanvasImage();
      const response = await fetch("/api/guess", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: imageData }),
      });

      const data = await response.json();

      if (data.success) {
        setGuess(data.guess);
        setConfidence(data.confidence);
      } else {
        setGuess("抱歉，识别失败了，请重试！");
        setConfidence(0);
      }
    } catch (error) {
      console.error("API call failed:", error);
      setGuess("网络错误，请重试！");
      setConfidence(0);
    } finally {
      setIsLoading(false);
    }
  };

  const tools = [
    { name: "pen", label: "🖊️ 画笔", icon: "✏️" },
    { name: "eraser", label: "🧹 橡皮", icon: "🧼" },
  ];

  const colors = [
    "#000000",
    "#FF0000",
    "#00FF00",
    "#0000FF",
    "#FFFF00",
    "#FF00FF",
    "#00FFFF",
    "#FFA500",
  ];

  const sizes = [2, 5, 10, 15, 20];

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-6">
      <div className="mb-4 flex flex-wrap gap-2 items-center justify-between">
        <div className="flex gap-2">
          {tools.map((tool) => (
            <button
              key={tool.name}
              onClick={() => setCurrentTool(tool.name as "pen" | "eraser")}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                currentTool === tool.name
                  ? "bg-blue-500 text-white shadow-lg transform scale-105"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {tool.label}
            </button>
          ))}
        </div>

        <div className="flex gap-2 items-center">
          <span className="text-sm text-gray-600">大小:</span>
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => setBrushSize(size)}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                brushSize === size
                  ? "bg-blue-500 text-white shadow-lg transform scale-110"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
              style={{ width: `${size + 15}px`, height: `${size + 15}px` }}
            >
              <div
                className="rounded-full bg-current"
                style={{ width: size, height: size }}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4 flex gap-2 flex-wrap items-center">
        <span className="text-sm text-gray-600">颜色:</span>
        {colors.map((c) => (
          <button
            key={c}
            onClick={() => setColor(c)}
            className={`w-8 h-8 rounded-full border-2 transition-all ${
              color === c
                ? "border-blue-500 shadow-lg transform scale-110"
                : "border-gray-200 hover:scale-105"
            }`}
            style={{ backgroundColor: c }}
          />
        ))}
      </div>

      <div className="relative">
        <canvas
          ref={canvasRef}
          width={500}
          height={400}
          className="border-2 border-gray-300 rounded-lg cursor-crosshair touch-none bg-white"
          style={{ maxWidth: "100%", height: "auto" }}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>

      <div className="mt-4 flex gap-3">
        <button
          onClick={clearCanvas}
          className="flex-1 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors shadow-lg"
        >
          🗑️ 清空画布
        </button>
        <button
          onClick={submitToAI}
          disabled={isLoading}
          className={`flex-1 py-3 rounded-lg font-medium transition-all shadow-lg ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-green-400 to-blue-500 text-white hover:from-green-500 hover:to-blue-600 transform hover:scale-105"
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-5 w-5"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              AI 思考中...
            </span>
          ) : (
            "🤖 AI 猜测"
          )}
        </button>
      </div>

      {guess && (
        <div className="mt-4 p-4 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl border-2 border-yellow-300">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🤖</span>
            <span className="font-bold text-lg text-gray-800">AI 猜测结果:</span>
          </div>
          <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
            {guess}
          </div>
          {confidence > 0 && (
            <div className="mt-2">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>置信度</span>
                <span>{Math.round(confidence * 100)}%</span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-500"
                  style={{ width: `${confidence * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
