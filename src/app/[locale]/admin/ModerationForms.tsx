"use client";

import { Button } from "@/components/ui/button";
import { approveProAction, rejectProAction } from "./actions";
import { toast } from "sonner";

export function ApproveProForm({ proId, locale }: { proId: string; locale: string }) {
  async function handleApprove(formData: FormData) {
    const result = await approveProAction(formData, locale);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Professionnel approuvé avec succès");
    }
  }

  return (
    <form action={handleApprove}>
      <input type="hidden" name="proId" value={proId} />
      <Button type="submit" size="sm" variant="success">Approuver</Button>
    </form>
  );
}

export function RejectProForm({ pro, locale }: { pro: any; locale: string }) {
  async function handleReject(formData: FormData) {
    const result = await rejectProAction(formData, locale);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Opération réussie");
    }
  }

  return (
    <form action={handleReject}>
      <input type="hidden" name="proId" value={pro.id} />
      <Button type="submit" size="sm" variant="destructive">
        {pro.status === 'PENDING' ? 'Rejeter' : 'Supprimer'}
      </Button>
    </form>
  );
}
