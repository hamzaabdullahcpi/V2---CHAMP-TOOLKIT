import { GoogleGenAI, Type, Schema } from "@google/genai";

const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is missing. If you've just deployed to GitHub, ensure you added the secret and re-ran the build.");
  }
  return new GoogleGenAI({ apiKey });
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function executeWithRetry<T>(fn: () => Promise<T>, maxRetries = 3, baseDelayMs = 1000): Promise<T> {
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      return await fn();
    } catch (error: any) {
      const is503 = error?.status === 503 || error?.message?.includes('503') || error?.message?.includes('high demand') || error?.message?.includes('UNAVAILABLE') || error?.message?.includes('temporarily overloaded');
      if (is503 && attempt < maxRetries - 1) {
        attempt++;
        const waitTime = baseDelayMs * Math.pow(2, attempt) + Math.random() * 500;
        console.warn(`Gemini API overloaded. Retrying attempt ${attempt}/${maxRetries} in ${Math.round(waitTime)}ms...`);
        await delay(waitTime);
      } else {
        throw error;
      }
    }
  }
  throw new Error("Failed after max retries");
}

const SYSTEM_INSTRUCTION = `You are an expert Multilevel Governance & Climate Finance Strategist based on the CHAMP initiative and the CCFLA/Urban-Act Enabling Framework Conditions. Your exclusive function is to analyze climate finance recommendations and map them to EXACT, real-world institutions in specific geographies.

STAKEHOLDER MAPPING & HYPER-LOCALIZATION RULES:
1. NO HALLUCINATIONS: You must only suggest real, verifiable institutions, ministries, banks, NGOs, and international bodies that actively operate in the requested geography. Do not invent names.
2. LOCAL NOMENCLATURE: You MUST use the official local names and established acronyms for institutions (e.g., "Department of Environment and Natural Resources (DENR)" or "Caixa Econômica Federal", not generic terms like "National Environment Agency").
3. ARCHETYPE COVERAGE: Your recommendations must span across the multilevel governance matrix. Always consider:
   - National level: Specific Ministries of Finance, Environment, or Urban Development.
   - Sub-national/City level: Specific municipal departments, regional coordination bodies, or mayoral offices.
   - International Partners: Explicitly include key international development partners, bilateral/multilateral agencies, and global networks operating at BOTH the national level (e.g., UNDP, World Bank, NDC Partnership) and the subnational/city level (e.g., UN-Habitat, ICLEI, C40, GCoM, or specific country-level programs by GIZ/USAID).
   - Financial level: Local National Development Banks (NDBs), active MDBs in that region, or specialized Project Preparation Facilities.
   - Non-State/Expert level: Prominent local climate NGOs and policy think tanks.
4. CONTEXTUAL ACCURACY: Account for fragmented governance. Only assign roles to entities that actually have jurisdiction over the specific target recommendation in that specific country.

TONE AND CONFIDENCE:
- Use precise, professional language. 
- Do not prescribe rigid, fictional mandates. Use phrasing like 'can facilitate', 'administers [X fund]', or 'holds jurisdiction over [Y]' based on actual institutional mandates.`;

export interface AiContextData {
  country?: string;
  city?: string;
  partnerType?: string;
}

export interface FileData {
  inlineData: {
    mimeType: string;
    data: string;
  }
}

export async function identifyStakeholders(
  recommendationPoints: string[],
  actor: string,
  contextData: AiContextData
): Promise<string[]> {
  const ai = getGeminiClient();
  const entityName = contextData.country 
    ? contextData.city ? `${contextData.city}, ${contextData.country}` : contextData.country
    : contextData.partnerType || "the entity";

  const targetRecommendation = recommendationPoints.join(' ');

  const prompt = `Actor: ${actor}
Country: ${contextData.country || "Not specified"}
City: ${contextData.city || "Not specified"}
Partner Type: ${contextData.partnerType || "Not specified"}
Target Recommendation: ${targetRecommendation}

CRITICAL VALIDATION STEP:
If a City and Country are both provided, verify if the City is actually located within the Country. If it is NOT, abort and reply exactly with:
LOCATION_MISMATCH: The city of ${contextData.city || ""} is not located in ${contextData.country || ""}.

INSTRUCTIONS:
Step 1: Conduct a deep geographical and institutional analysis of the requested location and the specific recommendation. Write this thought process inside <analysis> tags. In this section, identify the local governance structure, the specific ministries involved, active local/regional financial institutions, and the key international partners actively deploying programs at both the national and subnational levels in this location.
Step 2: Based on your analysis, select 4 to 8 highly specific, real-world institutional stakeholders. Ensure your final list includes a strategic mix of local/national institutions AND relevant international partners.
Step 3: Output ONLY the names of these stakeholders as a strict, comma-separated list inside <stakeholders> tags. 

OUTPUT FORMAT:
<analysis>
(Your internal reasoning, mapping local acronyms, jurisdiction, financial mechanisms, and active international partners here)
</analysis>
<stakeholders>
[Stakeholder 1], [Stakeholder 2], [Stakeholder 3], [Stakeholder 4]
</stakeholders>`;

  try {
    const response = await executeWithRetry(() => ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.2,
      },
    }));

    const text = response.text;
    if (!text) {
      throw new Error("The AI returned an empty response. This might be due to safety filters.");
    }
    
    // Check for Location Mismatch before doing tag extraction
    const mismatchMatch = text.match(/LOCATION_MISMATCH:\s*(.*)/i);
    if (mismatchMatch) {
      throw new Error(mismatchMatch[1].trim());
    }

    // Extract inside <stakeholders>
    const stakeholdersMatch = text.match(/<stakeholders>([\s\S]*?)<\/stakeholders>/i);
    let rawStakeholders = text;
    if (stakeholdersMatch) {
      rawStakeholders = stakeholdersMatch[1];
    } else {
      // Fallback: Remove the <analysis> block
      rawStakeholders = text.replace(/<analysis>[\s\S]*?<\/analysis>/gi, '').trim();
    }

    return rawStakeholders.split(',').map(s => s.trim()).filter(s => s.length > 0 && s !== "LOCATION_MISMATCH");
  } catch (error: any) {
    console.error("Error calling Gemini API for stakeholders:", error);
    const message = error?.message || "Unknown error";
    throw new Error(`Failed to identify stakeholders: ${message}`);
  }
}

export async function generateContextualizedPlan(
  recommendationPoints: string[],
  actor: string,
  contextData: AiContextData,
  stakeholders: string[]
): Promise<string> {
  const ai = getGeminiClient();
  const entityName = contextData.country 
    ? contextData.city ? `${contextData.city}, ${contextData.country}` : contextData.country
    : contextData.partnerType || "the entity";

  const formattedRecommendations = recommendationPoints.map((rec, i) => `Recommendation ${i + 1}: ${rec}`).join('\n');
  const finalizedStakeholders = stakeholders.join(', ');

  const prompt = `Actor: ${actor}. Entity: ${entityName}.
Provided Recommendations:
${formattedRecommendations}

Candidate Stakeholders: ${finalizedStakeholders}

Generate a strategic implementation plan for ${entityName}. For EVERY recommendation provided above, you MUST structure your response EXACTLY as follows:

### [Restate the exact recommendation text here]

[From the Candidate Stakeholders list, select ONLY the specific stakeholders who are in a position to contribute to implementing THIS specific recommendation. For each selected stakeholder, provide a bullet point formatted exactly like this:]
* **[Stakeholder Name]**: [One-sentence summary of their operational role in regular text.]

[Leave a blank line and repeat this exact block for the next recommendation.]`;

  try {
    const response = await executeWithRetry(() => ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.5,
      },
    }));

    const text = response.text;
    if (!text) {
      throw new Error("The AI returned an empty response.");
    }

    return text;
  } catch (error: any) {
    console.error("Error calling Gemini API for plan generation:", error);
    const message = error?.message || "Unknown error";
    throw new Error(`Failed to generate contextualized plan: ${message}`);
  }
}

