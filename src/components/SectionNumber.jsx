// Нумерация секций в моноширинном шрифте — tech-акцент в бейдже-пилюле.
export default function SectionNumber({ value }) {
  return (
    <span className="inline-flex items-center font-mono text-xs text-primary-bright tracking-[0.2em] border border-borderSoft rounded-full px-3.5 py-1.5 mb-4">
      {value}
    </span>
  );
}
