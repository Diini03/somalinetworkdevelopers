import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Pencil, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CandidateForm } from "@/components/CandidateForm";

interface Candidate {
  id: string;
  name: string;
  title: string;
  email: string;
  location: string;
  availability: string;
  ai_score?: number;
  ai_score_updated_at?: string;
}

export const CandidatesManagement = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [isScoringAll, setIsScoringAll] = useState(false);
  const { toast } = useToast();

  const fetchCandidates = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("candidates")
      .select("id, name, title, email, location, availability, cv, ai_score, ai_score_updated_at")
      .order("ai_score", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch candidates",
        variant: "destructive",
      });
    } else {
      setCandidates(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this candidate?")) return;

    const { error } = await supabase.from("candidates").delete().eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete candidate",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Candidate deleted successfully",
      });
      fetchCandidates();
    }
  };

  const handleEdit = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setSelectedCandidate(null);
    setIsDialogOpen(true);
  };

  const handleFormSuccess = () => {
    setIsDialogOpen(false);
    setSelectedCandidate(null);
    fetchCandidates();
  };

  const handleBatchScore = async () => {
    if (!confirm("This will calculate AI scores for all candidates. This may take a few minutes. Continue?")) {
      return;
    }

    setIsScoringAll(true);
    
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/batch-score-candidates`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
        }
      );

      const result = await response.json();

      if (response.ok) {
        toast({
          title: "Batch Scoring Complete",
          description: `Successfully scored ${result.successful} candidates. Failed: ${result.failed}`,
        });
        fetchCandidates();
      } else {
        throw new Error(result.error || "Failed to score candidates");
      }
    } catch (error: any) {
      console.error("Batch scoring error:", error);
      toast({
        title: "Batch Scoring Failed",
        description: error.message || "An error occurred while scoring candidates",
        variant: "destructive",
      });
    } finally {
      setIsScoringAll(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold">Candidates Management</h1>
            <p className="text-muted-foreground mt-2">
              Manage all candidates in the system
            </p>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={handleBatchScore} 
              variant="outline"
              disabled={isScoringAll || loading}
              className="gap-2"
            >
              {isScoringAll ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  Scoring...
                </>
              ) : (
                <>
                  ⭐ Calculate AI Scores
                </>
              )}
            </Button>
            <Button onClick={handleAdd} className="gap-2">
              <Plus size={20} />
              Add Candidate
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="glass rounded-lg border border-border/50">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Availability</TableHead>
                  <TableHead>AI Score</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {candidates.map((candidate) => (
                  <TableRow key={candidate.id}>
                    <TableCell className="font-medium">{candidate.name}</TableCell>
                    <TableCell>{candidate.title}</TableCell>
                    <TableCell>{candidate.email}</TableCell>
                    <TableCell>{candidate.location}</TableCell>
                    <TableCell>{candidate.availability}</TableCell>
                    <TableCell>
                      {candidate.ai_score ? (
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-primary">{candidate.ai_score}</span>
                          <span className="text-xs text-muted-foreground">/ 100</span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">Not scored</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(candidate)}
                      >
                        <Pencil size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(candidate.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {selectedCandidate ? "Edit Candidate" : "Add Candidate"}
              </DialogTitle>
            </DialogHeader>
            <CandidateForm
              candidate={selectedCandidate}
              onSuccess={handleFormSuccess}
              onCancel={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};
