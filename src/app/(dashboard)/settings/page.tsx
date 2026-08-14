import { 
    User,
    Mail,
    Lock,
    Shield,
    Key,
    LogOut,
    Pencil
} from "lucide-react";
import CardWrapper from "@/components/molecules/CardWrapper";
import ReadOnlyInput from "@/components/molecules/ReadOnlyInput";
import ButtonPill from "@/components/atoms/ButtonPill";
import Image from "next/image";
import FadeIn from "@/components/atoms/framer/FadeIn";
import { Heading, Text } from "@/components/atoms/Typography";

export default function Settings() {
  return (
    <FadeIn direction="up" className="mx-auto w-full px-2">
      
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
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              
              {/* Avatar */}
              <div className="h-[68px] w-[68px] shrink-0 overflow-hidden rounded-full border border-slate-200 bg-white">
                <Image
                  src="/assets/images/student.webp" 
                  alt="Avatar Jojo"
                  width={150}
                  height={150}
                  className="h-full w-full object-cover"
                />
              </div>
              
              {/* Teks Identitas */}
              <div className="flex flex-col">
                <span className="text-[11px] font-extrabold tracking-wider text-slate-500 uppercase">
                  Explorer Name
                </span>
                <span className="text-[22px] font-black tracking-tight text-slate-800">
                  JOJO
                </span>
              </div>
            </div>

            {/* Tombol Edit Profile */}
            <button className="flex items-center gap-2 rounded-full bg-slate-200/80 px-4 py-2 text-[13px] font-bold text-slate-700 transition-colors hover:bg-slate-300 active:scale-[0.98]">
              <Pencil className="h-3.5 w-3.5" strokeWidth={2.5} />
              Edit Profile
            </button>
          </div>

          {/* Form Input Read-Only */}
          <div className="flex flex-col gap-3">
            <ReadOnlyInput icon={Mail} value="Jojo12346@gmail.com" />
            <ReadOnlyInput icon={Lock} value="Jojo1234#" />
            <ReadOnlyInput icon={User} value="Jojo Sutarman" />
          </div>
        </CardWrapper>

        {/* ==========================================
            CARD 2: ACCOUNT SECURITY
            ========================================== */}
        <CardWrapper title="Account Security" icon={Shield}>
          <div className="flex flex-col gap-3 pt-1">
            <ButtonPill icon={Key} variant="secondary">
              Change Password
            </ButtonPill>
            
            <ButtonPill icon={LogOut} variant="danger">
              Log Out
            </ButtonPill>
          </div>
          
        </CardWrapper>

      </div>
    </FadeIn>
  );
}