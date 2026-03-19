"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import {
    Layers,
    Plus,
    Search,
    Edit,
    Trash2,
    ExternalLink,
    ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ProjectForm } from "@/components/admin/ProjectForm";

export default function ManageProjects() {
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState<any>(null);
    const router = useRouter();

    const fetchProjects = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("projects")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching projects:", error);
        } else {
            setProjects(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) router.push("/login");
            else fetchProjects();
        };

        checkUser();
    }, [router]);

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this project?")) {
            const { error } = await supabase.from("projects").delete().eq("id", id);
            if (!error) {
                setProjects(projects.filter(p => p.id !== id));
            }
        }
    };

    const handleEdit = (project: any) => {
        setSelectedProject(project);
        setIsFormOpen(true);
    };

    const handleAdd = () => {
        setSelectedProject(null);
        setIsFormOpen(true);
    };

    const filteredProjects = projects.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading && projects.length === 0) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary" />
        </div>
    );

    return (
        <div className="min-h-screen bg-secondary/5 p-6 md:p-10">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div className="space-y-1">
                        <Link href="/admin" className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1 mb-2 transition-colors">
                            <ArrowLeft size={14} /> Back to Dashboard
                        </Link>
                        <h1 className="text-3xl font-bold flex items-center gap-3">
                            <Layers className="text-primary" /> Manage Projects
                        </h1>
                    </div>
                    <Button
                        onClick={handleAdd}
                        className="rounded-full shadow-lg shadow-primary/20 h-11 px-6 font-bold"
                    >
                        <Plus size={20} className="mr-2" />
                        Add New Project
                    </Button>
                </div>

                {/* Toolbar */}
                <div className="bg-card border border-border rounded-2xl p-4 mb-8 flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-grow w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <input
                            type="text"
                            placeholder="Search projects by title or category..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-secondary/50 border-none rounded-xl pl-12 pr-4 h-11 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        />
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                        <Button variant="outline" className="rounded-xl flex-grow md:flex-grow-0">All Categories</Button>
                        <Button variant="outline" className="rounded-xl flex-grow md:flex-grow-0">Latest First</Button>
                    </div>
                </div>

                {/* Projects Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProjects.map((project, i) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                        >
                            <Card className="overflow-hidden border-border/50 group h-full flex flex-col">
                                <div className="aspect-video w-full bg-muted relative flex items-center justify-center overflow-hidden">
                                    {project.image_url ? (
                                        <img src={project.image_url} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    ) : (
                                        <Layers className="text-muted-foreground/20" size={48} />
                                    )}
                                    <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full bg-background/80 backdrop-blur" onClick={() => router.push(`/projects/${project.id}`)}>
                                            <ExternalLink size={14} />
                                        </Button>
                                    </div>
                                </div>
                                <div className="p-5 flex-grow flex flex-col">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">{project.category}</p>
                                            <h3 className="font-bold text-lg leading-tight line-clamp-1">{project.title}</h3>
                                        </div>
                                    </div>
                                    <p className="text-sm text-muted-foreground line-clamp-2 mb-6 flex-grow">
                                        {project.description || "No description provided."}
                                    </p>
                                    <div className="flex items-center gap-2 pt-4 border-t border-border/50">
                                        <Button
                                            variant="secondary"
                                            className="flex-grow rounded-xl h-10 font-semibold text-sm"
                                            onClick={() => handleEdit(project)}
                                        >
                                            <Edit size={16} className="mr-2" /> Edit
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-10 w-10 rounded-xl text-destructive hover:bg-destructive/10"
                                            onClick={() => handleDelete(project.id)}
                                        >
                                            <Trash2 size={18} />
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {filteredProjects.length === 0 && !loading && (
                    <div className="text-center py-20 bg-secondary/10 border-2 border-dashed border-border/50 rounded-3xl">
                        <Layers size={48} className="mx-auto text-muted-foreground/30 mb-4" />
                        <h3 className="text-xl font-bold mb-1">No projects found</h3>
                        <p className="text-muted-foreground mb-6">Start by adding your first portfolio piece.</p>
                        <Button onClick={handleAdd} className="rounded-full px-6">Add Project</Button>
                    </div>
                )}
            </div>

            {/* Form Modal */}
            <AnimatePresence>
                {isFormOpen && (
                    <ProjectForm
                        project={selectedProject}
                        onClose={() => setIsFormOpen(false)}
                        onSave={fetchProjects}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
