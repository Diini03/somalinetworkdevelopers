import { useState } from "react";
import Papa from "papaparse";
import { AdminLayout } from "@/components/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Upload, Download, CheckCircle2, XCircle, FileSpreadsheet } from "lucide-react";
import { PresetPicker, SKILL_PRESETS, QUALIFICATION_PRESETS } from "@/components/PresetPicker";

type Row = Record<string, string>;

const REQUIRED = ["name", "title", "email", "location", "qualification", "availability", "bio", "photo", "skills", "expected_salary_min", "expected_salary_max"];

const TEMPLATE_HEADERS = [...REQUIRED, "linkedin", "github", "portfolio"];

const SAMPLE_ROW: Record<string, string> = {
  name: "Amina Yusuf",
  title: "Senior Frontend Engineer",
  email: "amina@example.com",
  location: "Mogadishu",
  qualification: "BSc Computer Science",
  availability: "Open to work",
  bio: "Frontend engineer with 6 years shipping React apps.",
  photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Amina",
  skills: "React; TypeScript; Tailwind; Next.js",
  expected_salary_min: "3000",
  expected_salary_max: "5000",
  linkedin: "https://linkedin.com/in/amina",
  github: "https://github.com/amina",
  portfolio: "",
};

const downloadTemplate = () => {
  const csv = Papa.unparse([SAMPLE_ROW], { columns: TEMPLATE_HEADERS });
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "snd-candidates-template.csv";
  a.click();
  URL.revokeObjectURL(url);
};

export const CandidatesImport = () => {
  const { toast } = useToast();
  const [rows, setRows] = useState<Row[]>([]);
  const [fileName, setFileName] = useState<string>("");
  const [defaultSkills, setDefaultSkills] = useState<string[]>([]);
  const [defaultQual, setDefaultQual] = useState<string>("");
  const [importing, setImporting] = useState(false);
  const [results, setResults] = useState<{ ok: number; failed: { row: number; reason: string }[] } | null>(null);

  const parseFile = (file: File) => {
    setFileName(file.name);
    setResults(null);
    Papa.parse<Row>(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (h) => h.trim().toLowerCase(),
      complete: (res) => {
        setRows(res.data.filter((r) => Object.values(r).some((v) => v && v.trim())));
      },
      error: (err) => toast({ title: "Parse error", description: err.message, variant: "destructive" }),
    });
  };

  const validRows = rows.map((r, i) => {
    const missing = REQUIRED.filter((k) => {
      if (k === "qualification" && defaultQual) return false;
      if (k === "skills" && defaultSkills.length) return false;
      return !r[k]?.trim();
    });
    return { r, i, missing };
  });
  const readyCount = validRows.filter((v) => v.missing.length === 0).length;

  const runImport = async () => {
    setImporting(true);
    const failed: { row: number; reason: string }[] = [];
    let ok = 0;

    for (const { r, i, missing } of validRows) {
      if (missing.length) {
        failed.push({ row: i + 2, reason: `Missing: ${missing.join(", ")}` });
        continue;
      }
      const skillsCsv = r.skills?.trim() || defaultSkills.join(";");
      const skills = skillsCsv.split(/[;,]/).map((s) => s.trim()).filter(Boolean);
      const payload: any = {
        name: r.name.trim(),
        title: r.title.trim(),
        email: r.email.trim().toLowerCase(),
        location: r.location.trim(),
        qualification: (r.qualification?.trim() || defaultQual).trim(),
        availability: r.availability.trim(),
        bio: r.bio.trim(),
        photo: r.photo.trim(),
        skills,
        expected_salary_min: parseInt(r.expected_salary_min, 10) || 0,
        expected_salary_max: parseInt(r.expected_salary_max, 10) || 0,
        linkedin: r.linkedin?.trim() || null,
        github: r.github?.trim() || null,
        portfolio: r.portfolio?.trim() || null,
        experience: [],
        certifications: [],
      };
      const { error } = await supabase.from("candidates").insert(payload);
      if (error) failed.push({ row: i + 2, reason: error.message });
      else ok++;
    }

    setImporting(false);
    setResults({ ok, failed });
    toast({
      title: "Import complete",
      description: `${ok} added · ${failed.length} failed`,
      variant: failed.length && !ok ? "destructive" : "default",
    });
  };

  const toggle = (arr: string[], setArr: (v: string[]) => void, label: string) =>
    setArr(arr.includes(label) ? arr.filter((x) => x !== label) : [...arr, label]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">Bulk operations</div>
            <h1 className="text-3xl font-serif mt-1">CSV import</h1>
            <p className="text-sm text-muted-foreground mt-2 max-w-xl">
              Upload a CSV to add many candidates at once. Download the template for the exact header order.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={downloadTemplate} className="gap-2">
            <Download className="w-4 h-4" /> Template
          </Button>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <label className="block cursor-pointer">
            <input
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && parseFile(e.target.files[0])}
            />
            <div className="border-2 border-dashed border-border rounded-lg p-10 text-center hover:border-primary/50 transition-colors">
              <FileSpreadsheet className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
              <div className="text-sm font-medium">
                {fileName || "Click to select a CSV file"}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {rows.length > 0 ? `${rows.length} rows detected` : "Header row required"}
              </div>
            </div>
          </label>
        </div>

        {rows.length > 0 && (
          <>
            <div className="rounded-xl border border-border bg-card p-6 space-y-4">
              <div>
                <div className="text-sm font-medium mb-2">Default skills (applied when row is missing skills)</div>
                <PresetPicker
                  presets={SKILL_PRESETS}
                  selected={defaultSkills}
                  onToggle={(l) => toggle(defaultSkills, setDefaultSkills, l)}
                />
              </div>
              <div>
                <div className="text-sm font-medium mb-2">Default qualification (applied when missing)</div>
                <PresetPicker
                  presets={QUALIFICATION_PRESETS}
                  selected={defaultQual ? [defaultQual] : []}
                  onToggle={(l) => setDefaultQual(defaultQual === l ? "" : l)}
                />
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="flex items-center justify-between px-4 h-11 border-b border-border">
                <div className="text-sm">
                  <span className="font-mono font-medium">{readyCount}</span>
                  <span className="text-muted-foreground"> of {rows.length} rows ready</span>
                </div>
                <Button size="sm" onClick={runImport} disabled={importing || readyCount === 0} className="gap-2">
                  <Upload className="w-4 h-4" />
                  {importing ? "Importing…" : `Import ${readyCount}`}
                </Button>
              </div>
              <div className="max-h-96 overflow-auto">
                <table className="w-full text-xs">
                  <thead className="bg-surface sticky top-0">
                    <tr className="text-left font-mono uppercase text-[10px] text-muted-foreground">
                      <th className="p-2 w-10">#</th>
                      <th className="p-2">Name</th>
                      <th className="p-2">Title</th>
                      <th className="p-2">Email</th>
                      <th className="p-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {validRows.map(({ r, i, missing }) => (
                      <tr key={i} className="border-t border-border">
                        <td className="p-2 font-mono text-muted-foreground">{i + 2}</td>
                        <td className="p-2">{r.name || <span className="text-muted-foreground">—</span>}</td>
                        <td className="p-2">{r.title || <span className="text-muted-foreground">—</span>}</td>
                        <td className="p-2">{r.email || <span className="text-muted-foreground">—</span>}</td>
                        <td className="p-2">
                          {missing.length === 0 ? (
                            <span className="inline-flex items-center gap-1 text-emerald-500">
                              <CheckCircle2 className="w-3 h-3" /> Ready
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-amber-500" title={missing.join(", ")}>
                              <XCircle className="w-3 h-3" /> Missing: {missing.join(", ")}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {results && (
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="text-sm font-medium mb-2">Result</div>
            <div className="text-sm text-emerald-500">✓ {results.ok} candidates added</div>
            {results.failed.length > 0 && (
              <div className="mt-3 space-y-1">
                <div className="text-sm text-destructive">✕ {results.failed.length} failed</div>
                <ul className="text-xs text-muted-foreground font-mono space-y-0.5 mt-1">
                  {results.failed.slice(0, 10).map((f, i) => (
                    <li key={i}>Row {f.row}: {f.reason}</li>
                  ))}
                  {results.failed.length > 10 && <li>…and {results.failed.length - 10} more</li>}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default CandidatesImport;
