import portrait from "@/assets/portrait.jpg";
import { useI18n } from "@/lib/i18n";
import { WhatsAppIcon } from "@/components/icons";
import { whatsappUrl } from "@/lib/booking";

export function Hero() {
  const { t } = useI18n();

  return (
    <section id="top" className="mx-auto max-w-6xl px-4 pb-16 pt-12 md:pt-20">
      <div className="grid items-center gap-14 md:grid-cols-[1.15fr_0.85fr] md:gap-10">
        <div className="text-start">
          <p className="font-display text-sm text-walnut">{t("hero.kicker")}</p>
          <h1 className="mt-3 text-4xl leading-tight sm:text-5xl md:text-6xl">
            Zakariae
            <br />
            <span className="text-walnut">AHAJI</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-foreground/90">{t("hero.title")}</p>
          <p className="mt-3 max-w-xl text-muted-foreground">{t("hero.tagline")}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#booking"
              className="rounded-full bg-walnut px-6 py-3 text-sm font-semibold text-[#f7f2e7] transition-colors hover:bg-walnut-deep"
            >
              {t("hero.book")}
            </a>
            <a
              href={whatsappUrl("Bonjour Zakariae, je souhaite des informations sur les cours.")}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-olive px-6 py-3 text-sm font-semibold text-olive transition-colors hover:bg-olive hover:text-[#f7f2e7]"
            >
              <WhatsAppIcon className="h-4 w-4" />
              {t("hero.whatsapp")}
            </a>
          </div>
        </div>

        <div className="flex justify-center md:justify-end">
          <div className="rosette-outer">
            <div className="rosette">
              <img
                src={portrait}
                alt="Zakariae AHAJI"
                width={1024}
                height={1024}
                className="h-56 w-56 rounded-full object-cover shadow-[0_0_0_2px_var(--color-mustard)] sm:h-72 sm:w-72"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
