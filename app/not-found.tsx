import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Home, AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background px-4 text-center">
      <div className="space-y-8 max-w-md">
        <div className="relative inline-flex items-center justify-center">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <AlertCircle size={100} className="text-primary relative z-10" strokeWidth={1.5} />
        </div>
        
        <div className="space-y-4">
          <h1 className="text-7xl font-extrabold tracking-tighter sm:text-8xl text-primary/10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none -z-10">404</h1>
          <h2 className="text-3xl font-bold text-foreground">Page Not Found</h2>
          <p className="text-muted-foreground leading-relaxed max-w-[280px] mx-auto">
            Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>

        <div className="pt-4">
          <Link href="/">
            <Button size="lg" className="rounded-full gap-2 px-8 shadow-xl shadow-primary/20 h-12">
              <Home size={18} />
              Return Home
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[10%] left-[10%] w-64 h-64 bg-primary/5 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-[10%] right-[10%] w-96 h-96 bg-blue-500/5 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px]" />
      </div>
    </div>
  );
}
