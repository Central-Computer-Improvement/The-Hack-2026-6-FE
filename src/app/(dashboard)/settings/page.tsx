"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  User,
  Mail,
  Lock,
  Shield,
  Key,
  LogOut,
  Pencil,
  BadgeCheck,
  CheckCircle2
} from "lucide-react";
import CardWrapper from "@/components/molecules/CardWrapper";
import ReadOnlyInput from "@/components/molecules/ReadOnlyInput";
import ButtonPill from "@/components/atoms/ButtonPill";
import Image from "next/image";
import FadeIn from "@/components/atoms/framer/FadeIn";
import { Heading, Text } from "@/components/atoms/Typography";
import { useAuthStore } from "@/store/useAuthStore";
import { Badge } from "@/components/ui/badge";

export default function Settings() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    const confirmLogout = window.confirm("Apakah Anda yakin ingin keluar dari akun Anda?");
    if (!confirmLogout) return;
    logout();
    router.push("/");
  };

  const displayName = mounted && user?.name ? user.name : "Explorer";
  const displayEmail = mounted && user?.email ? user.email : "explorer@auralearn.com";
  const displayRole = mounted && user?.role ? user.role : "student";

  return (
    <FadeIn direction="up" className="mx-auto w-full max-w-4xl px-2">
      
      {/* JUDUL HALAMAN */}
      <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-[#5D44D8]">
        Settings
      </h1>

      {/* KONTAINER KARTU SETTING */}
      <div className="flex flex-col gap-6">
        
        {/* ==========================================
            CARD 1: PROFILE DETAILS
            ========================================== */}
        <CardWrapper title="Profile Details" icon={User}>
          
          {/* Banner Profil */}
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              
              {/* Avatar */}
              <div className="h-[68px] w-[68px] shrink-0 overflow-hidden rounded-full border border-slate-200 bg-white">
                <Image
                  src={user?.photo_url || "/assets/images/student.webp"} 
                  alt="Avatar"
                  width={150}
                  height={150}
                  className="h-full w-full object-cover"
                />
              </div>
              
              {/* Teks Identitas */}
              <div className="flex flex-col">
                <span className="text-[11px] font-extrabold tracking-wider text-slate-500 uppercase">
                  Account Name
                </span>
                <div className="flex items-center gap-2">
                  <span suppressHydrationWarning className="text-[22px] font-black tracking-tight text-slate-800">
                    {displayName}
                  </span>
                  <Badge className="bg-indigo-50 text-indigo-700 uppercase font-mono text-[10px] font-bold border-none">
                    {displayRole}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Form Input Read-Only */}
          <div className="flex flex-col gap-3">
            <ReadOnlyInput icon={Mail} value={displayEmail} />
            <ReadOnlyInput icon={Lock} value="••••••••••••" />
            <ReadOnlyInput icon={User} value={displayName} />
          </div>
        </CardWrapper>

        {/* ==========================================
            CARD 2: ACCOUNT SECURITY
            ========================================== */}
        <CardWrapper title="Account Security" icon={Shield}>
          <div className="flex flex-col gap-3 pt-1">
            <ButtonPill icon={Key} variant="secondary" onClick={() => alert("Untuk mengubah kata sandi, silakan hubungi administrator.")}>
              Change Password
            </ButtonPill>
            
            <ButtonPill icon={LogOut} variant="danger" onClick={handleLogout}>
              Log Out
            </ButtonPill>
          </div>
        </CardWrapper>

      </div>
    </FadeIn>
  );
}