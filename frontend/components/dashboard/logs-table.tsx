import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/dashboard/empty-state";
import { formatDateTime } from "@/lib/format";
import { CheckLogEntry } from "@/lib/types";
import { Table, TBody, TD, TH, THead } from "@/components/ui/table";

type LogsTableProps = {
  logs: CheckLogEntry[];
};

export function LogsTable({ logs }: LogsTableProps) {
  if (logs.length === 0) {
    return <EmptyState message="No requests yet." />;
  }

  return (
    <Table>
      <THead>
        <tr>
          <TH>Status</TH>
          <TH>Key</TH>
          <TH>Algorithm</TH>
          <TH>IP</TH>
          <TH>Timestamp</TH>
        </tr>
      </THead>
      <TBody>
        {logs.map((log) => (
          <tr key={`${log.timestamp}-${log.key}`} className="hover:bg-zinc-50 dark:hover:bg-zinc-950/40">
            <TD>
              <Badge tone={log.allowed ? "success" : "danger"}>
                {log.allowed ? "allowed" : "blocked"}
              </Badge>
            </TD>
            <TD className="font-mono text-xs">{log.key}</TD>
            <TD className="font-mono text-xs">{log.algo}</TD>
            <TD className="font-mono text-xs">{log.ip}</TD>
            <TD className="text-[11px] text-zinc-500 dark:text-zinc-400">{formatDateTime(log.timestamp)}</TD>
          </tr>
        ))}
      </TBody>
    </Table>
  );
}
