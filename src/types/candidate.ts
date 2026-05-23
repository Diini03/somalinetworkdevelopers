export interface ExperienceEntry {
  startYear: number | null;
  endYear: number | null;
  company: string;
  description: string;
}

export interface Candidate {
  id: string;
  name: string;
  title: string;
  photo: string;
  skills: string[];
  // Sensitive fields — only populated for admin views; never returned to public.
  expectedSalary?: {
    min: number;
    max: number;
  };
  email?: string;
  cv?: string;
  location: string;
  qualification: string;
  bio: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  experience: ExperienceEntry[];
  availability: string;
  certifications?: string[];
}
