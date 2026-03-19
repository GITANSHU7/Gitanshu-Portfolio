"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import {
    Download,
    Upload,
    Loader2,
    ArrowLeft,
    FileText,
    CheckCircle2,
    AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ManageResume() {
    const [uploading, setUploading] = useState(false);
    const [resumeUrl, setResumeUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const router = useRouter();

    const fetchResume = async () => {
        try {
            // Check if bucket exists and get the public URL
            const { data: { publicUrl } } = supabase.storage
                .from('resumes')
                .getPublicUrl('resume.pdf');
            
            // Validate if the file exists by making a HEAD request
            // This is a simple trick to check if the file is actually there
            const res = await fetch(publicUrl, { method: 'HEAD' });
            if (res.ok) {
                setResumeUrl(publicUrl);
            }
        } catch (error) {
            console.error("Error fetching resume:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) router.push("/login");
            else fetchResume();
        };

        checkUser();
    }, [router]);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setMessage(null);
            setUploading(true);
            const file = e.target.files?.[0];
            if (!file) return;

            // Basic validation
            if (file.type !== 'application/pdf') {
                setMessage({ type: 'error', text: 'Please upload a PDF file.' });
                return;
            }

            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                setMessage({ type: 'error', text: 'File size must be less than 5MB.' });
                return;
            }

            // Upload to Supabase Storage
            // The bucket name 'resumes' must exist and be public
            const { error: uploadError } = await supabase.storage
                .from('resumes')
                .upload('resume.pdf', file, { 
                    upsert: true,
                    cacheControl: '3600'
                });

            if (uploadError) {
                if (uploadError.message.includes('bucket not found')) {
                    throw new Error('Storage bucket "resumes" not found. Please create it in your Supabase dashboard.');
                }
                throw uploadError;
            }

            const { data: { publicUrl } } = supabase.storage
                .from('resumes')
                .getPublicUrl('resume.pdf');

            setResumeUrl(publicUrl);
            setMessage({ type: 'success', text: 'Resume uploaded successfully!' });
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Failed to upload resume.' });
        } finally {
            setUploading(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary" />
        </div>
    );

    return (
        <div className="min-h-screen bg-secondary/5 p-6 md:p-10">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="flex flex-col gap-4 mb-10">
                    <Link href="/admin" className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors w-fit">
                        <ArrowLeft size={14} /> Back to Dashboard
                    </Link>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <Download className="text-primary" /> Manage Resume
                    </h1>
                    <p className="text-muted-foreground">Upload your professional resume as a PDF. This will be available for download on your portfolio landing page.</p>
                </div>

                <Card className="p-8 border-border/50 bg-card overflow-hidden relative">
                    <div className="space-y-8">
                        {/* Current Resume Preview */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold">Current Resume</h3>
                            {resumeUrl ? (
                                <div className="flex items-center gap-4 p-4 bg-secondary/30 rounded-2xl border border-border">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                        <FileText size={24} />
                                    </div>
                                    <div className="flex-grow min-w-0">
                                        <p className="font-bold truncate">resume.pdf</p>
                                        <p className="text-xs text-muted-foreground">Available at public URL</p>
                                    </div>
                                    <Button variant="outline" size="sm" className="rounded-full">
                                        <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                                            View
                                        </a>
                                    </Button>
                                </div>
                            ) : (
                                <div className="p-10 border-2 border-dashed border-border/50 rounded-2xl text-center text-muted-foreground bg-secondary/10">
                                    <FileText size={40} className="mx-auto mb-3 opacity-20" />
                                    <p>No resume uploaded yet.</p>
                                </div>
                            )}
                        </div>

                        {/* Upload Section */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold">Upload New Resume</h3>
                            <div className="relative aspect-[21/9] rounded-2xl overflow-hidden bg-secondary/50 border-2 border-dashed border-primary/20 flex items-center justify-center group hover:border-primary/50 transition-colors">
                                <div className="text-center p-6">
                                    <Upload className="mx-auto mb-2 text-primary group-hover:scale-110 transition-transform" />
                                    <p className="font-bold">Click to upload or drag and drop</p>
                                    <p className="text-xs text-muted-foreground mt-1">PDF files only (Max 5MB)</p>
                                </div>
                                <input
                                    type="file"
                                    accept=".pdf"
                                    onChange={handleUpload}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    disabled={uploading}
                                />
                                {uploading && (
                                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-10">
                                        <div className="text-center">
                                            <Loader2 className="animate-spin mx-auto mb-2 text-primary" />
                                            <p className="font-bold text-primary">Uploading Resume...</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Status Messages */}
                        {message && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`p-4 rounded-xl flex items-center gap-3 ${
                                    message.type === 'success' ? 'bg-green-500/10 text-green-600 border border-green-500/20' : 'bg-destructive/10 text-destructive border border-destructive/20'
                                }`}
                            >
                                {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                                <p className="text-sm font-medium">{message.text}</p>
                            </motion.div>
                        )}
                    </div>
                </Card>

                {/* Configuration Help */}
                <Card className="mt-8 p-6 bg-primary/5 border-primary/10">
                    <div className="flex items-start gap-4">
                        <div className="mt-1 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                            <AlertCircle size={18} />
                        </div>
                        <div>
                            <h4 className="font-bold text-sm mb-2 uppercase tracking-wider text-primary">Supabase Configuration</h4>
                            <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-4">
                                <li>Ensure a bucket named <code className="bg-primary/10 text-primary px-1 rounded font-mono">resumes</code> exists in Supabase Storage.</li>
                                <li>The bucket <strong>MUST be Public</strong> to allow your website visitors to download it.</li>
                                <li>Set a storage policy to allow <code className="bg-primary/10 text-primary px-1 rounded font-mono">authenticated</code> users to upload/upsert files.</li>
                            </ul>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
