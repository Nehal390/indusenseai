import { GoogleGenAI } from '@google/genai';

let aiInstance: GoogleGenAI | null = null;

function getAI(): GoogleGenAI | null {
  if (process.env.GEMINI_API_KEY) {
    if (!aiInstance) {
      aiInstance = new GoogleGenAI({});
    }
    return aiInstance;
  }
  return null;
}

export async function handleCopilotRequest(body: { message: string; context?: any }): Promise<{ reply: string }> {
  const { message, context } = body;
  const ai = getAI();

  if (ai) {
    try {
      const prompt = `You are InduSense Copilot, an elite industrial engineering, equipment catalog intelligence, and MRO procurement AI assistant.
Application Scope: InduSense AI manages industrial machinery catalogs, technical specifications (bearings, motors, pumps, sensors, valves, pneumatic actuators), DIN/ISO standards, multi-supplier duplicate SKU deduplication, quality health scoring, and engineering product sizing.

Context:
Active Dataset: ${context?.activeDatasetName || 'Industrial Master Catalog'}
Total SKUs in Catalog: ${context?.productCount || 14}
Active Selected Product: ${context?.activeProduct ? JSON.stringify(context.activeProduct) : 'None'}
Compared Products: ${context?.comparedProducts ? JSON.stringify(context.comparedProducts) : 'None'}

User Prompt: "${message}"

CORE DIRECTIVES & DOMAIN BOUNDARIES:
1. DOMAIN RELEVANCE CHECK:
   - If the user's prompt is off-topic, general chitchat, non-industrial, or unrelated to equipment engineering, catalog data, industrial manufacturing, mechanical/electrical parts, MRO procurement, duplicate auditing, or the InduSense application (e.g. general trivia, recipes, movies, weather, politics, jokes, gaming, personal questions, arbitrary code unrelated to engineering):
     YOU MUST POLITELY DECLINE.
     Response format for irrelevant queries:
     "⚠️ **Out of Scope Query**\n\nI am specialized exclusively as the **InduSense Industrial Catalog & Engineering Copilot**. Please ask questions with respect to your industrial equipment catalog, technical specifications, duplicate resolution, or procurement sizing.\n\n*Here are a few things you can ask me about:*\n• *\"Which motors in the catalog meet IE4 efficiency standards?\"*\n• *\"Identify duplicate bearing SKUs across conflicting vendor feeds.\"*\n• *\"Find IP67-rated vibration sensors with IO-Link connectivity.\"*\n• *\"Compare high-pressure centrifugal pumps under $3,500.\"*"

2. RELEVANT INDUSTRIAL QUESTIONS:
   - If the question is relevant to industrial components, catalog records, deduplication, specs (voltage, RPM, torque, pressure, bore diameter, ingress protection IP rating, ISO/DIN standards), replacements, or data cleanup:
     Answer authoritatively with crisp engineering depth and concise bullet points. Reference specific catalog items when applicable.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
      });

      if (response.text) {
        return { reply: response.text };
      }
    } catch (e: any) {
      console.warn('Gemini API call failed, using deterministic fallback:', e.message);
    }
  }

  // Fallback reasoning
  return {
    reply: `I analyzed your query: "${message}". In this industrial catalog (${context?.activeDatasetName || 'Active Catalog'}), high-performance components like Siemens SIMOTICS motors and SKF Explorer spherical bearings offer compliant DIN/ISO specifications and minimal vibration profiles.`,
  };
}

export async function handleSearchRequest(body: { query: string; products: any[] }): Promise<any> {
  const { query, products } = body;
  const ai = getAI();
  const normalizedQuery = (query || '').toLowerCase().trim();

  // Basic check for obvious out-of-domain queries
  const industrialKeywords = [
    'bearing', 'motor', 'pump', 'sensor', 'hydraulic', 'pneumatic', 'speed', 'rpm', 'kw', 'hp', 
    'pressure', 'bar', 'flow', 'valve', 'seal', 'skf', 'siemens', 'abb', 'danfoss', 'flowserve', 
    'ifm', 'eaton', 'rexroth', 'parker', 'flange', 'torque', 'voltage', 'ip55', 'ip66', 'atex', 
    'ie3', 'ie4', 'temperature', 'vibration', 'inverter', 'shaft', 'roller', 'gear', 'catalog', 
    'sku', 'spec', 'diameter', 'dimension', 'mm', 'stainless', 'cast iron', 'incomplete', 'missing'
  ];

  const hasAnyIndustrialTerm = industrialKeywords.some(k => normalizedQuery.includes(k)) || /\d+\s*(rpm|kw|hp|bar|mm|v|nm|gpm|hz)/i.test(normalizedQuery);

  if (ai) {
    try {
      const prompt = `You are InduSense AI Industrial Catalog Search Engine.
Catalog items available: ${JSON.stringify((products || []).slice(0, 15).map(p => ({
  id: p.id,
  name: p.cleanName,
  category: p.category,
  manufacturer: p.manufacturer,
  specs: p.normalizedSpecs,
  raw: p.rawDescription
})))}

User Search Query: "${query}"

Instructions:
1. Determine if this search query is related to industrial machinery, mechanical/electrical engineering components, industrial sensors, pumps, bearings, motors, specifications, or catalog equipment.
2. If the query is completely unrelated or unfamiliar to industrial engineering (for example "can u tell escape plan", "tell me a joke", "recipe for pizza", "who won the game", "escape room"):
   Return JSON:
   {
     "isUnfamiliarQuery": true,
     "explanation": "No industrial components or engineering specifications match this query.",
     "results": []
   }
3. If the query is industrial/engineering related:
   Score matching products from 60 to 99 based on true relevance. Only include products that actually match the criteria.
   Return JSON:
   {
     "isUnfamiliarQuery": false,
     "results": [
       {
         "productId": "id",
         "similarityScore": 92,
         "matchReason": "Clear engineering explanation of the match",
         "matchedAttributes": ["Spec 1", "Spec 2"]
       }
     ]
   }`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' },
      });

      if (response.text) {
        const parsed = JSON.parse(response.text);
        if (parsed.isUnfamiliarQuery || (!parsed.results || parsed.results.length === 0)) {
          return {
            isUnfamiliarQuery: true,
            explanation: parsed.explanation || `No industrial equipment in your active catalog matches "${query}".`,
            results: [],
          };
        }

        const hydrated = parsed.results.map((r: any) => {
          const prod = products.find(p => p.id === r.productId);
          if (!prod) return null;
          return {
            product: prod,
            similarityScore: r.similarityScore || 85,
            matchReason: r.matchReason || 'Semantic catalog match',
            matchedAttributes: r.matchedAttributes || [prod.category],
          };
        }).filter(Boolean);

        return {
          isUnfamiliarQuery: hydrated.length === 0,
          results: hydrated,
        };
      }
    } catch (e: any) {
      console.warn('Gemini search call failed, falling back to local heuristic:', e.message);
    }
  }

  // If no AI key or offline, check term overlap strictly
  if (!hasAnyIndustrialTerm) {
    return {
      isUnfamiliarQuery: true,
      explanation: `No industrial components match "${query}". InduSense indexes engineering specifications, motors, bearings, pumps, sensors, and DIN/ISO catalog parts.`,
      results: [],
    };
  }

  return { isUnfamiliarQuery: false, results: [] };
}

export async function handleRecommendationRequest(body: { query: string; products: any[] }): Promise<any> {
  const { query, products } = body;
  const ai = getAI();

  if (ai && products && products.length > 0) {
    try {
      const prompt = `You are InduSense AI Recommendation Engine.
Catalog items available: ${JSON.stringify(products.slice(0, 10).map(p => ({ id: p.id, name: p.cleanName, specs: p.normalizedSpecs, price: p.price })))}

User Requirement: "${query}"

Return JSON matching:
{
  "bestMatchId": "id_of_best_product",
  "matchScore": 96,
  "confidence": 98,
  "reason": "Detailed explainable reason why this fits the operational constraints",
  "tradeOffs": ["Tradeoff 1", "Tradeoff 2"],
  "recommendedOperatingEnvelope": "Recommended duty cycle and environment parameters"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' },
      });

      if (response.text) {
        const parsed = JSON.parse(response.text);
        const bestMatch = products.find(p => p.id === parsed.bestMatchId) || products[0];
        return {
          recommendation: {
            id: `rec-${Date.now()}`,
            requirementQuery: query,
            bestMatch,
            matchScore: parsed.matchScore || 95,
            confidence: parsed.confidence || 96,
            reason: parsed.reason || `Optimal candidate based on technical spec compliance.`,
            tradeOffs: parsed.tradeOffs || ['Standard installation calibration required'],
            recommendedOperatingEnvelope: parsed.recommendedOperatingEnvelope || 'Continuous S1 industrial duty.',
            directAlternatives: products.filter(p => p.id !== bestMatch.id).slice(0, 2).map(alt => ({
              product: alt,
              whyConsider: 'Alternative OEM supply chain footprint',
              tradeOff: `Price delta of $${Math.abs(alt.price - bestMatch.price)}`,
              priceDeltaPercentage: Math.round(((alt.price - bestMatch.price) / bestMatch.price) * 100),
            })),
            lifecycleCostRating: 'Moderate',
          },
        };
      }
    } catch (e: any) {
      console.warn('Gemini recommendation call failed:', e.message);
    }
  }

  return { recommendation: null };
}
