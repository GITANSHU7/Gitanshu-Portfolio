"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Link as ScrollLink } from "react-scroll";
import { ArrowRight, Download } from "lucide-react";
import Image from "next/image";
import { getYearsOfExperience } from "@/lib/utils";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export function Hero() {
    const [resumeUrl, setResumeUrl] = useState<string | null>(null);

    useEffect(() => {
        const fetchResume = async () => {
            const { data: { publicUrl } } = supabase.storage
                .from('resumes')
                .getPublicUrl('resume.pdf');
            
            // Optional: check if file exists
            const res = await fetch(publicUrl, { method: 'HEAD' });
            if (res.ok) setResumeUrl(publicUrl);
        };
        fetchResume();
    }, []);

    return (
        <section
            id="hero"
            className="min-h-screen flex items-center pt-20 overflow-hidden relative"
        >
            {/* Background blobs */}
            <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl -z-10" />

            <div className="container mx-auto px-4 md:px-6 grid md:grid-cols-2 gap-12 items-center">
                {/* Text Content */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                        Available for Freelance Work
                    </div>

                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
                        Hello, I&apos;m <br />
                        <span className="text-primary">Gitanshu Gautam</span>
                    </h1>

                    {/* <p className="text-xl text-muted-foreground mb-8 max-w-lg leading-relaxed">
                        A creative <strong>Full Stack Developer</strong> & <strong>Freelancer</strong> passionate about building premium, accessible, and pixel-perfect web experiences.
                    </p> */}
                    <p className="text-xl text-muted-foreground mb-8 max-w-lg leading-relaxed">
                        A performance-focused <strong>Full Stack Developer</strong> & <strong>Freelancer</strong> specializing in React, Next.js and Node.js. I build scalable, secure, and pixel-perfect digital products designed for enterprise, product teams, and ambitious startups.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <ScrollLink
                            to="portfolio"
                            smooth={true}
                            duration={500}
                            offset={-70}
                        >
                            <Button size="lg" className="rounded-full group w-full sm:w-auto">
                                View Portfolio
                                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </ScrollLink>
                        <Button 
                            size="lg" 
                            variant="outline" 
                            className="rounded-full"
                            onClick={() => resumeUrl && window.open(resumeUrl, '_blank')}
                            disabled={!resumeUrl}
                        >
                            Download CV
                            <Download className="ml-2 h-4 w-4" />
                        </Button>
                    </div>

                    <div className="mt-12 flex gap-8">
                        <div className="text-center md:text-left">
                            <h3 className="text-3xl font-bold">{getYearsOfExperience()}+</h3>
                            <p className="text-muted-foreground text-sm">Years Experience</p>
                        </div>
                        <div className="text-center md:text-left">
                            <h3 className="text-3xl font-bold">12+</h3>
                            <p className="text-muted-foreground text-sm">Projects Done</p>
                        </div>
                    </div>
                </motion.div>

                {/* Image / Visual */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="relative"
                >
                    <div className="relative z-10 w-full aspect-square max-w-md mx-auto bg-gradient-to-b from-primary/20 to-transparent rounded-full overflow-hidden border border-primary/20 p-4">
                        <div className="w-full h-full bg-muted rounded-full relative overflow-hidden">
                            <Image
                                src="/profile_pic2.png"
                                alt="Gitanshu Gautam"
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    </div>

                    {/* Floating Cards */}
                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                        className="absolute top-10 right-10 z-20 bg-card p-4 rounded-xl shadow-lg border border-border/50 hidden md:block"
                    >
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full" />
                            <span className="text-sm font-semibold">Web Development</span>
                        </div>
                    </motion.div>

                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 1 }}
                        className="absolute bottom-20 left-0 z-20 bg-card p-4 rounded-xl shadow-lg border border-border/50 hidden md:block"
                    >
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-blue-500 rounded-full" />
                            <span className="text-sm font-semibold">UI/UX Design</span>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
