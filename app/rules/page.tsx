import Header from "@/components/Header";
import RulesReview from "@/components/RulesReview";

export default function RulesPage() {
  return (
    <div style={{ minHeight: "100dvh", fontSize: 18, lineHeight: 1.55 }}>
      <Header dataNote="Rules reviewer" />
      <RulesReview />
    </div>
  );
}
