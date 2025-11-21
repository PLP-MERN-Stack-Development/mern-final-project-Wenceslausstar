"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth";
import {
  CalendarDays,
  ClipboardList,
  Pill,
  TestTube,
  Activity,
  HeartPulse,
  MessageCircle,
  Bell,
  Wallet,
  GraduationCap,
  Settings,
  PhoneCall,
} from "lucide-react";

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

  const cards = [
    {
      title: "Profile Overview",
      description: "View your demographics, care team & SDoH updates",
      icon: <Settings className="w-6 h-6 text-blue-600" />,
      link: "/dashboard/profile",
      color: "bg-blue-50",
    },
    {
      title: "Appointments",
      description: "Schedule, manage, or join virtual visits",
      icon: <CalendarDays className="w-6 h-6 text-indigo-600" />,
      link: "/dashboard/appointments",
      color: "bg-indigo-50",
    },
    {
      title: "Medications",
      description: "View prescriptions and refill alerts",
      icon: <Pill className="w-6 h-6 text-green-600" />,
      link: "/dashboard/medications",
      color: "bg-green-50",
    },
    {
      title: "Lab Results",
      description: "Access labs with explanations",
      icon: <TestTube className="w-6 h-6 text-pink-600" />,
      link: "/dashboard/labs",
      color: "bg-pink-50",
    },
    {
      title: "Vitals Tracking",
      description: "Record vitals and view trends",
      icon: <Activity className="w-6 h-6 text-yellow-600" />,
      link: "/dashboard/vitals",
      color: "bg-yellow-50",
    },
    {
      title: "Care Plan",
      description: "Track goals, diagnoses & progress",
      icon: <HeartPulse className="w-6 h-6 text-red-600" />,
      link: "/dashboard/care-plan",
      color: "bg-red-50",
    },
    {
      title: "Secure Messaging",
      description: "Chat with your care team",
      icon: <MessageCircle className="w-6 h-6 text-purple-600" />,
      link: "/dashboard/messages",
      color: "bg-purple-50",
    },
    {
      title: "Alerts & Reminders",
      description: "Medication, labs & appointment alerts",
      icon: <Bell className="w-6 h-6 text-orange-600" />,
      link: "/dashboard/alerts",
      color: "bg-orange-50",
    },
    {
      title: "Billing & Insurance",
      description: "View bills, payments & insurance details",
      icon: <Wallet className="w-6 h-6 text-teal-600" />,
      link: "/dashboard/billing",
      color: "bg-teal-50",
    },
    {
      title: "Education Resources",
      description: "Personalized health learning content",
      icon: <GraduationCap className="w-6 h-6 text-emerald-600" />,
      link: "/dashboard/education",
      color: "bg-emerald-50",
    },
    {
      title: "Accessibility Settings",
      description: "Dark mode, language & text size",
      icon: <Settings className="w-6 h-6 text-slate-600" />,
      link: "/dashboard/accessibility",
      color: "bg-slate-50",
    },
    {
      title: "Emergency Support",
      description: "Quick contacts & crisis resources",
      icon: <PhoneCall className="w-6 h-6 text-rose-600" />,
      link: "/dashboard/support",
      color: "bg-rose-50",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* HEADER */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user.firstName} {user.lastName}!
          </h1>
          <p className="text-gray-600 mt-1">
            Role: {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
          </p>
        </div>

        {/* FEATURE GRID */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card, index) => (
            <div
              key={index}
              onClick={() => router.push(card.link)}
              className={`${card.color} p-5 rounded-lg shadow-sm cursor-pointer transition-transform hover:scale-105`}
            >
              <div className="flex items-center gap-3">
                {card.icon}
                <h3 className="text-lg font-semibold text-gray-900">
                  {card.title}
                </h3>
              </div>
              <p className="text-gray-700 mt-2">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
