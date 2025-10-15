"use client";

export function LayoutContent() {
  return (
    <div className="pt-4">
      <p className="mb-4 text-muted-foreground text-sm">
        Customize the layout, styling, and formatting of your resume.
      </p>
      {/* Layout Form will go here */}
      <div className="space-y-4 rounded-lg border bg-muted/50 p-4">
        <p className="text-sm">
          Layout and formatting options will be added here
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-medium text-sm">Font Size</label>
            <div className="flex h-10 items-center rounded border bg-background px-3 text-muted-foreground text-sm">
              Font size selector
            </div>
          </div>
          <div>
            <label className="font-medium text-sm">Margins</label>
            <div className="flex h-10 items-center rounded border bg-background px-3 text-muted-foreground text-sm">
              Margin controls
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
