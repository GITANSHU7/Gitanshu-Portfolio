"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { X, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface EducationFormProps {
    education?: any;
    onClose: () => void;
    onSave: () => void;
}

export function EducationForm({ education, onClose, onSave }: EducationFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        degree: "",
        institution: "",
        location: "",
        period: "",
        description: "",
    });

    useEffect(() => {
        if (education) {
            setFormData({
                degree: education.degree || "",
                institution: education.institution || "",
                location: education.location || "",
                period: education.period || "",
                description: education.description || "",
            });
        }
    }, [education]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const educationData = {
            ...formData,
            updated_at: new Date(),
        };

        let error;
        if (education?.id) {
            const { error: updateError } = await supabase
                .from("education")
                .update(educationData)
                .eq("id", education.id);
            error = updateError;
        } else {
            const { error: insertError } = await supabase
                .from("education")
                .insert([educationData]);
            error = insertError;
        }

        if (error) {
            alert(error.message);
        } else {
            onSave();
            onClose();
        }
        setIsLoading(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
            >
                <Card className="flex flex-col h-full border-primary/20 shadow-2xl overflow-hidden bg-card">
                    <div className="flex items-center justify-between p-6 border-b border-border">
                        <h2 className="text-2xl font-bold">
                            {education ? "Edit Education" : "Add Education"}
                        </h2>
                        <Button variant="ghost" size="icon" onClick={onClose}>
                            <X size={24} />
                        </Button>
                    </div>

                    <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-8 space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold">Degree / Major</label>
                            <input
                                type="text"
                                value={formData.degree}
                                onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                                className="w-full h-12 bg-secondary/30 border border-border rounded-xl px-4 outline-none focus:ring-2 focus:ring-primary/20"
                                placeholder="e.g. Master of Science in CS"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold">Institution</label>
                            <input
                                type="text"
                                value={formData.institution}
                                onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                                className="w-full h-12 bg-secondary/30 border border-border rounded-xl px-4 outline-none focus:ring-2 focus:ring-primary/20"
                                placeholder="e.g. Stanford University"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold">Location</label>
                                <input
                                    type="text"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    className="w-full h-12 bg-secondary/30 border border-border rounded-xl px-4 outline-none focus:ring-2 focus:ring-primary/20"
                                    placeholder="e.g. Stanford, CA"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold">Period</label>
                                <input
                                    type="text"
                                    value={formData.period}
                                    onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                                    className="w-full h-12 bg-secondary/30 border border-border rounded-xl px-4 outline-none focus:ring-2 focus:ring-primary/20"
                                    placeholder="e.g. 2018 - 2020"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold">Description</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full min-h-[120px] bg-secondary/30 border border-border rounded-xl p-4 outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                                placeholder="Describe your studies, achievements, etc..."
                                required
                            />
                        </div>
                    </form>

                    <div className="p-6 border-t border-border flex justify-end gap-4 bg-secondary/5">
                        <Button variant="outline" onClick={onClose} className="rounded-full h-12 px-8">
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} disabled={isLoading} className="rounded-full h-12 px-8 font-bold min-w-[140px]">
                            {isLoading ? <Loader2 className="animate-spin h-4 w-4" /> : (education ? "Update" : "Create")}
                        </Button>
                    </div>
                </Card>
            </motion.div>
        </motion.div>
    );
}
