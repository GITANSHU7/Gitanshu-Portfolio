"use client";

import { useEffect, useState } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { motion } from "framer-motion";
import { GraduationCap, Calendar, MapPin } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { supabase } from "@/lib/supabase";

export function Education() {
    const [education, setEducation] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEducation = async () => {
            const { data, error } = await supabase
                .from("education")
                .select("*")
                .order("created_at", { ascending: false });

            if (!error) {
                setEducation(data || []);
            }
            setLoading(false);
        };
        fetchEducation();
    }, []);

    return (
        <section id="education" className="py-20 md:py-32">
            <div className="container mx-auto px-4 md:px-6">
                <SectionHeading title="Education" subtitle="My Academic Background" />

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary" />
                    </div>
                ) : (
                    <div className="max-w-4xl mx-auto space-y-8">
                        {education.map((edu, index) => (
                            <motion.div
                                key={edu.id}
                                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <Card className="p-6 md:p-8 hover:shadow-md transition-shadow border-border/50 bg-secondary/10 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity" >
                                        <GraduationCap size={80} />
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4" >
                                        <div>
                                            <h3 className="text-xl md:text-2xl font-bold text-primary" >{edu.degree}</h3>
                                            <p className="text-lg font-semibold text-foreground/80" >{edu.institution}</p>
                                        </div>
                                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm text-muted-foreground" >
                                            <div className="flex items-center gap-1" >
                                                <Calendar className="h-4 w-4" />
                                                <span>{edu.period}</span>
                                            </div>
                                            <div className="flex items-center gap-1" >
                                                <MapPin className="h-4 w-4" />
                                                <span>{edu.location}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-muted-foreground leading-relaxed max-w-3xl" >
                                        {edu.description}
                                    </p>
                                </Card>
                            </motion.div>
                        ))}

                        {education.length === 0 && (
                            <div className="text-center py-20 text-muted-foreground">
                                No education records found.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}
