import { HOURS, formatHour } from "@/lib/booking";

type Props = {
  selected: number[];
  onToggle: (hour: number) => void;
  unavailable?: number[];
  labelUnavailable?: string;
};

export function HourGrid({ selected, onToggle, unavailable = [], labelUnavailable }: Props) {
  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
      {HOURS.map((h) => {
        const off = unavailable.includes(h);
        const on = selected.includes(h);
        return (
          <button
            key={h}
            type="button"
            disabled={off}
            onClick={() => onToggle(h)}
            title={off ? labelUnavailable : undefined}
            className={[
              "rounded-lg border px-2 py-2 text-sm transition-colors",
              off
                ? "border-border/60 text-muted-foreground/50 line-through"
                : on
                  ? "border-walnut bg-walnut text-[#f7f2e7]"
                  : "border-border hover:border-walnut hover:text-walnut",
            ].join(" ")}
          >
            {formatHour(h)}
          </button>
        );
      })}
    </div>
  );
}
