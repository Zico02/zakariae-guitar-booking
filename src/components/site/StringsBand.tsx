export function StringsBand() {
  const strings = [1, 1.5, 2, 2.75, 3.5, 4.5];
  return (
    <div
      aria-hidden="true"
      className="relative h-28 w-full overflow-hidden bg-walnut-deep sm:h-32"
      style={{ backgroundImage: "linear-gradient(90deg, #2c1c11, #4a3020 55%, #2c1c11)" }}
    >
      {[18, 38, 58, 78].map((left) => (
        <span
          key={left}
          className="absolute top-3 bottom-3 w-px bg-[#c99a3a]/25"
          style={{ left: `${left}%` }}
        />
      ))}
      <div className="absolute inset-0 flex flex-col justify-center gap-3 px-6">
        {strings.map((h, i) => (
          <span
            key={i}
            className="block w-full rounded-full bg-[#e6d3a8]/70"
            style={{ height: `${h}px` }}
          />
        ))}
      </div>
    </div>
  );
}
