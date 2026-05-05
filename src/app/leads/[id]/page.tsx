import { leads } from "../../../../seed-data";
import LeadDetailPage from "@/components/leads/lead-detail-page";

export function generateStaticParams() {
  return leads.map((lead) => ({ id: lead.id }));
}

export default function Page() {
  return <LeadDetailPage />;
}
