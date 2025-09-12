import { auth } from "@/app/auth";
import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";
import UpgradeButton from "@/app/components/UpgradeButton"; // <-- IMPORT THE NEW BUTTON

const prisma = new PrismaClient();

// This is a protected route. It will fetch the current user's data.
export default async function DashboardPage() {
  const session = await auth();

  // If there is no session, redirect the user to the login page.
  if (!session?.user?.id) {
    redirect("/login");
  }

  // Fetch the full user object from the database to check their status
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    // This case should be rare if they have a session
    redirect("/login");
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-6">Dashboard</h1>
      <div className="bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800">Account Status</h2>
        <p className="mt-2 text-lg">
          You are currently a:{" "}
          <span className="font-semibold text-indigo-600">
            {user.isBusiness ? "Business User" : "Standard User"}
          </span>
        </p>

        {!user.isBusiness && (
          <div className="mt-6 border-t pt-6">
            <h3 className="text-xl font-bold text-gray-800">Upgrade to a Business Account</h3>
            <p className="mt-2 text-gray-600">
              Create and manage your own study spot listing to attract more customers.
            </p>
            <div className="mt-4">
              {/* The placeholder is now replaced with the actual button */}
              <UpgradeButton />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

