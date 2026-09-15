import { useI18n } from "@/lib/i18n";
import { InstagramIcon, TikTokIcon, WhatsAppIcon, YouTubeIcon } from "@/components/icons";
import { whatsappUrl } from "@/lib/booking";

export function Footer() {
  const { t } = useI18n();

  return (
    <>
      <footer id="contact" className="border-t border-border bg-walnut-deep text-[#ecdfc7]">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-14 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-display text-xl">Zakariae AHAJI</p>
            <p className="mt-1 text-sm text-[#ecdfc7]/75">{t("footer.role")}</p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="rounded-full border border-[#ecdfc7]/30 p-2.5 transition-colors hover:border-mustard hover:text-mustard"
            >
              <InstagramIcon />
            </a>
            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noreferrer"
              aria-label="TikTok"
              className="rounded-full border border-[#ecdfc7]/30 p-2.5 transition-colors hover:border-mustard hover:text-mustard"
            >
              <TikTokIcon />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer"
              aria-label="YouTube"
              className="rounded-full border border-[#ecdfc7]/30 p-2.5 transition-colors hover:border-mustard hover:text-mustard"
            >
              <YouTubeIcon />
            </a>
          </div>
        </div>
        <div className="border-t border-[#ecdfc7]/15 px-4 py-4 text-center text-xs text-[#ecdfc7]/60">
          © {new Date().getFullYear()} Zakariae AHAJI — {t("footer.rights")}
        </div>
      </footer>

      <a
        href={whatsappUrl("Bonjour Zakariae,")}
        target="_blank"
        rel="noreferrer"
        aria-label="WhatsApp"
        className="fixed bottom-5 end-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-olive text-[#f7f2e7] shadow-lg transition-transform hover:scale-105"
      >
        <WhatsAppIcon className="h-7 w-7" />
      </a>
    </>
  );
}
