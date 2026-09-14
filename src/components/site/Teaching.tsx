import { useI18n } from "@/lib/i18n";

export function Teaching() {
  const { t } = useI18n();

  const groups = [
    { title: t("teaching.kids"), text: t("teaching.kidsText"), dots: 1 },
    { title: t("teaching.teens"), text: t("teaching.teensText"), dots: 2 },
    { title: t("teaching.adults"), text: t("teaching.adultsText"), dots: 2 },
    { title: t("teaching.seniors"), text: t("teaching.seniorsText"), dots: 1 },
  ];

  return (
    <section id="teaching" className="border-y border-border bg-muted/40">
      <div className="mx-auto max-w-6xl px-4 py-20">
        <h2 className="text-3xl sm:text-4xl">{t("teaching.title")}</h2>

        <div className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2">
          {groups.map((g) => (
            <div key={g.title} className="border-t-2 border-walnut/40 pt-5">
              <div className="mb-2 flex items-center gap-1.5">
                {Array.from({ length: g.dots }, (_, i) => (
                  <span key={i} className="h-2 w-2 rounded-full bg-mustard" />
                ))}
              </div>
              <h3 className="font-display text-xl">{g.title}</h3>
              <p className="mt-2 text-muted-foreground">{g.text}</p>
            </div>
          ))}
        </div>

        <p className="mt-10 font-display text-olive">{t("teaching.langs")}</p>
      </div>
    </section>
  );
}
