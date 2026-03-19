"use client";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Mail, MapPin, Phone, Send, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef } from "react";
import { sendEmail } from "@/app/actions/sendEmail";

export function Contact() {
    const formRef = useRef<HTMLFormElement>(null);
    const [isSending, setIsSending] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formRef.current) return;

        setIsSending(true);
        setStatus(null);

        const formData = new FormData(formRef.current);
        const data = {
            user_name: formData.get("user_name") as string,
            user_email: formData.get("user_email") as string,
            subject: formData.get("subject") as string,
            message: formData.get("message") as string,
        };

        try {
            const result = await sendEmail(data);

            if (result.success) {
                setStatus({ type: 'success', message: result.message });
                formRef.current.reset();
            } else {
                setStatus({ type: 'error', message: result.message });
            }
        } catch (error) {
            console.error("Submission Error:", error);
            setStatus({ type: 'error', message: 'Failed to send message. Please try again.' });
        } finally {
            setIsSending(false);
        }
    };

    return (
        <section id="contact" className="py-20 md:py-32">
            <div className="container mx-auto px-4 md:px-6">
                <SectionHeading title="Contact Me" subtitle="Get In Touch" />

                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Info Cards */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="space-y-6"
                    >
                        <div className="bg-secondary/20 p-6 rounded-2xl flex items-center gap-6 border border-border/50">
                            <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-primary shrink-0">
                                <Phone className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold">Phone</h4>
                                <p className="text-muted-foreground">+91 7759046254</p>
                            </div>
                        </div>

                        <div className="bg-secondary/20 p-6 rounded-2xl flex items-center gap-6 border border-border/50">
                            <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-primary shrink-0">
                                <Mail className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold">Email</h4>
                                <p className="text-muted-foreground">gitanshugautam7@gmail.com</p>
                            </div>
                        </div>

                        <div className="bg-secondary/20 p-6 rounded-2xl flex items-center gap-6 border border-border/50">
                            <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-primary shrink-0">
                                <MapPin className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold">Address</h4>
                                <p className="text-muted-foreground">Bhopal, Madhya Pradesh, India</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <Card className="p-8 shadow-lg border-border/50 bg-background/50 backdrop-blur-sm relative overflow-hidden">
                            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid sm:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Name</label>
                                        <input 
                                            name="user_name"
                                            type="text" 
                                            required 
                                            className="w-full p-3 rounded-lg border bg-secondary/20 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" 
                                            placeholder="Enter your name" 
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Email</label>
                                        <input 
                                            name="user_email"
                                            type="email" 
                                            required 
                                            className="w-full p-3 rounded-lg border bg-secondary/20 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" 
                                            placeholder="Enter your email" 
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Subject</label>
                                    <input 
                                        name="subject"
                                        type="text" 
                                        required 
                                        className="w-full p-3 rounded-lg border bg-secondary/20 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" 
                                        placeholder="Project Inquiry" 
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Message</label>
                                    <textarea 
                                        name="message"
                                        required 
                                        className="w-full p-3 rounded-lg border bg-secondary/20 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all min-h-[150px]" 
                                        placeholder="Tell me about your project..." 
                                    />
                                </div>

                                <Button 
                                    type="submit" 
                                    className="w-full h-12 rounded-xl font-bold transition-all" 
                                    size="lg"
                                    disabled={isSending}
                                >
                                    {isSending ? (
                                        <>Sending... <Loader2 className="ml-2 w-4 h-4 animate-spin" /></>
                                    ) : (
                                        <>Send Message <Send className="ml-2 w-4 h-4" /></>
                                    )}
                                </Button>

                                <AnimatePresence>
                                    {status && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className={`p-4 rounded-xl flex items-center gap-3 border shadow-sm ${
                                                status.type === 'success' 
                                                ? 'bg-green-500/10 text-green-600 border-green-500/20' 
                                                : 'bg-destructive/10 text-destructive border-destructive/20'
                                            }`}
                                        >
                                            {status.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                                            <p className="text-sm font-medium">{status.message}</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </form>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
