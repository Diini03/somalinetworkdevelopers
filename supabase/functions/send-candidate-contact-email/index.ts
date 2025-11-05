import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContactEmailRequest {
  candidateId: string;
  candidateEmail: string;
  candidateName: string;
  senderName: string;
  senderEmail: string;
  subject: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      candidateId,
      candidateEmail,
      candidateName,
      senderName,
      senderEmail,
      subject,
      message,
    }: ContactEmailRequest = await req.json();

    console.log("Sending contact email to:", candidateEmail);

    // Create Supabase client for logging
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Send email via Resend
    const emailResponse = await resend.emails.send({
      from: "SND Platform <onboarding@resend.dev>",
      to: [candidateEmail],
      replyTo: senderEmail,
      subject: `New Message from SND Platform - ${subject}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #418FDE 0%, #003366 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background: #f9f9f9; padding: 30px; border: 1px solid #e0e0e0; }
              .info-box { background: white; padding: 20px; margin: 20px 0; border-left: 4px solid #418FDE; border-radius: 4px; }
              .message-box { background: white; padding: 20px; margin: 20px 0; border-radius: 4px; border: 1px solid #e0e0e0; }
              .button { display: inline-block; background: #418FDE; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
              .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
              .label { font-weight: bold; color: #003366; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0;">New Message from SND Platform</h1>
                <p style="margin: 10px 0 0 0; opacity: 0.9;">Somali Network Developers</p>
              </div>
              
              <div class="content">
                <p>Hi <strong>${candidateName}</strong>,</p>
                <p>You have received a new message through the Somali Network Developers platform.</p>
                
                <div class="info-box">
                  <p><span class="label">From:</span> ${senderName}</p>
                  <p><span class="label">Email:</span> <a href="mailto:${senderEmail}">${senderEmail}</a></p>
                  <p><span class="label">Subject:</span> ${subject}</p>
                </div>
                
                <div class="message-box">
                  <p class="label">Message:</p>
                  <p>${message.replace(/\n/g, '<br>')}</p>
                </div>
                
                <div style="text-align: center;">
                  <a href="mailto:${senderEmail}?subject=Re: ${encodeURIComponent(subject)}" class="button">
                    Reply to ${senderName}
                  </a>
                </div>
              </div>
              
              <div class="footer">
                <p><strong>Somali Network Developers</strong></p>
                <p>Empowering Somali Developers Worldwide</p>
                <p style="font-size: 12px; color: #999;">This email was sent because someone used the contact form on your SND profile.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    console.log("Resend response:", emailResponse);

    if (emailResponse.error) {
      // Log failed submission
      await supabase.from("contact_submissions").insert({
        candidate_id: candidateId,
        sender_name: senderName,
        sender_email: senderEmail,
        subject: subject,
        message: message,
        email_sent_successfully: false,
        error_message: emailResponse.error.message,
      });

      const isDomainError = (emailResponse.error as any).statusCode === 403;
      return new Response(
        JSON.stringify({
          success: false,
          error: emailResponse.error.message,
          code: emailResponse.error.name,
          hint: isDomainError
            ? "Email sending blocked: verify your domain at resend.com/domains and use a verified 'from' address."
            : undefined,
        }),
        {
          status: isDomainError ? 403 : 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Log success
    await supabase.from("contact_submissions").insert({
      candidate_id: candidateId,
      sender_name: senderName,
      sender_email: senderEmail,
      subject: subject,
      message: message,
      email_sent_successfully: true,
    });

    return new Response(
      JSON.stringify({ success: true, emailId: emailResponse.data?.id }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error sending email:", error);

    // Try to log the failed submission
    try {
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      const body = await req.json();
      await supabase.from("contact_submissions").insert({
        candidate_id: body.candidateId,
        sender_name: body.senderName,
        sender_email: body.senderEmail,
        subject: body.subject,
        message: body.message,
        email_sent_successfully: false,
        error_message: error.message,
      });
    } catch (logError) {
      console.error("Failed to log error:", logError);
    }

    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);
