import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/notify-booking")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { full_name, phone, level, booking_date, hours, total_price } =
          await request.json();

        const hoursText = (hours as number[])
          .map((h) => `${String(h).padStart(2, "0")}:00`)
          .join(", ");

        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env["RESEND_API_KEY"]}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Zakariae Guitar Studio <onboarding@resend.dev>",
            to: ["ahajizakariae2@gmail.com"],
            subject: `Nouvelle réservation — ${full_name}`,
            text: `Nouvelle réservation reçue.

Nom : ${full_name}
Téléphone : ${phone}
Niveau : ${level}
Date : ${booking_date}
Heures : ${hoursText}
Total : ${total_price} DH`,
          }),
        });

        return new Response(JSON.stringify({ ok: res.ok }), {
          headers: { "Content-Type": "application/json" },
        });
      },
    },
  },
});
