"use client";
import Link from "next/link";
import { Suspense } from "react";
import { supabase } from "@/utils/supabase/supabase";
import { redirect, useSearchParams } from "next/navigation";
import { confirmReset } from "@/serverActions/authAction";
import { useEffect } from "react";

export default function ForgotPassword() {
  const searchparams = useSearchParams();
  const searchParam = searchparams.get("message");

  useEffect(() => {
    const fetchuser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        return redirect("/");
      }
    };
    fetchuser();
  }, [searchParam]);

  return (
    <Suspense fallback={<div className="w-full h-screen flex items-center justify-center"><span className="loader"></span></div>}>
    <div className="w-full h-screen flex flex-col justify-center bg-[#c59fdb] ">
      <div className=" sm:max-w-md w-2xl min-h-fit p-10 py-16 rounded-md shadow-2xl mx-auto">
        <form
          className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground mb-4"
          action={confirmReset}
        >
          <label className="text-md" htmlFor="email">
            Enter Email Address
          </label>
          <input
            className="rounded-md px-4 py-2 bg-inherit border mb-6"
            name="email"
            placeholder="you@gmail.com"
            required
          />

          <button className="bg-indigo-700 cursor-pointer font-semibold rounded-md px-4 py-2 text-foreground mb-2">
            Send link
          </button>

          {searchParam && (
            <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">
              {searchParam}
            </p>
          )}
        </form>

        <Link
          href="/login"
          className="flex gap-2 items-center rounded-md no-underline text-foreground text-md"
        >
          Remember your password?
          <p className="text-indigo-600 font-mono underline">Signin</p>
        </Link>
        <p className="mt-4 text-red-700 select-none">
          <span className="font-serif font-semibold">Note:</span>
          <span>
            1. After submitting you can get the magic link in your mail for
            reset password.
          </span>
          <br />
          <span>
            2. If you can't get the mail means your email is not verified so
            signUp.
          </span>
        </p>
      </div>
    </div>
    </Suspense>
  );
}
