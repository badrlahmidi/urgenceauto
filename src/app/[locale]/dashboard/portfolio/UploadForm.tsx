"use client";

import { Button } from "@/components/ui/button";
import { UploadCloud } from "lucide-react";
import { uploadImageAction } from "./actions";
import { toast } from "sonner";
import { useRef, useState } from "react";

export function UploadForm({ locale }: { locale: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  async function handleUpload(formData: FormData) {
    setIsUploading(true);
    const result = await uploadImageAction(formData, locale);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Image uploadée avec succès !");
      formRef.current?.reset();
    }
    setIsUploading(false);
  }

  return (
    <form ref={formRef} action={handleUpload} className="border-2 border-dashed border-gray-300 rounded-xl p-10 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors relative">
      <input
        type="file"
        name="file"
        accept="image/png, image/jpeg, image/webp"
        required
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
      />
      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 pointer-events-none">
        <UploadCloud className="w-8 h-8 text-blue-600" />
      </div>
      <h3 className="font-semibold text-lg text-gray-900 mb-1 pointer-events-none">Cliquez pour uploader</h3>
      <p className="text-gray-500 text-sm mb-6 pointer-events-none">PNG, JPG, WEBP jusqu'à 5MB</p>
      <Button type="submit" className="pointer-events-auto z-20 relative" disabled={isUploading}>
        {isUploading ? "Upload..." : "Uploader l'image"}
      </Button>
    </form>
  );
}