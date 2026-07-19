import { LayoutGrid, Rows3, SlidersHorizontal, Download, FileText, FileSpreadsheet } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Props {
  count: number;
  total: number;
  sort: "rank" | "newest" | "az";
  onSort: (v: "rank" | "newest" | "az") => void;
  view: "grid" | "table";
  onView: (v: "grid" | "table") => void;
  onOpenFilters?: () => void;
  activeFilterCount?: number;
  onExportCSV?: () => void;
  onExportPDF?: () => void;
}

export const ResultHeader = ({ count, total, sort, onSort, view, onView, onOpenFilters, activeFilterCount = 0, onExportCSV, onExportPDF }: Props) => {
  return (
    <div className="sticky top-14 z-30 bg-background/85 backdrop-blur-md border-b border-border">
      <div className="px-4 md:px-8 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onOpenFilters}
            className="lg:hidden inline-flex items-center gap-1.5 h-8 px-2.5 rounded-md border border-border bg-surface text-xs hover:bg-accent"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Filters
            {activeFilterCount > 0 && (
              <span className="ml-0.5 text-[10px] font-mono bg-primary text-primary-foreground rounded px-1">{activeFilterCount}</span>
            )}
          </button>
          <div className="text-sm">
            <span className="font-mono tabular-nums font-medium">{count}</span>
            <span className="text-muted-foreground"> of {total} candidates</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {(onExportCSV || onExportPDF) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  disabled={count === 0}
                  className="inline-flex items-center gap-1.5 h-8 px-2.5 rounded-md border border-border bg-surface text-xs hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Export</span>
                  <span className="font-mono text-[10px] text-muted-foreground">{count}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                {onExportCSV && (
                  <DropdownMenuItem onClick={onExportCSV} className="gap-2 text-xs">
                    <FileSpreadsheet className="w-3.5 h-3.5" /> Download CSV
                  </DropdownMenuItem>
                )}
                {onExportPDF && (
                  <DropdownMenuItem onClick={onExportPDF} className="gap-2 text-xs">
                    <FileText className="w-3.5 h-3.5" /> Download PDF
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <div className="hidden sm:flex items-center gap-1 text-xs">
            <span className="text-muted-foreground mr-1">Sort</span>
            <select
              value={sort}
              onChange={(e) => onSort(e.target.value as any)}
              className="h-8 px-2 rounded-md border border-border bg-surface text-xs font-mono focus:outline-none focus:border-primary"
            >
              <option value="rank">AI match</option>
              <option value="newest">Recently added</option>
              <option value="az">A – Z</option>
            </select>
          </div>

          <div className="flex items-center p-0.5 rounded-md border border-border bg-surface">
            <button
              onClick={() => onView("grid")}
              className={`w-7 h-7 rounded flex items-center justify-center ${view === "grid" ? "bg-surface-elevated shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              aria-label="Grid view"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onView("table")}
              className={`w-7 h-7 rounded flex items-center justify-center ${view === "table" ? "bg-surface-elevated shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              aria-label="Table view"
            >
              <Rows3 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
