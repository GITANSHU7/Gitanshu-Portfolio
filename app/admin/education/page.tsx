"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import {
    GraduationCap,
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
import { EducationForm } from "@/components/admin/EducationForm";

export default function ManageEducation() {
    const [education, setEducation] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedEducation, setSelectedEducation] = useState<any>(null);
    const router = useRouter();

    const fetchEducation = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("education")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) console.error("Error fetching education:", error);
        else setEducation(data || []);
        setLoading(false);
    };

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) router.push("/login");
            else fetchEducation();
        };

        checkUser();
    }, [router]);

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure?")) {
            const { error } = await supabase.from("education").delete().eq("id", id);
            if (!error) setEducation(education.filter(e => e.id !== id));
        }
    };

    const handleEdit = (edu: any) => {
        setSelectedEducation(edu);
        setIsFormOpen(true);
    };

    const handleAdd = () => {
        setSelectedEducation(null);
        setIsFormOpen(true);
    };

    if (loading && education.length === 0) return (
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
                            <GraduationCap className="text-primary" /> Manage Education
                        </h1>
                    </div>
                    <Button
                        onClick={handleAdd}
                        className="rounded-full shadow-lg shadow-primary/20 h-11 px-6 font-bold"
                    >
                        <Plus size={20} className="mr-2" />
                        Add Education
                    </Button>
                </div>

                {/* List */}
                <div className="space-y-6">
                    {education.map((edu, i) => (
                        <motion.div
                            key={edu.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                        >
                            <Card className="p-6 md:p-8 hover:shadow-md transition-all border-border/50 bg-card relative overflow-hidden group">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-primary">{edu.degree}</h3>
                                        <p className="text-lg font-semibold">{edu.institution}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            size="icon"
                                            variant="secondary"
                                            className="h-9 w-9 rounded-xl"
                                            onClick={() => handleEdit(edu)}
                                        >
                                            <Edit size={16} />
                                        </Button>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-9 w-9 rounded-xl text-destructive hover:bg-destructive/10"
                                            onClick={() => handleDelete(edu.id)}
                                        >
                                            <Trash2 size={16} />
                                        </Button>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="h-4 w-4" />
                                        <span>{edu.period}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <MapPin className="h-4 w-4" />
                                        <span>{edu.location}</span>
                                    </div>
                                </div>

                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {edu.description}
                                </p>
                            </Card>
                        </motion.div>
                    ))}

                    {education.length === 0 && !loading && (
                        <div className="text-center py-20 bg-secondary/10 border-2 border-dashed border-border/50 rounded-3xl">
                            <GraduationCap size={48} className="mx-auto text-muted-foreground/30 mb-4" />
                            <h3 className="text-xl font-bold mb-1">No education records</h3>
                            <p className="text-muted-foreground mb-6">Add your academic background to complete your profile.</p>
                            <Button onClick={handleAdd} className="rounded-full px-6">Add Education</Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Form Modal */}
            <AnimatePresence>
                {isFormOpen && (
                    <EducationForm
                        education={selectedEducation}
                        onClose={() => setIsFormOpen(false)}
                        onSave={fetchEducation}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
