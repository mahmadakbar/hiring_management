import CardBackground from "@components/molecules/Card/CardBackground";
import CardInvoice from "@components/molecules/Card/CardInvoice";
import AdminJoblist from "@components/organisms/JobList/AdminJoblist";

export default function DashboardTemplate() {
  return (
    <div className="flex w-full gap-6">
      <AdminJoblist />

      <CardBackground />
    </div>
  );
}
