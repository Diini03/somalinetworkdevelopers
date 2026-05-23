import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
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
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Verify the user
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

    const { candidateId } = await req.json();
    if (!candidateId || typeof candidateId !== "string") {
      return new Response(JSON.stringify({ error: "Invalid candidateId" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Look up CV path via service role (PII boundary)
    const admin = createClient(supabaseUrl, serviceKey);
    const { data: cand, error: candErr } = await admin
      .from("candidates")
      .select("cv")
      .eq("id", candidateId)
      .maybeSingle();

    if (candErr || !cand || !cand.cv) {
      return new Response(JSON.stringify({ error: "CV not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // The stored value may be a full public URL from the old public bucket
    // or a storage path. Extract object path after "candidate-cvs/".
    const marker = "/candidate-cvs/";
    const idx = cand.cv.indexOf(marker);
    const objectPath = idx >= 0 ? cand.cv.substring(idx + marker.length) : cand.cv;

    const { data: signed, error: signErr } = await admin.storage
      .from("candidate-cvs")
      .createSignedUrl(objectPath, 60 * 10); // 10 minutes

    if (signErr || !signed) {
      return new Response(JSON.stringify({ error: signErr?.message || "Failed to sign URL" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ url: signed.signedUrl }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
