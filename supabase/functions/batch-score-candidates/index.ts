import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Admin-only enforcement
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const { data: isAdmin } = await userClient.rpc("has_role", {
      _user_id: userData.user.id,
      _role: "admin",
    });
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);


    console.log("Starting batch candidate scoring...");

    // Fetch all candidates
    const { data: candidates, error: fetchError } = await supabase
      .from("candidates")
      .select("*");

    if (fetchError) {
      throw fetchError;
    }

    if (!candidates || candidates.length === 0) {
      return new Response(
        JSON.stringify({ message: "No candidates to score", processed: 0 }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log(`Found ${candidates.length} candidates to score`);

    const results = {
      total: candidates.length,
      successful: 0,
      failed: 0,
      errors: [] as string[],
    };

    // Process candidates in batches with delay to avoid rate limits
    for (let i = 0; i < candidates.length; i++) {
      const candidate = candidates[i];
      
      try {
        console.log(`Scoring candidate ${i + 1}/${candidates.length}: ${candidate.name}`);

        // Call the calculate-candidate-score function
        const scoreResponse = await fetch(
          `${supabaseUrl}/functions/v1/calculate-candidate-score`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${supabaseKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              candidateId: candidate.id,
              name: candidate.name,
              title: candidate.title,
              skills: candidate.skills,
              experience: candidate.experience,
              qualification: candidate.qualification,
              bio: candidate.bio,
              expectedSalary: {
                min: candidate.expected_salary_min,
                max: candidate.expected_salary_max,
              },
            }),
          }
        );

        if (scoreResponse.ok) {
          results.successful++;
          console.log(`✓ Successfully scored: ${candidate.name}`);
        } else {
          const errorText = await scoreResponse.text();
          results.failed++;
          results.errors.push(`${candidate.name}: ${errorText}`);
          console.error(`✗ Failed to score ${candidate.name}:`, errorText);
        }

        // Add delay between requests to avoid rate limits (1 second)
        if (i < candidates.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      } catch (error: any) {
        results.failed++;
        results.errors.push(`${candidate.name}: ${error.message}`);
        console.error(`✗ Error scoring ${candidate.name}:`, error);
      }
    }

    console.log("Batch scoring completed:", results);

    return new Response(JSON.stringify(results), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Batch scoring error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
