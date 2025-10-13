import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface CandidateFormProps {
  candidate?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export const CandidateForm = ({ candidate, onSuccess, onCancel }: CandidateFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
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
    experience: "",
    availability: "",
  });

  useEffect(() => {
    if (candidate) {
      // Fetch full candidate data
      const fetchCandidate = async () => {
        const { data } = await supabase
          .from("candidates")
          .select("*")
          .eq("id", candidate.id)
          .single();
        
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
            experience: data.experience,
            availability: data.availability,
          });
        }
      };
      fetchCandidate();
    }
  }, [candidate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const candidateData = {
      name: formData.name,
      title: formData.title,
      photo: formData.photo,
      skills: formData.skills.split(",").map(s => s.trim()),
      expected_salary_min: parseInt(formData.expected_salary_min),
      expected_salary_max: parseInt(formData.expected_salary_max),
      location: formData.location,
      qualification: formData.qualification,
      bio: formData.bio,
      email: formData.email,
      linkedin: formData.linkedin || null,
      github: formData.github || null,
      portfolio: formData.portfolio || null,
      experience: formData.experience,
      availability: formData.availability,
    };

    let error;
    if (candidate) {
      ({ error } = await supabase
        .from("candidates")
        .update(candidateData)
        .eq("id", candidate.id));
    } else {
      ({ error } = await supabase.from("candidates").insert(candidateData));
    }

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: `Candidate ${candidate ? "updated" : "added"} successfully`,
      });
      onSuccess();
    }

    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input id="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input id="title" value={formData.title} onChange={handleChange} required />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="photo">Photo URL *</Label>
        <Input id="photo" value={formData.photo} onChange={handleChange} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <Input id="email" type="email" value={formData.email} onChange={handleChange} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="skills">Skills (comma-separated) *</Label>
        <Input id="skills" value={formData.skills} onChange={handleChange} required />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="expected_salary_min">Min Salary *</Label>
          <Input id="expected_salary_min" type="number" value={formData.expected_salary_min} onChange={handleChange} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="expected_salary_max">Max Salary *</Label>
          <Input id="expected_salary_max" type="number" value={formData.expected_salary_max} onChange={handleChange} required />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="location">Location *</Label>
          <Input id="location" value={formData.location} onChange={handleChange} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="qualification">Qualification *</Label>
          <Input id="qualification" value={formData.qualification} onChange={handleChange} required />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Bio *</Label>
        <Textarea id="bio" value={formData.bio} onChange={handleChange} required />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="experience">Experience *</Label>
          <Input id="experience" value={formData.experience} onChange={handleChange} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="availability">Availability *</Label>
          <Input id="availability" value={formData.availability} onChange={handleChange} required />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="linkedin">LinkedIn</Label>
        <Input id="linkedin" value={formData.linkedin} onChange={handleChange} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="github">GitHub</Label>
        <Input id="github" value={formData.github} onChange={handleChange} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="portfolio">Portfolio</Label>
        <Input id="portfolio" value={formData.portfolio} onChange={handleChange} />
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
