import { cn } from "@/lib/utils";

interface SectionHeadingProps {
    title: string;
    subtitle: string;
    className?: string;
    center?: boolean;
}

export function SectionHeading({
    title,
    subtitle,
    className,
    center = true,
}: SectionHeadingProps) {
    return (
        <div
            className={cn(
                "mb-12 flex flex-col gap-2",
                center ? "text-center items-center" : "text-left items-start",
                className
            )}
        >
            <span className="text-primary font-semibold tracking-wide uppercase text-sm">
                {subtitle}
            </span>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {title}
            </h2>
            <div className="h-1 w-20 bg-primary/20 rounded-full mt-2 overflow-hidden">
                <div className="h-full w-1/2 bg-primary animate-pulse" />
            </div>
        </div>
    );
}
