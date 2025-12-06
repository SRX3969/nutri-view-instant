import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64, mode, query, mealItems } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Handle different modes
    if (mode === "search") {
      return await handleSearch(query, LOVABLE_API_KEY);
    } else if (mode === "build") {
      return await handleBuildMeal(mealItems, LOVABLE_API_KEY);
    } else if (mode === "compare") {
      return await handleCompare(query, LOVABLE_API_KEY);
    } else {
      // Default: image analysis
      if (!imageBase64) {
        return new Response(
          JSON.stringify({ error: "Image data is required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      return await handleImageAnalysis(imageBase64, LOVABLE_API_KEY);
    }
  } catch (error) {
    console.error("Error in analyze-nutrition:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "An unexpected error occurred" 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

async function handleImageAnalysis(imageBase64: string, apiKey: string) {
  console.log("Analyzing Indian meal image with Lovable AI...");

  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze this meal image with special focus on Indian foods. Detect all food items including:
- Indian dishes: idli, dosa, poha, upma, roti, chapati, paratha, naan, biryani, pulao, dal, rajma, chole, paneer dishes, curries, sambar, rasam, sabji, puri, bhaji, vada, pakoda, samosa, chaat, pav bhaji, thali items, sweets like ladoo, jalebi, gulab jamun, halwa, kheer, etc.
- Estimate portions in Indian style: "1 roti", "1 katori", "1 plate", "½ cup", "1 ladle", "1 piece", etc.
- Identify individual ingredients and cooking methods (fried, grilled, steamed, etc.)
- Detect multiple items on thali plates
Be very accurate with portion sizes and nutritional values for Indian cooking styles (oil, ghee, spices usage).`
            },
            {
              type: "image_url",
              image_url: {
                url: imageBase64
              }
            }
          ]
        }
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "provide_indian_nutrition_data",
            description: "Provide detailed nutrition analysis for Indian meals",
            parameters: {
              type: "object",
              properties: {
                calories: {
                  type: "number",
                  description: "Total calories in kcal"
                },
                protein: {
                  type: "number",
                  description: "Protein in grams"
                },
                carbs: {
                  type: "number",
                  description: "Carbohydrates in grams"
                },
                fat: {
                  type: "number",
                  description: "Fat in grams"
                },
                fiber: {
                  type: "number",
                  description: "Fiber in grams"
                },
                sugar: {
                  type: "number",
                  description: "Sugar in grams"
                },
                sodium: {
                  type: "number",
                  description: "Sodium in mg"
                },
                servingSize: {
                  type: "string",
                  description: "Estimated serving size in Indian portions (e.g., '2 rotis + 1 katori dal')"
                },
                foodType: {
                  type: "string",
                  description: "Brief description of the meal (e.g., 'North Indian Thali')"
                },
                detectedItems: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      name: { type: "string" },
                      portion: { type: "string" },
                      calories: { type: "number" },
                      ingredients: { type: "string" }
                    }
                  },
                  description: "List of detected food items with portions and calories"
                },
                nutritionScore: {
                  type: "string",
                  enum: ["A+", "A", "B+", "B", "C", "D"],
                  description: "Overall nutrition score from A+ (healthiest) to D"
                },
                warnings: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      type: { 
                        type: "string",
                        enum: ["high-oil", "high-sugar", "deep-fried", "high-sodium", "high-ghee", "processed"]
                      },
                      message: { type: "string" }
                    }
                  },
                  description: "Health warnings for the meal"
                },
                recommendations: {
                  type: "array",
                  items: { type: "string" },
                  description: "Healthier Indian alternatives and personalized recommendations"
                },
                tips: {
                  type: "array",
                  items: { type: "string" },
                  description: "3-5 nutrition insights about this meal"
                },
                vitamins: {
                  type: "object",
                  properties: {
                    vitaminA: { type: "number" },
                    vitaminC: { type: "number" },
                    vitaminD: { type: "number" },
                    vitaminB12: { type: "number" },
                    iron: { type: "number" },
                    calcium: { type: "number" }
                  },
                  description: "Key vitamins and minerals as percentage of daily value"
                }
              },
              required: ["calories", "protein", "carbs", "fat", "servingSize", "foodType", "detectedItems", "nutritionScore", "warnings", "recommendations", "tips"],
              additionalProperties: false
            }
          }
        }
      ],
      tool_choice: {
        type: "function",
        function: { name: "provide_indian_nutrition_data" }
      }
    }),
  });

  return await handleAIResponse(response);
}

async function handleSearch(query: string, apiKey: string) {
  console.log("Searching Indian food database:", query);

  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        {
          role: "user",
          content: `Provide detailed nutritional information for the Indian food: "${query}". 
Include regional variations (North Indian, South Indian, Gujarati, Bengali, Maharashtrian, Rajasthani, Punjabi).
Consider common Indian portion sizes (1 roti, 1 katori, 1 plate, 100g, 1 piece).
Include street foods, homemade dishes, and packaged Indian brands if relevant.
Provide ingredient breakdown and cooking method impact on nutrition.`
        }
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "provide_food_search_result",
            description: "Provide detailed nutrition for searched Indian food",
            parameters: {
              type: "object",
              properties: {
                name: { type: "string" },
                description: { type: "string" },
                calories: { type: "number" },
                protein: { type: "number" },
                carbs: { type: "number" },
                fat: { type: "number" },
                fiber: { type: "number" },
                sugar: { type: "number" },
                sodium: { type: "number" },
                defaultPortion: { type: "string" },
                portionOptions: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      label: { type: "string" },
                      multiplier: { type: "number" }
                    }
                  }
                },
                ingredients: { type: "string" },
                cookingMethod: { type: "string" },
                region: { type: "string" },
                category: { type: "string" },
                nutritionScore: { type: "string" },
                warnings: {
                  type: "array",
                  items: { type: "string" }
                },
                recommendations: {
                  type: "array",
                  items: { type: "string" }
                },
                vitamins: {
                  type: "object",
                  properties: {
                    vitaminA: { type: "number" },
                    vitaminC: { type: "number" },
                    iron: { type: "number" },
                    calcium: { type: "number" }
                  }
                },
                relatedFoods: {
                  type: "array",
                  items: { type: "string" }
                }
              },
              required: ["name", "description", "calories", "protein", "carbs", "fat", "defaultPortion", "portionOptions", "nutritionScore"],
              additionalProperties: false
            }
          }
        }
      ],
      tool_choice: {
        type: "function",
        function: { name: "provide_food_search_result" }
      }
    }),
  });

  return await handleAIResponse(response);
}

async function handleBuildMeal(mealItems: string[], apiKey: string) {
  console.log("Building meal from items:", mealItems);

  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        {
          role: "user",
          content: `Calculate the total nutrition for this Indian meal combination: ${mealItems.join(", ")}.
Parse each item for portion size (e.g., "2 rotis", "1 katori dal").
Provide individual item nutrition and total meal nutrition.
Give a detailed review of the meal balance and suggestions for improvement.`
        }
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "provide_meal_builder_result",
            description: "Provide total nutrition for built meal",
            parameters: {
              type: "object",
              properties: {
                items: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      name: { type: "string" },
                      portion: { type: "string" },
                      calories: { type: "number" },
                      protein: { type: "number" },
                      carbs: { type: "number" },
                      fat: { type: "number" }
                    }
                  }
                },
                totalCalories: { type: "number" },
                totalProtein: { type: "number" },
                totalCarbs: { type: "number" },
                totalFat: { type: "number" },
                totalFiber: { type: "number" },
                nutritionScore: { type: "string" },
                warnings: {
                  type: "array",
                  items: { type: "string" }
                },
                recommendations: {
                  type: "array",
                  items: { type: "string" }
                },
                mealReview: { type: "string" },
                vitamins: {
                  type: "object",
                  properties: {
                    vitaminA: { type: "number" },
                    vitaminC: { type: "number" },
                    iron: { type: "number" },
                    calcium: { type: "number" }
                  }
                }
              },
              required: ["items", "totalCalories", "totalProtein", "totalCarbs", "totalFat", "nutritionScore", "mealReview"],
              additionalProperties: false
            }
          }
        }
      ],
      tool_choice: {
        type: "function",
        function: { name: "provide_meal_builder_result" }
      }
    }),
  });

  return await handleAIResponse(response);
}

async function handleCompare(query: string, apiKey: string) {
  console.log("Comparing foods:", query);

  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        {
          role: "user",
          content: `Compare these two Indian foods nutritionally: ${query}.
Provide a detailed side-by-side comparison of calories, macros, vitamins, and health impact.
Consider typical Indian portion sizes and cooking methods.
Recommend which is healthier and why.`
        }
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "provide_food_comparison",
            description: "Compare two foods nutritionally",
            parameters: {
              type: "object",
              properties: {
                food1: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    portion: { type: "string" },
                    calories: { type: "number" },
                    protein: { type: "number" },
                    carbs: { type: "number" },
                    fat: { type: "number" },
                    fiber: { type: "number" },
                    nutritionScore: { type: "string" },
                    pros: { type: "array", items: { type: "string" } },
                    cons: { type: "array", items: { type: "string" } }
                  }
                },
                food2: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    portion: { type: "string" },
                    calories: { type: "number" },
                    protein: { type: "number" },
                    carbs: { type: "number" },
                    fat: { type: "number" },
                    fiber: { type: "number" },
                    nutritionScore: { type: "string" },
                    pros: { type: "array", items: { type: "string" } },
                    cons: { type: "array", items: { type: "string" } }
                  }
                },
                winner: { type: "string" },
                verdict: { type: "string" },
                recommendations: {
                  type: "array",
                  items: { type: "string" }
                }
              },
              required: ["food1", "food2", "winner", "verdict"],
              additionalProperties: false
            }
          }
        }
      ],
      tool_choice: {
        type: "function",
        function: { name: "provide_food_comparison" }
      }
    }),
  });

  return await handleAIResponse(response);
}

async function handleAIResponse(response: Response) {
  if (!response.ok) {
    const errorText = await response.text();
    console.error("Lovable AI error:", response.status, errorText);
    
    if (response.status === 429) {
      return new Response(
        JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    if (response.status === 402) {
      return new Response(
        JSON.stringify({ error: "AI credits depleted. Please add more credits to continue." }),
        { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Failed to analyze" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const data = await response.json();
  console.log("AI Response received");

  const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
  if (!toolCall || !toolCall.function?.arguments) {
    console.error("No tool call in response:", JSON.stringify(data));
    return new Response(
      JSON.stringify({ error: "Failed to extract data" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const resultData = JSON.parse(toolCall.function.arguments);
  console.log("Analysis complete");

  return new Response(
    JSON.stringify(resultData),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}
