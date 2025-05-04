import { BACKEND_URL } from "./constants";

export interface QuoteRequest {
  material: string;
  quantity: number;
  complexity: number;
}

export interface QuoteResponse {
  quote: number;
}

/**
 * Generate a fallback quote estimate using heuristics.
 */
function generateMockQuote(
  material: string,
  quantity: number,
  complexity: number
): number {
  const normalized = material.toLowerCase();
  let basePrice = 75;

  if (normalized.includes("steel") || normalized.includes("iron")) {
    basePrice = 50;
  } else if (normalized.includes("aluminum") || normalized.includes("aluminium")) {
    basePrice = 65;
  } else if (normalized.includes("copper") || normalized.includes("brass")) {
    basePrice = 95;
  } else if (normalized.includes("titanium")) {
    basePrice = 150;
  } else if (
    normalized.includes("plastic") ||
    normalized.includes("pla") ||
    normalized.includes("abs")
  ) {
    basePrice = 30;
  }

  const quantityMultiplier =
    quantity >= 100 ? 0.7 :
    quantity >= 50 ? 0.8 :
    quantity >= 20 ? 0.9 : 1.0;

  const baseQuote = basePrice * quantity * complexity * quantityMultiplier;
  const variation = 0.95 + Math.random() * 0.1;

  return Math.max(50, Math.round(baseQuote * variation * 100) / 100);
}

/**
 * Attempts to fetch a quote from the backend ML model.
 * Falls back to local estimate on failure or timeout.
 */
export async function fetchQuote(
  material: string,
  quantity: number,
  complexity: number
): Promise<QuoteResponse> {
  const timeoutMs = 7000;

  const timeoutPromise = new Promise<QuoteResponse>((resolve) => {
    setTimeout(() => {
      console.warn("⚠️ Backend timeout: falling back to mock quote");
      resolve({ quote: generateMockQuote(material, quantity, complexity) });
    }, timeoutMs);
  });

  const fetchPromise = new Promise<QuoteResponse>(async (resolve, reject) => {
    try {
      const res = await fetch(`${BACKEND_URL}/predict-quote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        mode: "cors",
        credentials: "same-origin",
        body: JSON.stringify({ material, quantity, complexity }),
      });

      if (!res.ok) {
        const errorText = await res.text().catch(() => "Unknown error");
        throw new Error(`Quote API error (${res.status}): ${errorText}`);
      }

      const data = await res.json();
      if (!data?.quote || typeof data.quote !== "number") {
        throw new Error("Invalid API response: missing quote");
      }

      resolve({ quote: Math.round(data.quote * 100) / 100 });
    } catch (err) {
      reject(err);
    }
  });

  try {
    return await Promise.race([fetchPromise, timeoutPromise]);
  } catch (err) {
    console.error("🛑 Quote fetch failed, using fallback:", err);
    return { quote: generateMockQuote(material, quantity, complexity) };
  }
}
