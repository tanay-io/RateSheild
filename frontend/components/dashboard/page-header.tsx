import { ReactNode } from "react";

type PageHeaderProps = {
  label: string;
  title: string;
  description?: string;
  action?: ReactNode;
};

export function PageHeader({ label, title, description, action }: PageHeaderProps) {
  return (
    <div className="mb-4 flex flex-col gap-3 border-b border-zinc-200 pb-4 dark:border-zinc-800 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-zinc-500 dark:text-zinc-400">
          {label}
        </p>
        <h2 className="mt-1 text-[16px] font-medium">{title}</h2>
        {description ? (
          <p className="mt-1 text-[13px] text-zinc-500 dark:text-zinc-400">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}
