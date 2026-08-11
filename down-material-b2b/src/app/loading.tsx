export default function Loading() {
  return (
    <div
      className="mx-auto max-w-[1280px] animate-pulse space-y-6 px-4 py-16"
      aria-label="页面加载中"
    >
      <div className="h-10 w-1/2 rounded-lg bg-slate-200" />
      <div className="h-5 w-2/3 rounded bg-slate-100" />
      <div className="grid gap-5 pt-8 md:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-64 rounded-xl bg-slate-100" />
        ))}
      </div>
    </div>
  );
}
