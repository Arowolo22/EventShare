// "use client";

// import Navbar from "@/components/ui/navbar";
// import { useState } from "react";
// import { createUserWithEmailAndPassword } from "firebase/auth";
// import { auth } from "@/auth-server/firebase";
// import toast from "react-hot-toast";

// export default function Signup() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     try {
//       await createUserWithEmailAndPassword(auth, email, password);
//       toast.success("User Registered Successfully");
//     } catch (err) {
//       setError(err.message || "Failed to register");
//     } finally {
//       setLoading(false);
//     }
//   };
//   return (
//     <>
//       <Navbar />
//       <section className="bg-gray-50 py-27">
//         <div className="max-w-7xl text-center mx-auto px-4 sm:px-6 lg:px-8 py-12">
//           <h1 className="text-gray-900 font-bold text-3xl">
//             Create Your Account
//           </h1>
//           <p className="text-gray-600 mt-2">
//             Sign up to start creating and sharing events
//           </p>

//           <form
//             className="mt-8 max-w-2xl mx-auto text-left"
//             onSubmit={handleSubmit}
//           >
//             <div className="mb-6">
//               <label
//                 htmlFor="email"
//                 className="block text-sm font-medium text-gray-700 mb-2"
//               >
//                 Email
//               </label>
//               <input
//                 type="email"
//                 id="email"
//                 name="email"
//                 placeholder="your.email@example.com"
//                 className="w-full px-4 py-3 border text-black border-gray-500 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none transition"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//               />
//             </div>

//             <div className="mb-6">
//               <label
//                 htmlFor="password"
//                 className="block text-sm font-medium text-gray-700 mb-2"
//               >
//                 Password
//               </label>
//               <input
//                 type="password"
//                 id="password"
//                 name="password"
//                 placeholder="••••••••"
//                 className="w-full px-4 py-3 border text-black border-gray-500 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none transition"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//               />
//             </div>
//             {error && (
//               <div className="text-red-500 text-sm text-center">{error}</div>
//             )}

//             <button
//               type="submit"
//               className="w-full bg-green-900 text-white font-semibold py-3 px-6 rounded-lg hover:bg-green-800 transition"
//               disabled={loading}
//             >
//               {loading ? "Signing Up..." : "Sign Up"}
//             </button>
//           </form>

//           <div className="mt-6 text-center">
//             <p className="text-sm text-gray-600">
//               Already have an account?{" "}
//               <a
//                 href="/auth/login"
//                 className="text-green-900 font-medium hover:underline"
//               >
//                 Sign in
//               </a>
//             </p>
//           </div>
//         </div>
//       </section>
//     </>
//   );
// }
