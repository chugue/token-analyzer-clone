export default function ReportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="min-h-screen bg-[#0f172a] text-slate-100"
      style={{
        background: "radial-gradient(circle at top left, #1e293b, #0f172a 60%)",
        overscrollBehavior: "none",
      }}
    >
      {children}
    </div>
  );
}
