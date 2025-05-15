// components/ProfileFormInner.tsx
'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { FaEye } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { login } from "@/serverActions/authAction";
import Link from "next/link";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(2).max(20),
});

export default function ProfileForm() {
  const searchParams = useSearchParams(); // Use the hook to get searchParams
  const searchParam = searchParams.get("message"); // Access the "message" parameter

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  const [toggle, setToggle] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = () => {
    setToggle(!toggle);
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("email", data.email);
      formData.append("password", data.password);
      await login(formData);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#c59fdb] select-none">
      <div className="flex min-h-full flex-col justify-center px-6 py-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <Image
            className="mx-auto"
            src="/ff.png"
            alt="friendship/fusion"
            width={280}
            height={35}
            priority
          />
          <h2 className="mt-8 text-center text-2xl font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-sm font-medium text-gray-900">
                        Email address
                      </FormLabel>
                      <FormControl>
                        <div className="mb-4">
                          <Input
                            placeholder="Your registered Email"
                            type="email"
                            id="email"
                            required
                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 placeholder:text-gray-400 focus:outline-indigo-600"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-sm font-medium text-gray-900">
                        Password
                      </FormLabel>
                      <FormControl>
                        <div className="mb-4 relative flex items-center justify-end">
                          <Input
                            placeholder="Password"
                            type={toggle ? "text" : "password"}
                            id="password"
                            required
                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 placeholder:text-gray-400 focus:outline-indigo-600"
                            {...field}
                          />
                          <FaEye
                            className="text-2xl absolute right-3 cursor-pointer"
                            onClick={handleToggle}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {searchParam && (
                <p className="mt-2 text-red-600 p-4 bg-foreground/10 text-center">{searchParam}</p>
              )}

              <Button
                disabled={isLoading}
                className={`flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold text-white shadow-xs ${
                  isLoading
                    ? "bg-gray-900 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                }`}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </Form>
          <p className="mt-4 text-center text-md text-gray-900">
            Not a member?
            <Link href="/signup" className="font-semibold text-indigo-800 hover:text-zinc-900 ml-2">
              Sign Up
            </Link>
          </p>
          {/* <div>
            <p className="text-center text-md text-gray-900">
              Forgot password?
              <Link
                href="/forget-password"
                className="font-semibold text-indigo-800 hover:text-zinc-900 ml-2"
              >
                Forget password
              </Link>
            </p>
          </div> */}
        </div>
      </div>
    </div>
  );
}
