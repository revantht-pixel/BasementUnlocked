import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Questionnaire from "@/components/Questionnaire";
import { getPropertyAny } from "@/lib/property";

export default async function CheckPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = await getPropertyAny(id);
  if (!p) notFound();
  return (
    <div style={{ minHeight: "100dvh", fontSize: 18, lineHeight: 1.55, paddingBottom: 96 }}>
      <Header dataNote={p.dataMode === "live" ? "Live data" : "Saved data from Nov 6, 2026"} />
      <Questionnaire id={p.id} />
    </div>
  );
}
