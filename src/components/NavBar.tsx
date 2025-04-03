// "use client";
// import Link from "next/link";
// import Image from "next/image";
// import { Menu, X } from "lucide-react";
// import { useState } from "react";
// import gradient from "../../public/gradient.png";

// interface NavBarProps {
//   isHome?: boolean;
// }

// export default function NavBar({ isHome = true }: NavBarProps) {
//   const [isOpen, setIsOpen] = useState(false);
//   return (
//     <div className="w-11/12 md:max-w-6xl relative mx-auto group">
//       {/* <div className="absolute -bottom-40 bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 z-0 p-4"></div> */}
//       <div className="absolute inset-0 w-3/4 mx-auto left-0 right-0 rounded-full h-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
//         <Image src={gradient} alt="" className="w-full h-full object-cover" />
//       </div>
//       <nav
//         className={`relative z-10 flex bg-white items-center justify-between p-4 px-6 mt-4 md:mt-6 border ${
//           isOpen ? "rounded-t-[36px] border-b-0" : "rounded-[36px] shadow-md"
//         }  `}
//       >
//         <Image src="/Termina-logo.png" alt="" width={120} height={100} />

//         <div className="flex items-center space-x-12">
//           {/* <Link
//             href="https://x.com/use_Termina/status/1883078030907908389"
//             className="hidden md:block font-medium cursor-pointer hover:text-blue-600"
//           >
//             About
//           </Link> */}

//           {/* <Link
//             href="#"
//             className="hidden md:block font-medium cursor-pointer hover:text-blue-600"
//           >
//             Features
//           </Link> */}

//           {/* <Link
//             href="#"
//             className="hidden md:block font-medium cursor-pointer hover:text-blue-600"
//           >
//             White Paper
//           </Link> */}
//           <div>
//             <appkit-button />
//           </div>
//         </div>

//         {/* <MobileNav /> */}
//         <div className="md:hidden">
//           <button
//             onClick={() => setIsOpen(!isOpen)}
//             className="p-2"
//             aria-label="Toggle menu"
//           >
//             {isOpen ? <X size={24} /> : <Menu size={24} />}
//           </button>

//           {isOpen && (
//             <div className="absolute w-full top-[80px] left-0 right-0 bg-white border-b rounded-b-[36px] shadow-md p-4 space-y-4">
//               <Link
//                 href="https://x.com/use_Termina/status/1883078030907908389"
//                 className="block py-2 font-medium hover:text-blue-600"
//                 onClick={() => setIsOpen(false)}
//               >
//                 About
//               </Link>

//               <Link
//                 href="#"
//                 className="block py-2 font-medium hover:text-blue-600"
//                 onClick={() => setIsOpen(false)}
//               >
//                 Features
//               </Link>

//               <Link
//                 href="#"
//                 className="block py-2 font-medium hover:text-blue-600"
//                 onClick={() => setIsOpen(false)}
//               >
//                 White Paper
//               </Link>
//             </div>
//           )}
//         </div>
//       </nav>
//     </div>
//   );
// }
