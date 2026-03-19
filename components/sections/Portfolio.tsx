"use client";

import { useState, useEffect } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Layers } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export function Portfolio() {
    const [activeCategory, setActiveCategory] = useState("All");
    const [projects, setProjects] = useState<any[]>([]);
    const [categories, setCategories] = useState<string[]>(["All"]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            const { data, error } = await supabase
                .from("projects")
                .select("*")
                .order("created_at", { ascending: false });

            if (!error && data) {
                setProjects(data);

                // Extract unique categories and add "All"
                const uniqueCategories = ["All", ...Array.from(new Set(data.map((p: any) => p.category))).filter(Boolean) as string[]];
                setCategories(uniqueCategories);
            }
            setLoading(false);
        };
        fetchProjects();
    }, []);

    const filteredProjects = activeCategory === "All"
        ? projects
        : projects.filter(p => p.category === activeCategory);

    return (
        <section id="portfolio" className="py-20 md:py-32 bg-secondary/30">
            <div className="container mx-auto px-4 md:px-6">
                <SectionHeading title="My Portfolio" subtitle="Recent Works" />

                {/* Filters */}
                <div className="flex flex-wrap justify-center gap-2 mb-12">
                    {categories.map((cat) => (
                        <Button
                            key={cat}
                            variant={activeCategory === cat ? "default" : "outline"}
                            onClick={() => setActiveCategory(cat)}
                            className="rounded-full min-w-[100px]"
                        >
                            {cat}
                        </Button>
                    ))}
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary" />
                    </div>
                ) : (
                    <>
                        {/* Grid */}
                        <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <AnimatePresence>
                                {filteredProjects.map((project) => (
                                    <motion.div
                                        key={project.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <Card className="overflow-hidden group relative aspect-[4/3] border-primary/10">
                                            <div className="w-full h-full bg-muted relative flex items-center justify-center overflow-hidden">
                                                {project.image_url ? (
                                                    <img
                                                        src={project.image_url}
                                                        alt={project.title}
                                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                    />
                                                ) : (
                                                    <Layers className="text-muted-foreground/20" size={64} />
                                                )}

                                                {/* Overlay */}
                                                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white p-6 text-center backdrop-blur-[2px]">
                                                    <h4 className="text-xl font-bold mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{project.title}</h4>
                                                    <p className="text-sm text-gray-300 mb-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75 line-clamp-2">{project.category}</p>
                                                    <Link href={`/projects/${project.id}`}>
                                                        <Button size="sm" variant="secondary" className="rounded-full px-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-100">
                                                            View Details <ExternalLink className="ml-2 h-3 w-3" />
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </div>
                                        </Card>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>

                        {filteredProjects.length === 0 && (
                            <div className="text-center py-20 text-muted-foreground">
                                No projects found in this category.
                            </div>
                        )}
                    </>
                )}
            </div>
        </section>
    );
}
