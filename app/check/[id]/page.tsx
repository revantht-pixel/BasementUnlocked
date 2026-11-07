import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Questionnaire from "@/components/Questionnaire";
import { getProperty } from "@/lib/data";

export default async function CheckPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = getProperty(id);
  if (!p) notFound();
  return (
    <div style={{ minHeight: "100dvh", fontSize: 18, lineHeight: 1.55, paddingBottom: 96 }}>
      <Header dataNote={p.dataMode === "live" ? "Live data" : "Saved data from [date]"} />
      <Questionnaire id={p.id} />
    </div>
  );
}
