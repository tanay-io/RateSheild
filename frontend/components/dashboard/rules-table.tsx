import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Rule } from "@/lib/types";
import { Table, TBody, TD, TH, THead } from "@/components/ui/table";

type RulesTableProps = {
  rules: Rule[];
  onDelete: (id: number) => void;
};

export function RulesTable({ rules, onDelete }: RulesTableProps) {
  if (rules.length === 0) {
    return <EmptyState message="No rules configured." />;
  }

  return (
    <Table>
      <THead>
        <tr>
          <TH>Route</TH>
          <TH>Algorithm</TH>
          <TH>Limit</TH>
          <TH>Window</TH>
          <TH>Key By</TH>
          <TH className="text-right">Action</TH>
        </tr>
      </THead>
      <TBody>
        {rules.map((rule) => (
          <tr key={rule.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-950/40">
            <TD className="font-mono text-xs">{rule.routePattern}</TD>
            <TD className="font-mono text-xs">{rule.algo}</TD>
            <TD>{rule.limit}</TD>
            <TD>{rule.window}s</TD>
            <TD className="font-mono text-xs">{rule.keyBy}</TD>
            <TD className="text-right">
              <Button
                variant="ghost"
                className="h-auto border-0 px-0 text-red-600 dark:text-red-400"
                onClick={() => onDelete(rule.id)}
              >
                Delete
              </Button>
            </TD>
          </tr>
        ))}
      </TBody>
    </Table>
  );
}
