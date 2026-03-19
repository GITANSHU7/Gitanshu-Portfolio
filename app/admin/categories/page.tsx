"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import {
    Tag,
    Plus,
    Edit,
    Trash2,
    ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { CategoryForm } from "@/components/admin/CategoryForm";

export default function ManageCategories() {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<any>(null);
    const router = useRouter();

    const fetchCategories = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("categories")
            .select("*")
            .order("name", { ascending: true });

        if (error) console.error("Error fetching categories:", error);
        else setCategories(data || []);
        setLoading(false);
    };

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) router.push("/login");
            else fetchCategories();
        };

        checkUser();
    }, [router]);

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure? This won't delete projects, but they will have an orphaned category string.")) {
            const { error } = await supabase.from("categories").delete().eq("id", id);
            if (!error) setCategories(categories.filter(c => c.id !== id));
        }
    };

    const handleEdit = (cat: any) => {
        setSelectedCategory(cat);
        setIsFormOpen(true);
    };

    const handleAdd = () => {
        setSelectedCategory(null);
        setIsFormOpen(true);
    };

    if (loading && categories.length === 0) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary" />
        </div>
    );

    return (
        <div className="min-h-screen bg-secondary/5 p-6 md:p-10">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div className="space-y-1">
                        <Link href="/admin" className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1 mb-2 transition-colors">
                            <ArrowLeft size={14} /> Back to Dashboard
                        </Link>
                        <h1 className="text-3xl font-bold flex items-center gap-3">
                            <Tag className="text-primary" /> Categories
                        </h1>
                    </div>
                    <Button
                        onClick={handleAdd}
                        className="rounded-full shadow-lg shadow-primary/20 h-11 px-6 font-bold"
                    >
                        <Plus size={20} className="mr-2" />
                        Add Category
                    </Button>
                </div>

                {/* List */}
                <div className="grid gap-4">
                    {categories.map((cat, i) => (
                        <motion.div
                            key={cat.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                        >
                            <Card className="p-4 flex items-center justify-between border-border/50 bg-card hover:border-primary/30 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                                        <Tag size={18} />
                                    </div>
                                    <span className="font-bold text-lg">{cat.name}</span>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-9 w-9 rounded-xl hover:bg-primary/10 hover:text-primary"
                                        onClick={() => handleEdit(cat)}
                                    >
                                        <Edit size={16} />
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-9 w-9 rounded-xl text-destructive hover:bg-destructive/10"
                                        onClick={() => handleDelete(cat.id)}
                                    >
                                        <Trash2 size={16} />
                                    </Button>
                                </div>
                            </Card>
                        </motion.div>
                    ))}

                    {categories.length === 0 && !loading && (
                        <div className="text-center py-20 bg-secondary/10 border-2 border-dashed border-border/50 rounded-3xl">
                            <Tag size={48} className="mx-auto text-muted-foreground/30 mb-4" />
                            <h3 className="text-xl font-bold mb-1">No categories found</h3>
                            <p className="text-muted-foreground mb-6">Create categories to organize your projects.</p>
                            <Button onClick={handleAdd} className="rounded-full px-6">Add Category</Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Form Modal */}
            <AnimatePresence>
                {isFormOpen && (
                    <CategoryForm
                        category={selectedCategory}
                        onClose={() => setIsFormOpen(false)}
                        onSave={fetchCategories}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
