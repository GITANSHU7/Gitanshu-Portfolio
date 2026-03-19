"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import {
    Briefcase,
    Plus,
    Edit,
    Trash2,
    ArrowLeft,
    Calendar,
    MapPin
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ExperienceForm } from "@/components/admin/ExperienceForm";

export default function ManageExperience() {
    const [experience, setExperience] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedExperience, setSelectedExperience] = useState<any>(null);
    const router = useRouter();

    const fetchExperience = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("experience")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) console.error("Error fetching experience:", error);
        else setExperience(data || []);
        setLoading(false);
    };

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) router.push("/login");
            else fetchExperience();
        };

        checkUser();
    }, [router]);

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure?")) {
            const { error } = await supabase.from("experience").delete().eq("id", id);
            if (!error) setExperience(experience.filter(e => e.id !== id));
        }
    };

    const handleEdit = (exp: any) => {
        setSelectedExperience(exp);
        setIsFormOpen(true);
    };

    const handleAdd = () => {
        setSelectedExperience(null);
        setIsFormOpen(true);
    };

    if (loading && experience.length === 0) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary" />
        </div>
    );

    return (
        <div className="min-h-screen bg-secondary/5 p-6 md:p-10">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div className="space-y-1">
                        <Link href="/admin" className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1 mb-2 transition-colors">
                            <ArrowLeft size={14} /> Back to Dashboard
                        </Link>
                        <h1 className="text-3xl font-bold flex items-center gap-3">
                            <Briefcase className="text-primary" /> Manage Experience
                        </h1>
                    </div>
                    <Button
                        onClick={handleAdd}
                        className="rounded-full shadow-lg shadow-primary/20 h-11 px-6 font-bold"
                    >
                        <Plus size={20} className="mr-2" />
                        Add Experience
                    </Button>
                </div>

                {/* List */}
                <div className="space-y-6">
                    {experience.map((exp, i) => (
                        <motion.div
                            key={exp.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                        >
                            <Card className="p-6 md:p-8 hover:shadow-md transition-all border-border/50 bg-card relative overflow-hidden group">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-primary">{exp.title}</h3>
                                        <p className="text-lg font-semibold">{exp.company}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            size="icon"
                                            variant="secondary"
                                            className="h-9 w-9 rounded-xl"
                                            onClick={() => handleEdit(exp)}
                                        >
                                            <Edit size={16} />
                                        </Button>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-9 w-9 rounded-xl text-destructive hover:bg-destructive/10"
                                            onClick={() => handleDelete(exp.id)}
                                        >
                                            <Trash2 size={16} />
                                        </Button>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="h-4 w-4" />
                                        <span>{exp.period}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <MapPin className="h-4 w-4" />
                                        <span>{exp.location}</span>
                                    </div>
                                </div>

                                <ul className="space-y-2">
                                    {exp.description?.map((item: string, idx: number) => (
                                        <li key={idx} className="text-sm text-muted-foreground flex gap-2">
                                            <span className="text-primary">•</span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </Card>
                        </motion.div>
                    ))}

                    {experience.length === 0 && !loading && (
                        <div className="text-center py-20 bg-secondary/10 border-2 border-dashed border-border/50 rounded-3xl">
                            <Briefcase size={48} className="mx-auto text-muted-foreground/30 mb-4" />
                            <h3 className="text-xl font-bold mb-1">No experience records</h3>
                            <p className="text-muted-foreground mb-6">Add your work history to showcase your journey.</p>
                            <Button onClick={handleAdd} className="rounded-full px-6">Add Experience</Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Form Modal */}
            <AnimatePresence>
                {isFormOpen && (
                    <ExperienceForm
                        experience={selectedExperience}
                        onClose={() => setIsFormOpen(false)}
                        onSave={fetchExperience}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
