export default function TasksLayout({
  children,
  detail,
}: {
  children: React.ReactNode;
  detail: React.ReactNode;
}) {
  return (
    <div className="relative flex h-screen w-full overflow-hidden">
      <div className="flex-1 flex flex-col min-w-0">
        {children}
      </div>
      {detail}
    </div>
  );
}
