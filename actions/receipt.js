"use server";

import { auth } from "@clerk/nextjs/server";

export async function scanReceipt(file) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return {
        success: false,
        error: "Authentication required"
      };
    }

    if (!process.env.GEMINI_API_KEY) {
      return {
        success: false,
        error: "GEMINI_API_KEY environment variable is not set"
      };
    }

    // Convert file to base64
    const fileBuffer = await file.arrayBuffer();
    const fileBase64 = Buffer.from(fileBuffer).toString("base64");

    // Determine MIME type
    let mimeType;
    switch (file.type) {
      case "image/jpeg":
        mimeType = "image/jpeg";
        break;
      case "image/png":
        mimeType = "image/png";
        break;
      case "image/webp":
        mimeType = "image/webp";
        break;
      default:
        return {
          success: false,
          error: "Only JPEG, PNG, and WebP images are supported"
        };
    }

    // Use gemini-2.5-flash - stable multimodal model
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [
            {
              text: `Analyze this receipt and extract: merchant name, total amount, date (YYYY-MM-DD), and category (food/groceries/shopping/entertainment/transportation/utilities/health/education/travel/other). Return only JSON: {"merchant":"name","amount":123.45,"date":"2024-01-01","category":"food"}`
            },
            {
              inline_data: {
                mime_type: mimeType,
                data: fileBase64
              }
            }
          ]
        }],
        generation_config: {
          temperature: 0.1,
          max_output_tokens: 1024
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("API Error:", errorData);

      if (response.status === 400) {
        return {
          success: false,
          error: "Invalid request. Please try a different image."
        };
      }

      if (response.status === 403) {
        return {
          success: false,
          error: "Invalid API key. Please check your Gemini API key."
        };
      }

      return {
        success: false,
        error: `API Error: ${errorData.error?.message || 'Unknown error'}`
      };
    }

    const data = await response.json();
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!responseText) {
      return {
        success: false,
        error: "No response from AI. Please try a clearer image."
      };
    }

    // Parse JSON from response
    let extractedData;
    try {
      const jsonMatch = responseText.match(/\{[^}]*\}/);
      if (jsonMatch) {
        extractedData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found");
      }
    } catch (error) {
      return {
        success: false,
        error: "Could not extract data from receipt. Please try a clearer image."
      };
    }

    // Return formatted data
    return {
      success: true,
      data: {
        description: extractedData.merchant || "Receipt purchase",
        amount: parseFloat(extractedData.amount) || 0,
        date: extractedData.date || new Date().toISOString().split('T')[0],
        category: extractedData.category || "other",
        type: "EXPENSE",
        note: "Scanned from receipt"
      }
    };

  } catch (error) {
    console.error("Receipt scanning error:", error);
    return {
      success: false,
      error: "Failed to scan receipt. Please try again."
    };
  }
}