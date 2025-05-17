// components/ProfileFormInner.tsx
'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Image from "next/image";
import { FaEye } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signup } from "@/serverActions/authAction";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

export default function ProfileForm() {
  const searchParams = useSearchParams();
  const searchParam = searchParams.get('message');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: ""
    },
  });

  const [toggle, setToggle] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleToggle = () => setToggle(!toggle);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("email", data.email);
      formData.append("password", data.password);
      await signup(formData);
      toast('A confirmation link has been sent to your email, check your spam folder too.');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen bg-[#c59fdb] select-none">
      <div className="flex min-h-full items-center flex-col md:flex-row justify-center px-6 py-8 lg:px-8 ">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm ">
          <Image
            className="mx-auto "
            src="/ff.png"
            alt="friendship/fusion"
            width={280}
            height={35}
            priority
          />
          <h2 className="font-serif mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Welcome To Friendship Fusion
          </h2>
        </div>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm ">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block text-sm font-medium text-gray-900">Email address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Email Address"
                        type="email"
                        id="email"
                        required
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 placeholder:text-gray-400 focus:outline-indigo-600"
                        {...field}
                      />
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
                    <FormLabel className="block text-sm font-medium text-gray-900">Password</FormLabel>
                    <FormControl>
                      <div className="mb-3 flex items-center justify-end">
                        <Input
                          placeholder="Choose a Password"
                          type={toggle ? "text" : "password"}
                          id="password"
                          required
                          className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 placeholder:text-gray-400 focus:outline-indigo-600"
                          {...field}
                        />
                        <FaEye className="text-2xl absolute cursor-pointer mr-2" onClick={handleToggle} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {searchParam && (
                <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">{searchParam}</p>
              )}
              <Button
                disabled={loading}
                type="submit"
                className={`flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold text-white shadow ${
                  loading ? "bg-gray-900 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-500"
                }`}
              >
                {loading ? "Signing up..." : "Sign up"}
              </Button>
            </form>
          </Form>
          <p className="mt-8 text-center text-md text-gray-900">
            Already have an account?
            <Link href="/login" className="font-semibold text-indigo-800 hover:text-zinc-900 ml-2">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
