"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { X, Loader2, Plus } from "lucide-react";
import { motion } from "framer-motion";

interface ExperienceFormProps {
    experience?: any;
    onClose: () => void;
    onSave: () => void;
}

export function ExperienceForm({ experience, onClose, onSave }: ExperienceFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        company: "",
        location: "",
        period: "",
        description: [] as string[],
    });
    const [descInput, setDescInput] = useState("");

    useEffect(() => {
        if (experience) {
            setFormData({
                title: experience.title || "",
                company: experience.company || "",
                location: experience.location || "",
                period: experience.period || "",
                description: experience.description || [],
            });
        }
    }, [experience]);

    const addDescription = () => {
        if (descInput.trim()) {
            setFormData({
                ...formData,
                description: [...formData.description, descInput.trim()]
            });
            setDescInput("");
        }
    };

    const removeDescription = (index: number) => {
        setFormData({
            ...formData,
            description: formData.description.filter((_, i) => i !== index)
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const experienceData = {
            ...formData,
            updated_at: new Date(),
        };

        let error;
        if (experience?.id) {
            const { error: updateError } = await supabase
                .from("experience")
                .update(experienceData)
                .eq("id", experience.id);
            error = updateError;
        } else {
            const { error: insertError } = await supabase
                .from("experience")
                .insert([experienceData]);
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
                            {experience ? "Edit Experience" : "Add Experience"}
                        </h2>
                        <Button variant="ghost" size="icon" onClick={onClose}>
                            <X size={24} />
                        </Button>
                    </div>

                    <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-8 space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold">Job Title</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full h-12 bg-secondary/30 border border-border rounded-xl px-4 outline-none focus:ring-2 focus:ring-primary/20"
                                placeholder="e.g. Senior Frontend Developer"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold">Company</label>
                            <input
                                type="text"
                                value={formData.company}
                                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                className="w-full h-12 bg-secondary/30 border border-border rounded-xl px-4 outline-none focus:ring-2 focus:ring-primary/20"
                                placeholder="e.g. Tech Corp"
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
                                    placeholder="e.g. San Francisco, CA"
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
                                    placeholder="e.g. 2022 - Present"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-sm font-bold">Key Responsibilities</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={descInput}
                                    onChange={(e) => setDescInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addDescription())}
                                    className="flex-grow h-11 bg-secondary/30 border border-border rounded-xl px-4 outline-none focus:ring-2 focus:ring-primary/20"
                                    placeholder="Add a bullet point..."
                                />
                                <Button type="button" variant="secondary" onClick={addDescription} className="rounded-xl h-11">
                                    <Plus size={20} />
                                </Button>
                            </div>
                            <div className="space-y-2">
                                {formData.description.map((item, index) => (
                                    <div key={index} className="flex gap-2 items-start bg-secondary/20 p-3 rounded-xl border border-border/50 group">
                                        <p className="flex-grow text-sm leading-relaxed">{item}</p>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={() => removeDescription(index)}
                                        >
                                            <X size={14} />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </form>

                    <div className="p-6 border-t border-border flex justify-end gap-4 bg-secondary/5">
                        <Button variant="outline" onClick={onClose} className="rounded-full h-12 px-8">
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} disabled={isLoading} className="rounded-full h-12 px-8 font-bold min-w-[140px]">
                            {isLoading ? <Loader2 className="animate-spin h-4 w-4" /> : (experience ? "Update" : "Create")}
                        </Button>
                    </div>
                </Card>
            </motion.div>
        </motion.div>
    );
}
