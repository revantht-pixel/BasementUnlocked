import { notFound } from "next/navigation";
import Header from "@/components/Header";
import PlanView from "@/components/PlanView";
import { parseAnswers } from "@/lib/data";
import { getPropertyAny } from "@/lib/property";
import { getRent } from "@/lib/rent";

export default async function PlanPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { id } = await params;
  const property = await getPropertyAny(id);
  if (!property) notFound();
  const answers = parseAnswers(await searchParams);
  const rent = await getRent(answers.bedrooms);
  return (
    <div style={{ minHeight: "100dvh" }}>
      <Header />
      <PlanView property={property} answers={answers} rent={rent} />
    </div>
  );
}
