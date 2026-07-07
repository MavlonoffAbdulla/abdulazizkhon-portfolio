import Logo from "./Logo";

export default function StaticWatermark() {
  return (
    <div className="absolute inset-0 w-full h-full flex items-center justify-center lg:justify-end lg:pr-12 xl:pr-24 pointer-events-none z-0 animate-fade-in">
      {/* Container for the logo watermark to give it a tech neon glow */}
      <div className="relative w-80 h-80 md:w-96 md:h-96 lg:w-[26rem] lg:h-[26rem] flex items-center justify-center opacity-20 filter drop-shadow-[0_0_30px_rgba(61,139,255,0.4)]">
        <Logo className="w-full h-full" />
      </div>
    </div>
  );
}
