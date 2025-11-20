"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth";

export default function Dashboard() {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome back, {user.firstName} {user.lastName}!
          </h1>
          <p className="text-gray-600 mb-6">
            Role: {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                Appointments
              </h3>
              <p className="text-blue-700">
                {user.role === "doctor"
                  ? "Manage your appointments"
                  : "View and schedule appointments"}
              </p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-green-900 mb-2">
                Medical Records
              </h3>
              <p className="text-green-700">
                Access your health records and history
              </p>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-900 mb-2">
                Profile
              </h3>
              <p className="text-purple-700">
                Update your personal information
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
