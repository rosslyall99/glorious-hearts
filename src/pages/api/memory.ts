import type { APIRoute } from "astro";
import { Resend } from "resend";

export const prerender = false;

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();

    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const page = String(formData.get("page") || "").trim();
    const message = String(formData.get("message") || "").trim();

    // Honeypot spam field. Real users should never fill this in.
    const website = String(formData.get("website") || "").trim();

    if (website) {
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!name || !message) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Name and memory are required.",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const resendApiKey = import.meta.env.RESEND_API_KEY;
    const to = import.meta.env.MEMORY_EMAIL_TO;
    const from = import.meta.env.MEMORY_EMAIL_FROM;

    if (!resendApiKey || !to || !from) {
      console.error("Missing memory email environment variables");

      return new Response(
        JSON.stringify({
          success: false,
          error: "Email settings are missing.",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const resend = new Resend(resendApiKey);

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email || "Not provided");
    const safePage = escapeHtml(page || "Unknown page");
    const safeMessage = escapeHtml(message).replaceAll("\n", "<br />");

    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: email || undefined,
      subject: `New Glorious Hearts memory from ${name}`,
      html: `
        <h1>New Glorious Hearts memory</h1>

        <p><strong>Name:</strong> ${safeName}</p>
        <p><strong>Email:</strong> ${safeEmail}</p>
        <p><strong>Page:</strong> ${safePage}</p>

        <hr />

        <p><strong>Memory:</strong></p>
        <p>${safeMessage}</p>
      `,
    });

    if (error) {
      console.error("Resend error:", error);

      return new Response(
        JSON.stringify({
          success: false,
          error: "Email could not be sent.",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Memory form error:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: "Something went wrong.",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};