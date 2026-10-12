type LogoProps = {
  size?: number;
};

/** Фирменный знак и название. Название всегда пишется как «Тыкуэн». */
export function Logo({ size = 40 }: LogoProps) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
      <img src="/logo.svg" width={size} height={size} alt="" />
      <span style={{ fontSize: size * 0.6, fontWeight: 800, letterSpacing: '-0.02em' }}>
        Тыкуэн
      </span>
    </span>
  );
}
