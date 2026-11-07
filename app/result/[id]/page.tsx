import { notFound } from "next/navigation";
import Header from "@/components/Header";
import ResultView from "@/components/ResultView";
import { getProperty, parseAnswers } from "@/lib/data";
import { getRent } from "@/lib/rent";

export default async function ResultPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { id } = await params;
  const property = getProperty(id);
  if (!property) notFound();
  const answers = parseAnswers(await searchParams);
  const rent = await getRent(answers.bedrooms);
  return (
    <div style={{ minHeight: "100dvh" }}>
      <Header />
      <ResultView property={property} initialAnswers={answers} rent={rent} />
    </div>
  );
}
