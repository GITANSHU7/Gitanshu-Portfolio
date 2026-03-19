"use client";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import { getYearsOfExperience } from "@/lib/utils";

import Image from "next/image";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Download } from "lucide-react";

const skills = [
    { name: "Web Development", level: 90 },
    { name: "UI/UX Design", level: 85 },
    { name: "Automation & Optimization", level: 87 },
    { name: "SEO & Performance Engineering", level: 82 },
];

export function About() {
    const [resumeUrl, setResumeUrl] = useState<string | null>(null);

    useEffect(() => {
        const fetchResume = async () => {
            const { data: { publicUrl } } = supabase.storage
                .from('resumes')
                .getPublicUrl('resume.pdf');
            
            const res = await fetch(publicUrl, { method: 'HEAD' });
            if (res.ok) setResumeUrl(publicUrl);
        };
        fetchResume();
    }, []);

    return (
        <section id="about" className="py-20 md:py-32 bg-secondary/30">
            <div className="container mx-auto px-4 md:px-6">
                <SectionHeading title="About Me" subtitle="My Biography" />

                <div className="grid md:grid-cols-2 gap-12 items-center">
                    {/* Image Side */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="relative"
                    >
                        <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-muted relative max-w-[400px] mx-auto md:ml-0 border border-border/50 shadow-2xl">
                            <Image
                                src="/IMG20240404183121 copy.jpg"
                                alt="About"
                                fill
                                className="object-cover"
                                priority
                            />

                            <div className="absolute bottom-6 left-6 right-6 bg-background/80 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/20 dark:border-black/20 text-center transform hover:scale-105 transition-transform duration-300">
                                <p className="font-bold text-3xl text-primary leading-none mb-1">{getYearsOfExperience()}+</p>
                                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Years of Experience</p>
                            </div>
                        </div>

                        {/* Decor */}
                        <div className="absolute -top-10 -left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl -z-10 animate-pulse" />
                        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -z-10" />
                    </motion.div>

                    {/* Content Side */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <h3 className="text-2xl font-semibold mb-4">I am a creative Full Stack Developer based in Bhopal.</h3>
                        <p className="text-muted-foreground mb-6 leading-relaxed">
                            I design and develop services for customers of all sizes, specializing in creating stylish, modern websites, web services and online stores. My passion is to turn your ideas into a reality.
                        </p>

                        <div className="space-y-6 mb-8">
                            {skills.map((skill, index) => (
                                <div key={index}>
                                    <div className="flex justify-between mb-2">
                                        <span className="font-medium">{skill.name}</span>
                                        <span className="text-muted-foreground">{skill.level}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-border rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            whileInView={{ width: `${skill.level}%` }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 1, delay: 0.5 }}
                                            className="h-full bg-primary rounded-full"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <Button 
                            className="rounded-full"
                            onClick={() => resumeUrl && window.open(resumeUrl, '_blank')}
                            disabled={!resumeUrl}
                        >
                            Download CV
                            <Download className="ml-2 h-4 w-4" />
                        </Button>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
