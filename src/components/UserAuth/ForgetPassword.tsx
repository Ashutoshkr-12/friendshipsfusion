// 'use client';
// import Link from "next/link";
// import { useRouter, useSearchParams } from "next/navigation";

// import { confirmReset } from "@/serverActions/authAction";
// import { useState } from "react";


// export default function ForgotPassword() {
//   const [loading,setLoading] = useState(false);
//   const searchparams = useSearchParams();
//   const router = useRouter();
//   const searchParam = searchparams.get("message");


//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault()
//     const formData = new FormData(e.currentTarget)

//     setLoading(true)
//     await confirmReset(formData)

//     setLoading(false);
//     router.push(`/reset-password`);
//   }

//   return (
//     <div className="w-full h-screen flex flex-col justify-center bg-[#c59fdb] ">
//       <div className="sm:max-w-md w-2xl min-h-fit p-10 py-16 rounded-md shadow-2xl mx-auto">
//         <form
//           className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground mb-4"
//           onSubmit={handleSubmit}
//         >
//           <label className="text-md" htmlFor="email">
//             Enter Email Address
//           </label>
//           <input
//             className="rounded-md px-4 py-2 bg-inherit border mb-6"
//             name="email"
//             placeholder="you@gmail.com"
//             required
//           />

//           <button className="bg-indigo-700 cursor-pointer font-semibold rounded-md px-4 py-2 text-foreground mb-2">
//             {loading ? (<span className="bg-indigo-300">Sending...</span>) : (<>Send link</>)}
//           </button>

//           {searchParam && (
//             <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">
//               {searchParam}
//             </p>
//           )}
//         </form>

//         <Link
//           href="/login"
//           className="flex gap-2 items-center rounded-md no-underline text-foreground text-md"
//         >
//           Remember your password?
//           <p className="text-indigo-600 font-mono underline">Signin</p>
//         </Link>

//         <p className="mt-4 text-red-700 select-none">
//           <span className="font-serif font-semibold">Note:</span>
//           <span>
//             1. After submitting you can get the magic link in your mail for reset password.
//           </span>
//           <br />
//           <span>
//             2. If you can&apos;t get the mail means your email is not verified so signUp.
//           </span>
//         </p>
//       </div>
//     </div>
//   );
// }
