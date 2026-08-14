"use client";

import Link from "next/link";
const APP_NAME = "AuraLearn"
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heading, Text } from "@/components/atoms/Typography";
import { Mail, Lock, EyeOff, Eye, Sparkles, User } from "lucide-react";
import { usePasswordVisibility } from "@/hooks/usePasswordVisibility";
import FadeIn from "@/components/atoms/framer/FadeIn";
import { useState } from "react";

export default function AuthPage() {
  const { isVisible, toggleVisibility, inputType } = usePasswordVisibility();
  
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const confirmInputType = isConfirmVisible ? "text" : "password";
  const toggleConfirmVisibility = () => setIsConfirmVisible(!isConfirmVisible);

  const [isLogin, setIsLogin] = useState(true);

  return (
      <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#f0f4f8] p-4 md:p-8">
        
        <div className="pointer-events-none absolute -left-32 -top-32 h-[450px] w-[450px] rounded-full bg-indigo-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -right-32 h-[450px] w-[450px] rounded-full bg-amber-200/30 blur-3xl" />

        <div className="relative z-10 flex min-h-[620px] w-full max-w-5xl flex-col overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.07)] lg:flex-row">
          
          {/* ==========================================
              SISI KIRI: Ilustrasi
              ========================================== */}
          <div className="relative flex w-full flex-col items-center justify-center bg-gradient-to-b from-slate-50/80 to-indigo-50/20 p-8 lg:w-1/2 lg:p-12">
            <div className="flex w-full max-w-md flex-col items-center text-center">
              <div className="mb-8 w-full overflow-hidden rounded-2xl border border-slate-100/80 bg-white p-4 shadow-sm">
                <Image
                  src="/assets/images/prof-paw.webp" 
                  alt="Professor Paw" 
                  width={800}
                  height={800}
                  className="h-full w-full rounded-xl object-cover"
                />
              </div>
              
              {/* Animasi teks isLogin */}
              <FadeIn key={isLogin ? "left-title-login" : "left-title-signup"} direction="down" duration={0.4}>
                <Heading variant="headline-medium" className="mb-2 font-bold tracking-tight text-slate-900">
                  {isLogin ? "Learn with friends!" : "Start your adventure!"}
                </Heading>
                <Text variant="muted" className="text-sm font-medium text-slate-500">
                  {isLogin 
                    ? "Join Professor Paw on a journey of discovery." 
                    : "Create an account to unlock all learning features."}
                </Text>
              </FadeIn>
            </div>
          </div>

          {/* ==========================================
              SISI KANAN: Form Authentication
              ========================================== */}
          <div className="flex w-full flex-col justify-center bg-white p-8 lg:w-1/2 lg:p-12">
            <div className="mx-auto w-full max-w-sm space-y-6">
              
              {/* Header Teks Dinamis dengan FadeIn */}
              <FadeIn key={isLogin ? "right-header-login" : "right-header-signup"} direction="down" duration={0.4}>
                {isLogin ? (
                  <div>
                    <div className="mb-4 flex items-center gap-2.5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
                        <Sparkles className="h-5 w-5" />
                      </div>
                      <Heading variant="headline-large" className="font-extrabold tracking-tight text-indigo-dark md:block">
                        {APP_NAME}
                      </Heading>
                    </div>
                    <Heading variant="headline-medium">Welcome back, explorer!</Heading>
                    <Text variant="muted">Ready for your next adventure?</Text>
                  </div>
                ) : (
                  <div className="text-center">
                    <Heading variant="headline-large" className="font-extrabold text-slate-900 mb-2">
                      Buat Akun Baru
                    </Heading>
                    <Text variant="small" className="text-slate-500 font-medium">
                      Mulai perjalanan belajarmu bersama AuraLearn AI!
                    </Text>
                  </div>
                )}
              </FadeIn>

              {/* Form Induk dibungkus dengan FadeIn agar saat berganti tidak patah */}
              <FadeIn key={isLogin ? "form-login" : "form-signup"} direction="up" duration={0.5} delay={0.1}>
                <form className="space-y-4" action="/dashboard/progress">
                  
                  {/* =======================================
                      FORM SIGN UP
                      ======================================= */}
                  {!isLogin ? (
                    <div className="space-y-4">
                      
                      <div className="space-y-1.5">
                        <Text variant="label-bold" className="text-[13px] text-slate-800">Nama Lengkap</Text>
                        <Input 
                          type="text" 
                          placeholder="Masukkan nama lengkap" 
                          className="h-[46px] rounded-xl border-slate-200 bg-white px-4 text-slate-900 placeholder:text-slate-400 focus-visible:border-indigo-500 focus-visible:ring-indigo-500/20"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Text variant="label-bold" className="text-[13px] text-slate-800">Email</Text>
                        <Input 
                          type="email" 
                          placeholder="Masukkan email" 
                          className="h-[46px] rounded-xl border-slate-200 bg-white px-4 text-slate-900 placeholder:text-slate-400 focus-visible:border-indigo-500 focus-visible:ring-indigo-500/20"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Text variant="label-bold" className="text-[13px] text-slate-800">Password</Text>
                        <div className="relative">
                          <Input 
                            type={inputType} 
                            placeholder="Masukkan password" 
                            className="h-[46px] rounded-xl border-slate-200 bg-white pl-4 pr-11 text-slate-900 placeholder:text-slate-400 focus-visible:border-indigo-500 focus-visible:ring-indigo-500/20"
                          />
                          <button 
                            type="button" 
                            onClick={toggleVisibility} 
                            className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
                          >
                            {isVisible ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Text variant="label-bold" className="text-[13px] text-slate-800">Konfirmasi Password</Text>
                        <div className="relative">
                          <Input 
                            type={confirmInputType} 
                            placeholder="Masukkan kembali password" 
                            className="h-[46px] rounded-xl border-slate-200 bg-white pl-4 pr-11 text-slate-900 placeholder:text-slate-400 focus-visible:border-indigo-500 focus-visible:ring-indigo-500/20"
                          />
                          <button 
                            type="button" 
                            onClick={toggleConfirmVisibility} 
                            className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
                          >
                            {isConfirmVisible ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5 pt-1">
                        <input 
                          type="checkbox" 
                          id="terms" 
                          className="mt-[3px] h-4 w-4 shrink-0 rounded border-slate-300 text-[#6B4EFF] focus:ring-[#6B4EFF]" 
                        />
                        <label htmlFor="terms" className="text-[12px] leading-[18px] text-slate-500">
                          Saya menyetujui <Link href="#" className="font-medium text-[#6B4EFF] hover:underline">Syarat & Ketentuan</Link> dan <Link href="#" className="font-medium text-[#6B4EFF] hover:underline">Kebijakan Privasi</Link>
                        </label>
                      </div>

                      <Button type="submit" className="mt-2 h-12 w-full rounded-xl bg-[#6B4EFF] text-[15px] font-bold text-white shadow-md shadow-[#6B4EFF]/20 transition-all hover:bg-indigo-700">
                        Daftar
                      </Button>
                    </div>
                  ) : (
                    
                    /* =======================================
                        FORM LOG IN
                       ======================================= */
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <Text variant="label-bold">Email address</Text>
                        <div className="relative">
                          <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                          <Input 
                            type="email" 
                            placeholder="explorer@auralearn.com" 
                            className="h-12 rounded-xl border-slate-200 bg-slate-50/60 pl-10 text-slate-900 placeholder:text-slate-400 focus-visible:border-indigo-600 focus-visible:ring-indigo-600/20"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Text variant="label-bold">Password</Text>
                          <Link href="#" className="text-sm font-medium text-indigo-base hover:underline">
                            Forgot password?
                          </Link>
                        </div>
                        <div className="relative">
                          <Lock className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                          <Input 
                            type={inputType} 
                            placeholder="••••••••" 
                            className="h-12 rounded-xl border-0 bg-[#F3F4F6] pl-11 pr-11 text-[15px] text-slate-900 placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-indigo-base"
                          />
                          <button 
                            type="button" 
                            onClick={toggleVisibility} 
                            className="absolute right-4 top-3.5 text-slate-400 transition-colors hover:text-slate-600"
                          >
                            {isVisible ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                          </button>
                        </div>
                      </div>

                      <Button type="submit" className="mt-2 h-12 w-full rounded-xl bg-indigo-600 text-[15px] font-bold text-white shadow-md shadow-indigo-600/20 transition-all hover:bg-indigo-700">
                        Start Learning
                      </Button>
                    </div>
                  )}
                </form>

                {/* Garis Pembatas "or / atau" */}
                <div className="relative flex items-center py-4">
                  <div className="flex-grow border-t border-slate-200"></div>
                  <Text variant="small" className="shrink-0 px-3 uppercase tracking-widest text-slate-400">
                    {isLogin ? "or" : "atau"}
                  </Text>
                  <div className="flex-grow border-t border-slate-200"></div>
                </div>

                {/* Tombol Google */}
                <Button variant="outline" className="h-12 w-full rounded-xl border-slate-200 bg-white font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50">
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  {isLogin ? "Continue with Google" : "Daftar dengan Google"}
                </Button>

                {/* Footer Pendaftaran / Login */}
                <div className="mt-6 text-center">
                  <Text variant="small">
                    {isLogin ? "Don't have an account? " : "Sudah punya akun? "}
                  </Text>
                  <button 
                    type="button"
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-[14px] font-bold text-[#6B4EFF] hover:underline"
                  >
                    {isLogin ? "Sign up now!" : "Masuk"}
                  </button>
                </div>
              </FadeIn>

            </div>
          </div>

        </div>
      </div>
  );
}