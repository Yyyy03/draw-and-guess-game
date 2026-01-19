import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { image } = body;

    if (!image) {
      return NextResponse.json(
        { success: false, error: "没有收到图片数据" },
        { status: 400 }
      );
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-1.5-flash";

    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        {
          success: false,
          error: "未配置 Gemini API Key，请设置环境变量 GEMINI_API_KEY",
        },
        { status: 500 }
      );
    }

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

    const prompt = `你正在玩一个"你画我猜"游戏。用户在你的画布上画了一个物体，你需要猜测这是什么。

请仔细观察图片，然后给出你认为最可能是什么物体的答案。

要求：
1. 只回答一个物体名称，不要描述或解释
2. 用中文回答
3. 给出最可能的答案
4. 如果不确定，可以说"看起来像X"

请直接给出答案，不要有其他文字。`;

    const requestBody = {
      contents: [
        {
          parts: [
            { text: prompt },
            {
              inline_data: {
                mime_type: "image/png",
                data: image.split(",")[1],
              },
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 50,
      },
    };

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Gemini API error:", errorData);
      return NextResponse.json(
        { success: false, error: `API 调用失败: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();

    if (data.candidates && data.candidates.length > 0) {
      const generatedText = data.candidates[0].content?.parts[0]?.text || "";
      const cleanGuess = generatedText.trim().replace(/[。.!?！]/g, "");

      return NextResponse.json({
        success: true,
        guess: cleanGuess,
        confidence: 0.85,
      });
    } else {
      return NextResponse.json(
        { success: false, error: "API 返回格式错误" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("API 处理错误:", error);
    return NextResponse.json(
      { success: false, error: "服务器内部错误" },
      { status: 500 }
    );
  }
}
