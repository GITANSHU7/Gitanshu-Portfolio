import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export function Card({ children, className, ...props }: CardProps) {
    return (
        <div
            className={cn(
                "rounded-xl border bg-card text-card-foreground shadow focus:outline-none",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}
