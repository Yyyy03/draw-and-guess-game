import DrawingCanvas from "@/components/DrawingCanvas";
import GameInfo from "@/components/GameInfo";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
        🎨 你画我猜 AI 版
      </h1>
      <p className="text-white mb-6 text-lg drop-shadow">
        在画布上画出物体，AI 会猜你画的是什么！
      </p>
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <DrawingCanvas />
        <GameInfo />
      </div>
    </main>
  );
}
