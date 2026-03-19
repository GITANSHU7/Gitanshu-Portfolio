"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { X, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface CategoryFormProps {
    category?: any;
    onClose: () => void;
    onSave: () => void;
}

export function CategoryForm({ category, onClose, onSave }: CategoryFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState("");

    useEffect(() => {
        if (category) {
            setName(category.name || "");
        }
    }, [category]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const categoryData = {
            name: name.trim(),
        };

        let error;
        if (category?.id) {
            const { error: updateError } = await supabase
                .from("categories")
                .update(categoryData)
                .eq("id", category.id);
            error = updateError;
        } else {
            const { error: insertError } = await supabase
                .from("categories")
                .insert([categoryData]);
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
                className="w-full max-w-md"
            >
                <Card className="border-primary/20 shadow-2xl bg-card">
                    <div className="flex items-center justify-between p-6 border-b border-border">
                        <h2 className="text-xl font-bold">
                            {category ? "Edit Category" : "Add Category"}
                        </h2>
                        <Button variant="ghost" size="icon" onClick={onClose}>
                            <X size={20} />
                        </Button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold ml-1">Category Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full h-12 bg-secondary/30 border border-border rounded-xl px-4 outline-none focus:ring-2 focus:ring-primary/20"
                                placeholder="e.g. Web Development"
                                required
                            />
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                            <Button type="button" variant="outline" onClick={onClose} className="rounded-full">
                                Cancel
                            </Button>
                            <Button disabled={isLoading} className="rounded-full font-bold min-w-[100px]">
                                {isLoading ? <Loader2 className="animate-spin h-4 w-4" /> : (category ? "Update" : "Create")}
                            </Button>
                        </div>
                    </form>
                </Card>
            </motion.div>
        </motion.div>
    );
}
