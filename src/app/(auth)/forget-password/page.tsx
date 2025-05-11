'use client';
import { Suspense } from "react";
import ForgotPassword from "@/components/UserAuth/ForgetPassword";

export default function Page() {
  return (
    <Suspense fallback={<div className="w-full h-screen flex items-center justify-center"><span className="loader"></span></div>}>
      <ForgotPassword />
    </Suspense>
  );
}
