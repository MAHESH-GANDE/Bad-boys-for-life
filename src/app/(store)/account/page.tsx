import { getSessionUser } from "@/lib/auth";
import { AccountHome } from "@/components/store/account-home";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const user = await getSessionUser();
  return <AccountHome user={user ? { mobile: user.mobile, name: user.name, email: user.email } : null} />;
}
