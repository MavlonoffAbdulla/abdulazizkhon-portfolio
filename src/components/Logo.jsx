export default function Logo({ className = "w-8 h-8", ...props }) {
  return (
    <img
      src="/logo-transparent.png"
      alt="A.M. Logo"
      className={`${className} object-contain`}
      {...props}
    />
  );
}
