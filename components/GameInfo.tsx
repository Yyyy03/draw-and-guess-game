import React from "react";

export default function GameInfo() {
  const tips = [
    {
      title: "🎨 绘画技巧",
      items: [
        "画出清晰的轮廓",
        "使用简单的几何形状",
        "添加关键细节",
        "保持画面整洁",
      ],
    },
    {
      title: "🤖 AI 如何识别",
      items: [
        "分析整体形状",
        "识别关键特征",
        "匹配已知物体",
        "给出最相似的结果",
      ],
    },
    {
      title: "💡 提示",
      items: [
        "可以画动物、水果、日常物品等",
        "越简单明确的物体越容易识别",
        "使用对比强烈的颜色效果更好",
      ],
    },
  ];

  const examples = ["🐱 猫咪", "🍎 苹果", "🚗 汽车", "🌞 太阳", "🏠 房子", "🎸 吉他"];

  return (
    <div className="bg-white/90 backdrop-blur rounded-2xl shadow-2xl p-6 max-w-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">📖 游戏说明</h2>

      <div className="space-y-4">
        {tips.map((section, index) => (
          <div key={index} className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-4 shadow-md">
            <h3 className="font-bold text-gray-700 mb-2">{section.title}</h3>
            <ul className="space-y-1">
              {section.items.map((item, idx) => (
                <li key={idx} className="flex items-center gap-2 text-gray-600 text-sm">
                  <span className="text-green-500">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl">
        <h3 className="font-bold text-gray-700 mb-3">🎯 推荐绘画主题</h3>
        <div className="flex flex-wrap gap-2">
          {examples.map((example, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-white rounded-full text-sm font-medium text-gray-700 shadow-sm hover:shadow-md transition-shadow"
            >
              {example}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-6 p-4 bg-yellow-50 rounded-xl border-2 border-yellow-200">
        <h3 className="font-bold text-yellow-800 mb-2">⚠️ 注意事项</h3>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• 请画出清晰可辨识的图案</li>
          <li>• 避免过于抽象或复杂的画作</li>
          <li>• 确保网络连接正常</li>
        </ul>
      </div>
    </div>
  );
}
