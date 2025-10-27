import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";

type Category = {
  name: string;
  score: number;
  max: number;
};

type AnalysisData = {
  grade: number;
  summary?: string;
  categories: Category[];
};

type AnalysisCardProps = {
  data: AnalysisData;
};

export function AnalysisCard({ data }: AnalysisCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Resume Analysis</CardTitle>
          <div className="flex items-center gap-2">
            <span className="font-bold text-3xl text-blue-600">
              {data.grade}
            </span>
            <span className="text-slate-500 text-sm">/100</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.summary && (
          <p className="text-slate-600 text-sm">{data.summary}</p>
        )}

        <div className="space-y-3 pt-2">
          {data.categories.map((cat) => (
            <div key={cat.name}>
              <div className="mb-2 flex items-center justify-between">
                <span className="font-medium text-sm">{cat.name}</span>
                <span className="text-slate-500 text-sm">
                  {cat.score}/{cat.max}
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-200">
                <div
                  className="h-2 rounded-full bg-blue-500 transition-all duration-500"
                  style={{ width: `${(cat.score / cat.max) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
