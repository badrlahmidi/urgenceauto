"use server";

import { auth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";

export async function uploadImageAction(formData: FormData, locale: string) {
  const session = await auth();
  if (!session || session.user.role !== "PRO" || !session.user.phone) {
    return { error: "Unauthorized" };
  }

  const file = formData.get("file") as File;
  if (!file || file.size === 0) {
    return { error: "Aucun fichier sélectionné" };
  }

  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${session.user.id}-${Math.random()}.${fileExt}`;

    // Read the file as an ArrayBuffer, required by Supabase storage
    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    const { data, error } = await supabase.storage
      .from('portfolios')
      .upload(fileName, fileBuffer, {
        contentType: file.type,
      });

    if (error) throw error;

    const { data: publicUrlData } = supabase.storage
      .from('portfolios')
      .getPublicUrl(fileName);

    const pro = await db.professional.findFirst({
      where: { whatsapp: session.user.phone }
    });

    if (pro) {
      await db.professional.update({
        where: { id: pro.id },
        data: {
          images: {
            push: publicUrlData.publicUrl
          }
        }
      });
    }

    revalidatePath(`/${locale}/dashboard/portfolio`);
    return { success: true };
  } catch (error) {
    return { error: "L'upload de l'image a échoué" };
  }
}