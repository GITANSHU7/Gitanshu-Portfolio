"use client";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { Code, Palette, Smartphone, LineChart, LayoutDashboard } from "lucide-react";
import { motion } from "framer-motion";

const services = [
    {
        icon: Code,
        title: "Web Development",
        description: "Building fast, responsive, and secure websites using modern technologies like Next.js and React.",
    },
    {
        icon: Palette,
        title: "UI/UX Design",
        description: "Designing intuitive and beautiful user interfaces that provide exceptional user experiences.",
    },
    {
        icon: LayoutDashboard,
        title: "Admin Panel",
        description: "Creating data-driven dashboards, enterprise admin panels, and workflow management systems with real-time analytics.",
    },
    {
        icon: LineChart,
        title: "SEO Optimization",
        description: "Optimizing your online presence to rank higher in search results and drive organic traffic.",
    },
];

export function Services() {
    return (
        <section id="services" className="py-20 md:py-32">
            <div className="container mx-auto px-4 md:px-6">
                <SectionHeading title="My Services" subtitle="What I Do" />

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <Card className="p-6 h-full hover:shadow-lg transition-all hover:-translate-y-2 group cursor-pointer border-border/50 bg-secondary/10">
                                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                    <service.icon className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    {service.description}
                                </p>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
