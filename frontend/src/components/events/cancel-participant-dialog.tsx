"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface CancelParticipantDialogProps {
  participantName: string;
  onCancel: () => void;
  onConfirm: (reason: string) => Promise<void>;
}

export function CancelParticipantDialog({ participantName, onCancel, onConfirm }: CancelParticipantDialogProps) {
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError("A cancellation reason is required");
      return;
    }
    setSubmitting(true);
    try {
      await onConfirm(reason.trim());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to cancel registration");
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true">
      <div className="bg-card text-card-foreground w-full max-w-md rounded-lg border p-5 shadow-lg">
        <h2 className="text-base font-semibold">Cancel registration</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Cancelling <span className="text-foreground font-medium">{participantName}</span>&apos;s registration. This action
          cannot be undone.
        </p>
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="cancel-reason">Reason *</Label>
            <Textarea
              id="cancel-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Event capacity reached"
              autoFocus
            />
            {error && <p className="text-destructive text-xs">{error}</p>}
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onCancel} disabled={submitting}>
              Keep registration
            </Button>
            <Button type="submit" variant="destructive" disabled={submitting}>
              {submitting ? "Cancelling..." : "Cancel registration"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
