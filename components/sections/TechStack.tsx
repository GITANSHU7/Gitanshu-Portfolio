"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const technologies = [
    { name: "ReactJs", src: "/react.png" },
    { name: "Typescript", src: "/typescript copy.png" },
    { name: "Nodejs", src: "/nodejs-dark.png" },
    { name: "ExpressJS", src: "/express-white.png" },
    { name: "Mongodb", src: "/mongodb-white.png" },
    { name: "Nextjs", src: "/next.svg" },
    { name: "AWS", src: "/AWS.png" },
    { name: "Github", src: "/github-white.png" },
    { name: "AdonisJS", src: "/adonis (2).png" },
    { name: "Mysql", src: "/mysql.png" },
    { name: "Supabase", src: "/supabase.png" },
    { name: "Firebase", src: "/firebase.png" },
    { name: "Azure", src: "/azure.png" },
];

export function TechStack() {
    // Duplicate for seamless loop
    const doubledTechs = [...technologies, ...technologies, ...technologies];

    // Roughly matches the theme's primary color: hsl(263, 70%, 50%)
    const themeColorHex = "8b5cf6";

    return (
        <section className="py-16 bg-background relative overflow-hidden border-y border-primary/10">
            {/* Subtle primary glow background */}
            <div className="absolute inset-0 bg-primary/[0.02] pointer-events-none" />

            {/* Gradient Mask for fade effect - using from-background for perfect blending */}
            <div className="absolute inset-y-0 left-0 w-24 md:w-64 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-24 md:w-64 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

            <div className="flex flex-col items-center mb-12 relative z-20">
                <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.4em] text-primary/60">
                    Technology Stack
                </p>
            </div>

            <div className="flex overflow-hidden group relative z-20">
                <motion.div
                    className="flex whitespace-nowrap items-center py-4"
                    animate={{
                        x: [0, "-33.33%"],
                    }}
                    transition={{
                        x: {
                            repeat: Infinity,
                            repeatType: "loop",
                            duration: 40,
                            ease: "linear",
                        },
                    }}
                >
                    {doubledTechs.map((tech, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-center px-10 md:px-16 flex-shrink-0 opacity-40 hover:opacity-100 transition-all duration-500 cursor-default"
                        >
                            <img
                                src={'src' in tech ? tech.src : `https://cdn.simpleicons.org/${tech?.slug}/${themeColorHex}`}
                                alt={tech.name}
                                className="h-8 md:h-10 w-auto object-contain select-none block"
                                style={{
                                    maxHeight: '40px',
                                    // Apply a filter to local images to tint them towards the primary color
                                    filter: 'src' in tech ? 'brightness(0) saturate(100%) invert(45%) sepia(93%) saturate(1400%) hue-rotate(230deg) brightness(100%) contrast(100%)' : 'none'
                                }}
                            />
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
