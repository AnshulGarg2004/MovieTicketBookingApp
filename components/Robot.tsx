// 'use client'

// import { SplineScene } from "@/components/ui/splite";
// import { Card } from "@/components/ui/card"
// import { Spotlight } from "./ui/spotlight";

// export function SplineSceneBasic() {
//   return (
//     <Card className="w-full h-[500px] bg-black/[0.96] relative overflow-hidden">
//       <Spotlight
//         className="-top-40 left-0 md:left-60 md:-top-20"

//       />

//       <div className="flex h-full">
//         {/* Left content */}
//         <div className="flex-1 p-8 relative z-10 flex flex-col justify-center">
//           <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
//             Interactive 3D
//           </h1>
//           <p className="mt-4 text-neutral-300 max-w-lg">
//             Bring your UI to life with beautiful 3D scenes. Create immersive experiences 
//             that capture attention and enhance your design.
//           </p>
//         </div>

//         {/* Right content */}
//         <div className="flex-1 relative">
//           <SplineScene 
//             scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
//             className="w-full h-full"
//           />
//         </div>
//       </div>
//     </Card>
//   )
// }

'use client'

import { SplineScene } from "@/components/ui/splite";
import { Card } from "@/components/ui/card"
import { Spotlight } from "@/components/ui/spotlight"
import Link from "next/link";

export function SplineSceneBasic() {
    return (
        <Card className="relative w-full h-screen min-h-screen bg-black/[0.96] overflow-hidden rounded-none border-none">
            <Spotlight
                className="-top-40 left-0 md:left-60 md:-top-10 spotlight"
                size={350}
            />

            <div className="flex h-full">
                <div className="flex-1 p-8 relative z-10 flex flex-col justify-center h-full ml-10">
                    <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-b from-white to-neutral-400 bg-clip-text text-transparent drop-shadow-xl">
                        ShowSphere
                    </h1>

                    <p className="mt-6 text-neutral-300 max-w-lg text-lg leading-relaxed">
                        Welcome to ShowSphere — your gateway to the world of entertainment.
                        Browse the latest movies, choose your perfect showtime, and book seats
                        instantly with a smooth, cinematic experience.
                    </p>

                    <Link
                        href="/home"
                        className="mt-8 inline-block px-4 py-2 rounded-lg text-m font-bold max-w-[200px] pl-15 py-5 bg-gradient-to-r from-[#ff6b6b] to-[#ff5252] text-white hover:opacity-90 transition"
                    >
                        Book Now
                    </Link>

                </div>

                <div className="flex-1 relative min-h-full h-full">
                    <SplineScene
                        scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                        className="absolute inset-0"
                    />
                </div>
            </div>
        </Card>
    )
}
