import { Button } from "@repo/design-system/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { Calendar, FileText, Trash2 } from "lucide-react";
import Link from "next/link";

type ResumeCardProps = {
  resume: {
    id: string;
    name: string;
    targetRole?: string | null;
    updatedAt: string;
    isBaseResume?: boolean | null;
  };
  onDelete?: (id: string) => void;
};

export function ResumeCard({ resume, onDelete }: ResumeCardProps) {
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete) {
      onDelete(resume.id);
    }
  };

  return (
    <Link href={`/resume/${resume.id}`} key={resume.id}>
      <Card className="group relative cursor-pointer transition-shadow hover:shadow-lg">
        {onDelete && (
          <Button
            className="absolute top-2 right-2 opacity-0 transition-opacity group-hover:opacity-100"
            onClick={handleDelete}
            size="icon"
            variant="ghost"
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        )}
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {resume.name}
          </CardTitle>
          {resume.targetRole && (
            <CardDescription>{resume.targetRole}</CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <div className="flex items-center text-muted-foreground text-sm">
            <Calendar className="mr-2 h-4 w-4" />
            Updated {new Date(resume.updatedAt).toLocaleDateString()}
          </div>
          {resume.isBaseResume && (
            <div className="mt-2">
              <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 font-medium text-blue-700 text-xs ring-1 ring-blue-700/10 ring-inset">
                Base Resume
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
