import { ReactNode } from "react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

type SectionCardProps = {
  eyebrow: string;
  title: string;
  action?: ReactNode;
  children: ReactNode;
};

export function SectionCard({ eyebrow, title, action, children }: SectionCardProps) {
  return (
    <Card>
      <CardHeader className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-zinc-500 dark:text-zinc-400">
            {eyebrow}
          </p>
          <h2 className="mt-1 text-[16px] font-medium">{title}</h2>
        </div>
        {action}
      </CardHeader>
      <CardContent className="p-0">{children}</CardContent>
    </Card>
  );
}
