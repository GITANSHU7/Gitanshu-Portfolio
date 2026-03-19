"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { X, Upload, Loader2, Plus, Tag as TagIcon } from "lucide-react";
import { motion } from "framer-motion";

interface ProjectFormProps {
    project?: any;
    onClose: () => void;
    onSave: () => void;
}

export function ProjectForm({ project, onClose, onSave }: ProjectFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        title: "",
        category: "",
        description: "",
        full_description: "",
        role: "",
        challenge: "",
        solution: "",
        demo_url: "",
        repo_url: "",
        image_url: "",
        technologies: [] as string[],
    });
    const [techInput, setTechInput] = useState("");

    useEffect(() => {
        const fetchCategories = async () => {
            const { data, error } = await supabase
                .from("categories")
                .select("*")
                .order("name", { ascending: true });

            if (!error && data) {
                setCategories(data);
                if (!project && data.length > 0) {
                    setFormData(prev => ({ ...prev, category: data[0].name }));
                }
            }
        };

        fetchCategories();

        if (project) {
            setFormData({
                title: project.title || "",
                category: project.category || "",
                description: project.description || "",
                full_description: project.full_description || "",
                role: project.role || "",
                challenge: project.challenge || "",
                solution: project.solution || "",
                demo_url: project.demo_url || "",
                repo_url: project.repo_url || "",
                image_url: project.image_url || "",
                technologies: project.technologies || [],
            });
        }
    }, [project]);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);
            const file = e.target.files?.[0];
            if (!file) return;

            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('project-images')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('project-images')
                .getPublicUrl(filePath);

            setFormData({ ...formData, image_url: publicUrl });
        } catch (error: any) {
            alert(error.message);
        } finally {
            setUploading(false);
        }
    };

    const addTech = () => {
        if (techInput.trim() && !formData.technologies.includes(techInput.trim())) {
            setFormData({
                ...formData,
                technologies: [...formData.technologies, techInput.trim()]
            });
            setTechInput("");
        }
    };

    const removeTech = (tech: string) => {
        setFormData({
            ...formData,
            technologies: formData.technologies.filter(t => t !== tech)
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const projectData = {
            ...formData,
            updated_at: new Date(),
        };

        let error;
        if (project?.id) {
            const { error: updateError } = await supabase
                .from("projects")
                .update(projectData)
                .eq("id", project.id);
            error = updateError;
        } else {
            const { error: insertError } = await supabase
                .from("projects")
                .insert([projectData]);
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
                className="w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
            >
                <Card className="flex flex-col h-full border-primary/20 shadow-2xl overflow-hidden bg-card">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-border">
                        <h2 className="text-2xl font-bold">
                            {project ? "Edit Project" : "Add New Project"}
                        </h2>
                        <Button variant="ghost" size="icon" onClick={onClose}>
                            <X size={24} />
                        </Button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-8 space-y-8">
                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Left Column */}
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold">Project Title</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full h-12 bg-secondary/30 border border-border rounded-xl px-4 outline-none focus:ring-2 focus:ring-primary/20"
                                        placeholder="e.g. Modern E-commerce Site"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold">Category</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full h-12 bg-secondary/30 border border-border rounded-xl px-4 outline-none focus:ring-2 focus:ring-primary/20"
                                        required
                                    >
                                        <option value="" disabled>Select a category</option>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.name}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold">Short Description</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full min-h-[100px] bg-secondary/30 border border-border rounded-xl p-4 outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                                        placeholder="Briefly describe the project..."
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold">Role</label>
                                    <input
                                        type="text"
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                        className="w-full h-12 bg-secondary/30 border border-border rounded-xl px-4 outline-none focus:ring-2 focus:ring-primary/20"
                                        placeholder="e.g. Lead Designer"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold">Project Image</label>
                                    <div className="relative aspect-video rounded-2xl overflow-hidden bg-secondary/50 border border-dashed border-border flex items-center justify-center group">
                                        {formData.image_url ? (
                                            <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="text-center">
                                                <Upload className="mx-auto mb-2 text-muted-foreground" />
                                                <p className="text-xs text-muted-foreground">Upload preview image</p>
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleUpload}
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                            disabled={uploading}
                                        />
                                        {uploading && (
                                            <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                                                <Loader2 className="animate-spin" />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold">Technology Stack</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={techInput}
                                            onChange={(e) => setTechInput(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTech())}
                                            className="flex-grow h-11 bg-secondary/30 border border-border rounded-xl px-4 outline-none focus:ring-2 focus:ring-primary/20"
                                            placeholder="Add tech (e.g. Next.js)"
                                        />
                                        <Button type="button" variant="secondary" onClick={addTech} className="rounded-xl h-11">
                                            <Plus size={20} />
                                        </Button>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {formData.technologies.map(tech => (
                                            <span key={tech} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 border border-primary/10">
                                                {tech}
                                                <X size={12} className="cursor-pointer hover:text-red-500" onClick={() => removeTech(tech)} />
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-border">
                            <h3 className="font-bold text-lg">Detailed Case Study</h3>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-blue-500" /> The Challenge
                                    </label>
                                    <textarea
                                        value={formData.challenge}
                                        onChange={(e) => setFormData({ ...formData, challenge: e.target.value })}
                                        className="w-full min-h-[100px] bg-secondary/30 border border-border rounded-xl p-4 outline-none focus:ring-2 focus:ring-primary/20"
                                        placeholder="What was the main problem?"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-green-500" /> The Solution
                                    </label>
                                    <textarea
                                        value={formData.solution}
                                        onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                                        className="w-full min-h-[100px] bg-secondary/30 border border-border rounded-xl p-4 outline-none focus:ring-2 focus:ring-primary/20"
                                        placeholder="How did you solve it?"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-sm font-bold">Demo URL</label>
                                <input
                                    type="url"
                                    value={formData.demo_url}
                                    onChange={(e) => setFormData({ ...formData, demo_url: e.target.value })}
                                    className="w-full h-12 bg-secondary/30 border border-border rounded-xl px-4 outline-none focus:ring-2 focus:ring-primary/20"
                                    placeholder="https://example.com"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold">Repo URL</label>
                                <input
                                    type="url"
                                    value={formData.repo_url}
                                    onChange={(e) => setFormData({ ...formData, repo_url: e.target.value })}
                                    className="w-full h-12 bg-secondary/30 border border-border rounded-xl px-4 outline-none focus:ring-2 focus:ring-primary/20"
                                    placeholder="https://github.com/your-repo"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold">Full Description (Markdown supported)</label>
                            <textarea
                                value={formData.full_description}
                                onChange={(e) => setFormData({ ...formData, full_description: e.target.value })}
                                className="w-full min-h-[200px] bg-secondary/30 border border-border rounded-xl p-4 outline-none focus:ring-2 focus:ring-primary/20"
                                placeholder="Describe the project in detail..."
                            />
                        </div>
                    </form>

                    {/* Footer Actions */}
                    <div className="p-6 border-t border-border flex justify-end gap-4 bg-secondary/5">
                        <Button variant="outline" onClick={onClose} className="rounded-full h-12 px-8">
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} disabled={isLoading} className="rounded-full h-12 px-8 font-bold min-w-[140px]">
                            {isLoading ? (
                                <div className="flex items-center gap-2">
                                    <Loader2 className="animate-spin h-4 w-4" />
                                    Saving...
                                </div>
                            ) : (
                                project ? "Update Project" : "Create Project"
                            )}
                        </Button>
                    </div>
                </Card>
            </motion.div>
        </motion.div>
    );
}
