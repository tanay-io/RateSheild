type EmptyStateProps = {
  message: string;
  action?: React.ReactNode;
};

export function EmptyState({ message, action }: EmptyStateProps) {
  return (
    <div className="flex min-h-40 flex-col items-center justify-center gap-3 px-6 py-10 text-center">
      <p className="text-[13px] text-zinc-500 dark:text-zinc-400">{message}</p>
      {action}
    </div>
  );
}
