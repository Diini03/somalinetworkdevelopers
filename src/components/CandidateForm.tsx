import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ExperienceEntry } from "@/types/candidate";
import { Plus, Trash2 } from "lucide-react";
import { PresetPicker, SKILL_PRESETS, QUALIFICATION_PRESETS } from "@/components/PresetPicker";

interface CandidateFormProps {
  candidate?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export const CandidateForm = ({ candidate, onSuccess, onCancel }: CandidateFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvPreview, setCvPreview] = useState<string>("");
  const [certificationFiles, setCertificationFiles] = useState<File[]>([]);
  const [certificationPreviews, setCertificationPreviews] = useState<string[]>([]);
  const [existingCertifications, setExistingCertifications] = useState<string[]>([]);
  const [experiences, setExperiences] = useState<ExperienceEntry[]>([
    { startYear: null, endYear: null, company: "", description: "" }
  ]);
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    photo: "",
    skills: "",
    expected_salary_min: "",
    expected_salary_max: "",
    location: "",
    qualification: "",
    bio: "",
    email: "",
    linkedin: "",
    github: "",
    portfolio: "",
    availability: "",
    cv: "",
  });

  useEffect(() => {
    if (candidate) {
      // Fetch full candidate data
      const fetchCandidate = async () => {
        const { data } = await supabase
          .from("candidates")
          .select("*")
          .eq("id", candidate.id)
          .maybeSingle();
        
        if (data) {
          setFormData({
            name: data.name,
            title: data.title,
            photo: data.photo,
            skills: data.skills.join(", "),
            expected_salary_min: data.expected_salary_min.toString(),
            expected_salary_max: data.expected_salary_max.toString(),
            location: data.location,
            qualification: data.qualification,
            bio: data.bio,
            email: data.email,
            linkedin: data.linkedin || "",
            github: data.github || "",
            portfolio: data.portfolio || "",
            availability: data.availability,
            cv: data.cv || "",
          });
          setPhotoPreview(data.photo);
          setCvPreview(data.cv || "");
          
          // Parse experience data
          if (Array.isArray(data.experience) && data.experience.length > 0) {
            setExperiences(data.experience as unknown as ExperienceEntry[]);
          }
          
          // Set existing certifications
          if (data.certifications && data.certifications.length > 0) {
            setExistingCertifications(data.certifications);
          }
        }
      };
      fetchCandidate();
    }
  }, [candidate]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCvFile(file);
      setCvPreview(file.name);
    }
  };

  const handleCertificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setCertificationFiles(prev => [...prev, ...files]);
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCertificationPreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeCertificationPreview = (index: number) => {
    setCertificationFiles(prev => prev.filter((_, i) => i !== index));
    setCertificationPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingCertification = (index: number) => {
    setExistingCertifications(prev => prev.filter((_, i) => i !== index));
  };

  const addExperience = () => {
    setExperiences([...experiences, { startYear: null, endYear: null, company: "", description: "" }]);
  };

  const removeExperience = (index: number) => {
    if (experiences.length > 1) {
      setExperiences(experiences.filter((_, i) => i !== index));
    }
  };

  const updateExperience = (index: number, field: keyof ExperienceEntry, value: any) => {
    const updated = [...experiences];
    updated[index] = { ...updated[index], [field]: value };
    setExperiences(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Basic email validation before any uploads
    const email = formData.email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (!emailRegex.test(email) || email.length > 255) {
      setLoading(false);
      toast({
        title: "Invalid email",
        description: "Please enter a valid candidate email address (max 255 chars).",
        variant: "destructive",
      });
      return;
    }
    const candidateEmail = email;

    try {
      let photoUrl = formData.photo;

      // Upload photo if a new file is selected
      if (photoFile) {
        const fileExt = photoFile.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        const filePath = fileName;

        const { error: uploadError } = await supabase.storage
          .from('candidate-photos')
          .upload(filePath, photoFile);

        if (uploadError) {
          throw uploadError;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('candidate-photos')
          .getPublicUrl(filePath);

        photoUrl = publicUrl;
      }

      // Upload CV if a new file is selected
      let cvUrl = formData.cv;
      if (cvFile) {
        const fileExt = cvFile.name.split('.').pop();
        const fileName = `cv-${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('candidate-cvs')
          .upload(fileName, cvFile);

        if (uploadError) {
          throw uploadError;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('candidate-cvs')
          .getPublicUrl(fileName);

        cvUrl = publicUrl;
      }

      // Upload certification files
      const certificationUrls = [...existingCertifications];
      for (const file of certificationFiles) {
        const fileExt = file.name.split('.').pop();
        const fileName = `cert-${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('candidate-photos')
          .upload(fileName, file);

        if (uploadError) {
          throw uploadError;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('candidate-photos')
          .getPublicUrl(fileName);

        certificationUrls.push(publicUrl);
      }

      const candidateData: any = {
        name: formData.name,
        title: formData.title,
        photo: photoUrl,
        skills: formData.skills.split(",").map(s => s.trim()),
        expected_salary_min: parseInt(formData.expected_salary_min),
        expected_salary_max: parseInt(formData.expected_salary_max),
        location: formData.location,
        qualification: formData.qualification,
        bio: formData.bio,
        email: candidateEmail,
        linkedin: formData.linkedin || null,
        github: formData.github || null,
        portfolio: formData.portfolio || null,
        experience: experiences,
        availability: formData.availability,
        certifications: certificationUrls,
        cv: cvUrl || null,
      };

      let savedCandidateId = candidate?.id;
      let error;
      if (candidate) {
        ({ error } = await supabase
          .from("candidates")
          .update(candidateData)
          .eq("id", candidate.id));
      } else {
        const { data: newCandidate, error: insertError } = await supabase
          .from("candidates")
          .insert(candidateData)
          .select()
          .single();
        
        error = insertError;
        if (newCandidate) {
          savedCandidateId = newCandidate.id;
        }
      }

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: `Candidate ${candidate ? "updated" : "added"} successfully`,
      });

      // Trigger AI scoring in the background
      if (savedCandidateId) {
        fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/calculate-candidate-score`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              candidateId: savedCandidateId,
              name: formData.name,
              title: formData.title,
              skills: formData.skills.split(",").map(s => s.trim()),
              experience: experiences,
              qualification: formData.qualification,
              bio: formData.bio,
              expectedSalary: {
                min: parseInt(formData.expected_salary_min),
                max: parseInt(formData.expected_salary_max),
              },
            }),
          }
        ).catch(err => console.error("AI scoring error:", err));
      }

      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input id="name" placeholder="e.g. Ayaan Mohamed" value={formData.name} onChange={handleChange} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input id="title" placeholder="e.g. Senior Frontend Engineer" value={formData.title} onChange={handleChange} required />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="photo">Photo *</Label>
        <Input
          id="photo"
          type="file"
          accept="image/*"
          onChange={handlePhotoChange}
          required={!candidate && !photoPreview}
        />
        <p className="text-xs text-muted-foreground">
          Square headshot, ~400×400px. Tip: use <a href="https://unavatar.io" target="_blank" rel="noreferrer" className="underline">unavatar.io</a> or <a href="https://ui-avatars.com" target="_blank" rel="noreferrer" className="underline">ui-avatars.com</a> if you don't have one.
        </p>
        {photoPreview && (
          <div className="mt-2">
            <img
              src={photoPreview}
              alt="Preview"
              className="w-32 h-32 object-cover rounded-lg border border-border"
            />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <Input id="email" type="email" placeholder="e.g. ayaan@example.com" value={formData.email} onChange={handleChange} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="skills">Skills (comma-separated) *</Label>
        <Input id="skills" placeholder="e.g. React, TypeScript, Node.js, PostgreSQL, Tailwind" value={formData.skills} onChange={handleChange} required />
        <p className="text-xs text-muted-foreground">Separate each skill with a comma.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="expected_salary_min">Min Salary (USD) *</Label>
          <Input id="expected_salary_min" type="number" placeholder="e.g. 2500" value={formData.expected_salary_min} onChange={handleChange} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="expected_salary_max">Max Salary (USD) *</Label>
          <Input id="expected_salary_max" type="number" placeholder="e.g. 4000" value={formData.expected_salary_max} onChange={handleChange} required />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="location">Location *</Label>
          <Input id="location" placeholder="e.g. Mogadishu, Somalia" value={formData.location} onChange={handleChange} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="qualification">Qualification *</Label>
          <Input id="qualification" placeholder="e.g. BSc Computer Science, SIMAD University" value={formData.qualification} onChange={handleChange} required />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Bio *</Label>
        <Textarea id="bio" placeholder="Short intro — what they build, what they care about. 2-3 sentences." value={formData.bio} onChange={handleChange} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="availability">Availability *</Label>
        <Input id="availability" placeholder="e.g. Open to work · Full-time · Remote" value={formData.availability} onChange={handleChange} required />
      </div>

      {/* CV Upload */}
      <div className="space-y-2">
        <Label htmlFor="cv">CV / Resume</Label>
        <Input 
          id="cv" 
          type="file" 
          accept=".pdf,.doc,.docx"
          onChange={handleCvChange}
        />
        <p className="text-sm text-muted-foreground">Upload CV in PDF or DOC format</p>
        {cvPreview && (
          <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
            <span>📄</span>
            <span>{cvPreview}</span>
          </div>
        )}
      </div>

      {/* Experience Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Professional Experience *</Label>
          <Button type="button" onClick={addExperience} size="sm" variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Add Experience
          </Button>
        </div>
        
        {experiences.map((exp, index) => (
          <div key={index} className="p-4 border border-border rounded-lg space-y-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold">Experience #{index + 1}</span>
              {experiences.length > 1 && (
                <Button
                  type="button"
                  onClick={() => removeExperience(index)}
                  size="sm"
                  variant="ghost"
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Start Year</Label>
                <Input
                  type="number"
                  placeholder="e.g. 2015"
                  value={exp.startYear || ""}
                  onChange={(e) => updateExperience(index, "startYear", e.target.value ? parseInt(e.target.value) : null)}
                />
              </div>
              <div className="space-y-2">
                <Label>End Year</Label>
                <Input
                  type="number"
                  placeholder="e.g. 2020 or leave empty for current"
                  value={exp.endYear || ""}
                  onChange={(e) => updateExperience(index, "endYear", e.target.value ? parseInt(e.target.value) : null)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Company *</Label>
              <Input
                placeholder="Company Name"
                value={exp.company}
                onChange={(e) => updateExperience(index, "company", e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label>Description *</Label>
              <Textarea
                placeholder="Describe your role and responsibilities..."
                value={exp.description}
                onChange={(e) => updateExperience(index, "description", e.target.value)}
                required
              />
            </div>
          </div>
        ))}
      </div>

      {/* Certifications Upload */}
      <div className="space-y-2">
        <Label htmlFor="certifications">Certifications</Label>
        <Input
          id="certifications"
          type="file"
          accept="image/*"
          multiple
          onChange={handleCertificationChange}
        />
        <p className="text-sm text-muted-foreground">Upload certification images (multiple files allowed)</p>
        
        {/* Existing Certifications */}
        {existingCertifications.length > 0 && (
          <div className="mt-3">
            <p className="text-sm font-medium mb-2">Existing Certifications:</p>
            <div className="grid grid-cols-3 gap-2">
              {existingCertifications.map((url, index) => (
                <div key={index} className="relative group">
                  <img
                    src={url}
                    alt={`Certification ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeExistingCertification(index)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* New Certification Previews */}
        {certificationPreviews.length > 0 && (
          <div className="mt-3">
            <p className="text-sm font-medium mb-2">New Certifications:</p>
            <div className="grid grid-cols-3 gap-2">
              {certificationPreviews.map((preview, index) => (
                <div key={index} className="relative group">
                  <img
                    src={preview}
                    alt={`New Certification ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeCertificationPreview(index)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="linkedin">LinkedIn</Label>
        <Input id="linkedin" placeholder="https://linkedin.com/in/username" value={formData.linkedin} onChange={handleChange} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="github">GitHub</Label>
        <Input id="github" placeholder="https://github.com/username" value={formData.github} onChange={handleChange} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="portfolio">Portfolio</Label>
        <Input id="portfolio" placeholder="https://your-portfolio.com" value={formData.portfolio} onChange={handleChange} />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : candidate ? "Update" : "Add"}
        </Button>
      </div>
    </form>
  );
};
