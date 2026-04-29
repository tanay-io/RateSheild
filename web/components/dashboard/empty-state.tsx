export function EmptyState({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-white/[0.06] bg-surface px-6 py-12 text-center">
      <div className="text-sm text-white/60">{title}</div>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
