import { checkUser } from "@/lib/checkUser";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { CreateAccountDrawer } from "@/components/create-account-drawer";

export default async function DashboardPage() {
  const clerkUser = await currentUser();
  
  // Redirect to sign-in if not authenticated
  if (!clerkUser) {
    redirect('/sign-in');
  }

  // Sync user with database
  const user = await checkUser();
  
  return (
    <div>
    {/* Budget Progress  */}

    {/* overview */}


    {/* Account Grid */}
    <CreateAccountDrawer>
      Open
    </CreateAccountDrawer>

    </div>
  );
}
