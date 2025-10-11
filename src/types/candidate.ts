export interface Candidate {
  id: string;
  name: string;
  title: string;
  photo: string;
  skills: string[];
  expectedSalary: {
    min: number;
    max: number;
  };
  location: string;
  qualification: string;
  bio: string;
  email: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  experience: string;
  availability: string;
}
