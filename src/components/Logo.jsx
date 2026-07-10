// PNG логотипа — белый силуэт. Красим его в цвет активной темы через CSS-маску:
// фон элемента = цвет темы, маска = форма логотипа (альфа-канал PNG).
export default function Logo({ className = "w-8 h-8", ...props }) {
  const maskStyle = {
    backgroundColor: "rgb(var(--color-primary-bright))",
    WebkitMaskImage: "url(/logo-transparent.png)",
    maskImage: "url(/logo-transparent.png)",
    WebkitMaskSize: "contain",
    maskSize: "contain",
    WebkitMaskRepeat: "no-repeat",
    maskRepeat: "no-repeat",
    WebkitMaskPosition: "center",
    maskPosition: "center"
  };

  return (
    <span
      role="img"
      aria-label="A.M. Logo"
      className={`inline-block ${className}`}
      style={maskStyle}
      {...props}
    />
  );
}
