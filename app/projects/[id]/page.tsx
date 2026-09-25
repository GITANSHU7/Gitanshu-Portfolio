"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, Github, Layers } from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/sections/Header";
import { Footer } from "@/components/sections/Footer";

export default function ProjectDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [project, setProject] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProject = async () => {
            const { data, error } = await supabase
                .from("projects")
                .select("*")
                .eq("id", params.id)
                .single();

            if (!error && data) {
                setProject(data);
            }
            setLoading(false);
        };

        if (params.id) {
            fetchProject();
        }
    }, [params.id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary" />
            </div>
        );
    }

    if (!project) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center space-y-4 p-4 text-center">
                <h1 className="text-4xl font-bold">Project Not Found</h1>
                <p className="text-muted-foreground">The project you are looking for does not exist or has been removed.</p>
                <Link href="/#portfolio">
                    <Button className="rounded-full px-8">Back to Portfolio</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-grow pt-24 pb-20">
                <div className="container mx-auto px-4 md:px-6">
                    {/* Back Link */}
                    <div className="mb-8">
                        <Link href="/#portfolio" className="inline-flex items-center text-sm font-medium hover:text-primary transition-colors cursor-pointer group">
                            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                            Back to Projects
                        </Link>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-12 items-start">
                        {/* Visual Section */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="w-full aspect-video rounded-3xl bg-muted flex items-center justify-center border border-border/50 shadow-2xl relative overflow-hidden group">
                                {project.image_url ? (
                                    <img
                                        src={project.image_url}
                                        alt={project.title}
                                        className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                                    />
                                ) : (
                                    <Layers className="text-muted-foreground/20" size={120} />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                            </div>

                            <div className="mt-8 grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-2xl bg-secondary/20 border border-border/50">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Role</p>
                                    <p className="font-bold">{project.role || "Developer"}</p>
                                </div>
                                <div className="p-4 rounded-2xl bg-secondary/20 border border-border/50">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Category</p>
                                    <p className="font-bold">{project.category}</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Content Section */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="space-y-8"
                        >
                            <div>
                                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">{project.title}</h1>
                                <p className="text-xl text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                    {project.full_description || project.description}
                                </p>
                            </div>

                            {/* Tech Stack */}
                            {project.technologies && project.technologies.length > 0 && (
                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold">Technologies Used</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {project.technologies.map((tech: string) => (
                                            <span key={tech} className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Project Details */}
                            <div className="grid sm:grid-cols-2 gap-8">
                                {project.challenge && (
                                    <div className="space-y-3">
                                        <h3 className="text-xl font-bold flex items-center gap-2">
                                            The Challenge
                                        </h3>
                                        <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap">
                                            {project.challenge}
                                        </p>
                                    </div>
                                )}
                                {project.solution && (
                                    <div className="space-y-3">
                                        <h3 className="text-xl font-bold flex items-center gap-2">
                                            The Solution
                                        </h3>
                                        <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap">
                                            {project.solution}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="pt-6 flex flex-wrap gap-4">
                                {project.demo_url && (
                                    <Link href={project.demo_url} target="_blank">
                                        <Button size="lg" className="rounded-full group px-8">
                                            Live Demo
                                            <ExternalLink className="ml-2 h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                        </Button>
                                    </Link>
                                )}
                                {project.repo_url && (
                                    <Link href={project.repo_url} target="_blank">
                                        <Button size="lg" variant="outline" className="rounded-full group px-8">
                                            View Code
                                            <Github className="ml-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
