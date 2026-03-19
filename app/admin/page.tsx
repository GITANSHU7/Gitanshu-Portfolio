"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    LayoutDashboard,
    Briefcase,
    GraduationCap,
    Layers,
    LogOut,
    Settings,
    ChevronRight,
    PlusCircle,
    Tag,
    Download
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import Link from "next/link";

export default function AdminDashboard() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push("/login");
            } else {
                setUser(user);
            }
            setLoading(false);
        };
        checkUser();
    }, [router]);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push("/login");
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary" />
        </div>
    );

    if (!user) return null;

    const stats = [
        { label: "Total Projects", value: "6", icon: Layers, color: "text-blue-500", bg: "bg-blue-500/10" },
        { label: "Work Experience", value: "3", icon: Briefcase, color: "text-purple-500", bg: "bg-purple-500/10" },
        { label: "Education Records", value: "2", icon: GraduationCap, color: "text-green-500", bg: "bg-green-500/10" },
    ];

    const menuItems = [
        { title: "Manage Projects", href: "/admin/projects", icon: Layers, description: "Add, edit, or remove portfolio projects." },
        { title: "Manage Categories", href: "/admin/categories", icon: Tag, description: "Manage project categories and labels." },
        { title: "Manage Experience", href: "/admin/experience", icon: Briefcase, description: "Update your professional work history." },
        { title: "Manage Education", href: "/admin/education", icon: GraduationCap, description: "Manage your academic background." },
        { title: "Manage Resume", href: "/admin/resume", icon: Download, description: "Upload and update your professional resume." },
    ];

    return (
        <div className="min-h-screen bg-secondary/5 flex flex-col md:flex-row">
            {/* Sidebar */}
            <aside className="w-full md:w-64 bg-card border-r border-border p-6 flex flex-col">
                <div className="flex items-center gap-3 mb-10 px-2">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white">
                        <LayoutDashboard size={20} />
                    </div>
                    <span className="font-bold text-xl tracking-tight">Admin</span>
                </div>

                <nav className="flex-grow space-y-2">
                    {menuItems.map((item) => (
                        <Link key={item.href} href={item.href}>
                            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
                                <item.icon size={20} />
                                <span className="font-medium">{item.title.split(' ')[1]}</span>
                            </div>
                        </Link>
                    ))}
                </nav>

                <div className="pt-6 border-t border-border space-y-4">
                    <div className="px-3 py-2 bg-secondary/50 rounded-xl overflow-hidden truncate">
                        <p className="text-xs text-muted-foreground">Logged in as</p>
                        <p className="text-sm font-semibold truncate">{user.email}</p>
                    </div>
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={handleSignOut}
                    >
                        <LogOut size={20} className="mr-3" />
                        Sign Out
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-grow p-6 md:p-10">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                    <div>
                        <h1 className="text-3xl font-bold mb-1">Welcome back!</h1>
                        <p className="text-muted-foreground">Here's an overview of your portfolio content.</p>
                    </div>
                    <Button className="rounded-full shadow-lg shadow-primary/20">
                        <Settings className="mr-2 h-4 w-4" />
                        Site Settings
                    </Button>
                </header>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Card className="p-6 relative overflow-hidden group">
                                <div className={`absolute top-0 right-0 p-3 ${stat.bg} ${stat.color} rounded-bl-3xl opacity-50 group-hover:opacity-100 transition-opacity`}>
                                    <stat.icon size={24} />
                                </div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">{stat.label}</p>
                                <p className="text-4xl font-bold">{stat.value}</p>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            Quick Actions
                        </h2>
                        <div className="grid gap-4">
                            {menuItems.map((item, i) => (
                                <Link key={i} href={item.href}>
                                    <Card className="p-5 hover:border-primary/50 transition-colors group cursor-pointer">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                                    <item.icon size={24} />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold">{item.title}</h3>
                                                    <p className="text-sm text-muted-foreground">{item.description}</p>
                                                </div>
                                            </div>
                                            <ChevronRight className="text-muted-foreground group-hover:text-primary transition-colors translate-x-0 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-xl font-bold">Recent Updates</h2>
                        <Card className="p-6 flex flex-col items-center justify-center text-center py-12 bg-secondary/10 border-dashed">
                            <PlusCircle className="h-12 w-12 text-muted-foreground/50 mb-4" />
                            <p className="text-muted-foreground mb-4">You haven't made any updates recently.</p>
                            <Button variant="outline" className="rounded-full">Add New Item</Button>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}
