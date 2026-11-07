import { notFound } from "next/navigation";
import Header from "@/components/Header";
import PhotoCoach from "@/components/PhotoCoach";
import { getPropertyAny } from "@/lib/property";

export default async function PhotoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const property = await getPropertyAny(id);
  if (!property) notFound();
  return (
    <div style={{ minHeight: "100dvh", fontSize: 18, lineHeight: 1.55 }}>
      <Header dataNote={property.address} />
      <PhotoCoach propertyId={property.id} />
    </div>
  );
}
