import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/dashboard/empty-state";
import { formatDateTime } from "@/lib/format";
import { ApiKeyRecord } from "@/lib/types";
import { Table, TBody, TD, TH, THead } from "@/components/ui/table";

type KeysTableProps = {
  keys: ApiKeyRecord[];
  onRevoke: (id: number) => void;
};

export function KeysTable({ keys, onRevoke }: KeysTableProps) {
  if (keys.length === 0) {
    return <EmptyState message="No API keys yet." />;
  }

  return (
    <Table>
      <THead>
        <tr>
          <TH>Name</TH>
          <TH>Prefix</TH>
          <TH>Status</TH>
          <TH>Created</TH>
          <TH className="text-right">Action</TH>
        </tr>
      </THead>
      <TBody>
        {keys.map((key) => (
          <tr key={key.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-950/40">
            <TD>{key.name}</TD>
            <TD className="font-mono text-xs">{key.prefix}</TD>
            <TD>
              <Badge tone={key.revoked ? "danger" : "success"}>
                {key.revoked ? "revoked" : "active"}
              </Badge>
            </TD>
            <TD className="text-[11px] text-zinc-500 dark:text-zinc-400">{formatDateTime(key.createdAt)}</TD>
            <TD className="text-right">
              <Button
                variant="ghost"
                className="h-auto border-0 px-0 text-red-600 dark:text-red-400"
                onClick={() => onRevoke(key.id)}
                disabled={key.revoked}
              >
                Revoke
              </Button>
            </TD>
          </tr>
        ))}
      </TBody>
    </Table>
  );
}
