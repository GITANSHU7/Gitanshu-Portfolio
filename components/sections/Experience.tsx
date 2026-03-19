"use client";

import { useState, useEffect } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { motion } from "framer-motion";
import { Briefcase, Calendar, MapPin, ChevronRight, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { supabase } from "@/lib/supabase";

export function Experience() {
    const [experiences, setExperiences] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchExperience = async () => {
            const { data, error } = await supabase
                .from("experience")
                .select("*")
                .order("created_at", { ascending: false });

            if (!error) {
                setExperiences(data || []);
            }
            setLoading(false);
        };
        fetchExperience();
    }, []);

    return (
        <section id="experience" className="py-20 md:py-32 bg-secondary/10">
            <div className="container mx-auto px-4 md:px-6">
                <SectionHeading title="Work Experience" subtitle="My Professional Journey" />

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    </div>
                ) : (
                    <div className="max-w-4xl mx-auto">
                        <div className="space-y-12">
                            {experiences.map((exp, index) => (
                                <motion.div
                                    key={exp.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="relative pl-8 md:pl-0"
                                >
                                    {/* Timeline Line */}
                                    <div className="absolute left-0 top-0 bottom-0 w-px bg-border md:left-1/2 md:-ml-px hidden md:block" />

                                    <div className={`flex flex-col md:flex-row items-center gap-8 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                                        {/* Content Card */}
                                        <div className="w-full md:w-1/2">
                                            <Card className="p-6 hover:shadow-xl transition-all border-border/50 bg-background/50 backdrop-blur-sm relative group">
                                                {/* Dot on line (mobile) */}
                                                <div className="absolute left-[-33px] top-6 w-4 h-4 rounded-full bg-primary border-4 border-background md:hidden" />

                                                <div className="flex items-center gap-2 mb-2 text-primary">
                                                    <Briefcase size={18} />
                                                    <span className="font-bold uppercase tracking-wider text-xs">{exp.company}</span>
                                                </div>

                                                <h3 className="text-xl font-bold mb-4">{exp.title}</h3>

                                                <div className="flex flex-wrap gap-4 mb-6 text-sm text-muted-foreground">
                                                    <div className="flex items-center gap-1">
                                                        <Calendar size={14} />
                                                        <span>{exp.period}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <MapPin size={14} />
                                                        <span>{exp.location}</span>
                                                    </div>
                                                </div>

                                                {exp.description && Array.isArray(exp.description) && (
                                                    <ul className="space-y-3">
                                                        {exp.description.map((item: string, i: number) => (
                                                            <li key={i} className="flex gap-2 text-sm text-muted-foreground leading-relaxed">
                                                                <ChevronRight size={16} className="text-primary shrink-0 mt-0.5" />
                                                                <span>{item}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </Card>
                                        </div>

                                        {/* Large screen center dot */}
                                        <div className="absolute left-1/2 -ml-2 w-4 h-4 rounded-full bg-primary border-4 border-background z-10 hidden md:block" />

                                        {/* Empty space for layout balance */}
                                        <div className="hidden md:block md:w-1/2" />
                                    </div>
                                </motion.div>
                            ))}

                            {experiences.length === 0 && (
                                <div className="text-center py-20 text-muted-foreground">
                                    No work experience found.
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
