import { Button } from "@repo/design-system/components/ui/button";
import { FileText } from "lucide-react";

export function ExportToWord() {
  return (
    <Button disabled={true} size="sm" variant="outline">
      <FileText className="mr-2 h-4 w-4" />
      Export to Word
    </Button>
  );
}
