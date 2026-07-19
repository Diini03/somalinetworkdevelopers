import Papa from "papaparse";
import jsPDF from "jspdf";
import { Candidate } from "@/types/candidate";

const filename = (ext: string) => {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `snd-candidates-${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}.${ext}`;
};

const download = (blob: Blob, name: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

export const exportCandidatesCSV = (candidates: Candidate[]) => {
  const rows = candidates.map((c) => ({
    name: c.name,
    title: c.title,
    location: c.location,
    qualification: c.qualification,
    availability: c.availability,
    ai_score: c.aiScore ?? "",
    skills: c.skills.join("; "),
    certifications: (c.certifications || []).length,
    linkedin: c.linkedin || "",
    github: c.github || "",
    portfolio: c.portfolio || "",
    bio: c.bio || "",
  }));
  const csv = Papa.unparse(rows);
  download(new Blob([csv], { type: "text/csv;charset=utf-8" }), filename("csv"));
};

export const exportCandidatesPDF = (candidates: Candidate[]) => {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 40;
  let y = margin;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("SND · Talent Export", margin, y);
  y += 18;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(120);
  doc.text(
    `${candidates.length} candidates · Generated ${new Date().toLocaleString()}`,
    margin,
    y
  );
  y += 20;
  doc.setTextColor(0);

  candidates.forEach((c, i) => {
    if (y > pageH - 100) {
      doc.addPage();
      y = margin;
    }
    doc.setDrawColor(220);
    doc.line(margin, y, pageW - margin, y);
    y += 14;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(`${i + 1}. ${c.name}`, margin, y);
    if (typeof c.aiScore === "number") {
      const label = `AI ${c.aiScore}`;
      doc.setFontSize(9);
      doc.text(label, pageW - margin - doc.getTextWidth(label), y);
    }
    y += 14;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(90);
    doc.text(
      `${c.title} · ${c.location} · ${c.availability}`,
      margin,
      y
    );
    y += 12;

    doc.setTextColor(0);
    const skills = c.skills.slice(0, 12).join(", ");
    const wrapped = doc.splitTextToSize(`Skills: ${skills}`, pageW - margin * 2);
    doc.text(wrapped, margin, y);
    y += wrapped.length * 11 + 6;

    if (c.qualification) {
      doc.setTextColor(120);
      doc.setFontSize(8);
      doc.text(c.qualification, margin, y);
      doc.setTextColor(0);
      doc.setFontSize(9);
      y += 12;
    }
    y += 4;
  });

  doc.save(filename("pdf"));
};
