import { getSessionUser } from "@/lib/auth";
import { getAccountDashboard } from "@/lib/account";
import { AccountDashboard } from "@/components/store/account-dashboard";
import { AccountLogin } from "@/components/store/account-login";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const session = await getSessionUser();
  if (!session) return <AccountLogin />;

  const data = await getAccountDashboard(session.id);
  if (!data) redirect("/account");

  return <AccountDashboard data={data} />;
}
