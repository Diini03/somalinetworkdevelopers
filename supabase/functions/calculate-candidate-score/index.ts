import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CandidateData {
  candidateId: string;
  name: string;
  title: string;
  skills: string[];
  experience: Array<{
    startYear: number | null;
    endYear: number | null;
    company: string;
    description: string;
  }>;
  qualification: string;
  bio: string;
  expectedSalary: {
    min: number;
    max: number;
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const candidateData: CandidateData = await req.json();
    console.log("Calculating score for candidate:", candidateData.name);

    // Calculate profile completeness (0-20 points)
    let completenessScore = 0;
    if (candidateData.bio?.length > 50) completenessScore += 5;
    if (candidateData.skills?.length >= 5) completenessScore += 5;
    if (candidateData.experience?.length > 0) completenessScore += 5;
    if (candidateData.qualification) completenessScore += 5;

    // Calculate experience years
    let totalYears = 0;
    if (candidateData.experience && candidateData.experience.length > 0) {
      candidateData.experience.forEach((exp) => {
        const start = exp.startYear || new Date().getFullYear();
        const end = exp.endYear || new Date().getFullYear();
        totalYears += end - start;
      });
    }

    // Prepare prompt for AI analysis
    const analysisPrompt = `Analyze this developer profile and provide a comprehensive scoring. Return ONLY a valid JSON object with no markdown formatting or code blocks.

Profile:
- Title: ${candidateData.title}
- Skills: ${candidateData.skills?.join(", ") || "None listed"}
- Years of Experience: ${totalYears}
- Qualification: ${candidateData.qualification}
- Bio: ${candidateData.bio}
- Experience Details: ${JSON.stringify(candidateData.experience)}

Scoring Criteria:
1. Title Demand (0-25 points): Rate based on market demand. Senior roles, specialized positions, and high-demand titles score higher.
2. Skills Value (0-35 points): Rate based on importance and relevance. Modern frameworks (React, TypeScript, Node.js), cloud tech (AWS, Azure), AI/ML, and specialized skills score highest.
3. Experience Quality (0-25 points): Rate based on years, progression, and role descriptions. 5+ years with leadership = highest scores.
4. Professional Presentation (0-15 points): Rate the bio quality, clarity, and professionalism of the profile.

Return this exact JSON structure:
{
  "totalScore": <number 0-100>,
  "breakdown": {
    "titleDemand": <number 0-25>,
    "skillsValue": <number 0-35>,
    "experienceQuality": <number 0-25>,
    "presentation": <number 0-15>
  },
  "insights": "<brief explanation of the score>",
  "topStrengths": ["<strength 1>", "<strength 2>"],
  "suggestedImprovements": ["<improvement 1>", "<improvement 2>"]
}`;

    // Call Lovable AI for analysis
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: "You are an expert tech recruiter who scores developer profiles objectively. Always return valid JSON without markdown formatting.",
          },
          {
            role: "user",
            content: analysisPrompt,
          },
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI API Error:", response.status, errorText);
      throw new Error(`AI analysis failed: ${response.status}`);
    }

    const aiData = await response.json();
    let aiAnalysis;
    
    try {
      const content = aiData.choices[0].message.content;
      // Remove markdown code blocks if present
      const cleanedContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      aiAnalysis = JSON.parse(cleanedContent);
    } catch (parseError) {
      console.error("Failed to parse AI response:", aiData.choices[0].message.content);
      // Fallback scoring
      aiAnalysis = {
        totalScore: 50 + completenessScore,
        breakdown: {
          titleDemand: 12,
          skillsValue: 20,
          experienceQuality: 15,
          presentation: completenessScore / 2,
        },
        insights: "Unable to perform detailed analysis. Using basic scoring.",
        topStrengths: ["Profile completeness"],
        suggestedImprovements: ["Add more details to enable AI analysis"],
      };
    }

    const finalScore = Math.min(100, Math.max(0, aiAnalysis.totalScore));

    console.log(`Score calculated for ${candidateData.name}: ${finalScore}`);

    // Update candidate score in database
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { error: updateError } = await supabase
      .from("candidates")
      .update({
        ai_score: finalScore,
        ai_score_updated_at: new Date().toISOString(),
        profile_completeness: completenessScore,
      })
      .eq("id", candidateData.candidateId);

    if (updateError) {
      console.error("Database update error:", updateError);
      throw updateError;
    }

    return new Response(
      JSON.stringify({
        score: finalScore,
        completeness: completenessScore,
        analysis: aiAnalysis,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error calculating score:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
