import { useState } from "react";
import { useI18n, LANGS } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";

function PickToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "dark" ? "light mode" : "dark mode"}
      className="group flex h-9 w-9 items-center justify-center"
    >
      <span
        className={[
          "pick-shape block h-7 w-7 transition-transform duration-300 group-hover:-rotate-12",
          theme === "dark"
            ? "bg-[#17110b] shadow-[inset_0_0_0_1px_#6d5c48]"
            : "bg-[#f3e6c7] shadow-[inset_0_0_0_1px_#c99a3a]",
        ].join(" ")}
      />
    </button>
  );
}

export function Nav() {
  const { t, lang, setLang } = useI18n();
  const [open, setOpen] = useState(false);

  const links = [
    { href: "#videos", label: t("nav.videos") },
    { href: "#teaching", label: t("nav.teaching") },
    { href: "#booking", label: t("nav.booking") },
    { href: "#contact", label: t("nav.contact") },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <a href="#top" className="font-display text-lg tracking-tight">
          Zakariae <span className="text-walnut">AHAJI</span>
        </a>

        <nav className="hidden items-center gap-6 text-sm md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="transition-colors hover:text-walnut">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5 rounded-full border border-border px-1 py-0.5">
            {LANGS.map((l) => (
              <button
                key={l.code}
                type="button"
                onClick={() => setLang(l.code)}
                className={[
                  "rounded-full px-2 py-0.5 text-xs transition-colors",
                  lang === l.code ? "bg-walnut text-[#f7f2e7]" : "text-muted-foreground hover:text-walnut",
                ].join(" ")}
              >
                {l.label}
              </button>
            ))}
          </div>
          <PickToggle />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="md:hidden rounded-md border border-border px-2 py-1 text-sm"
            aria-label="menu"
          >
            ☰
          </button>
        </div>
      </div>

      {open ? (
        <nav className="border-t border-border bg-background px-4 py-3 text-sm md:hidden">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block py-2 hover:text-walnut"
            >
              {l.label}
            </a>
          ))}
        </nav>
      ) : null}
    </header>
  );
}
