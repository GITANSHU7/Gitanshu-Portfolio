import { Github, Linkedin, Twitter, Dribbble, Instagram } from "lucide-react";
import Link from "next/link";

export function Footer() {
    return (
        <footer className="py-8 border-t bg-secondary/10">
            <div className="container mx-auto px-4 text-center">
                <div className="flex justify-center gap-6 mb-8">
                    <a href="https://www.linkedin.com/in/gitanshu-gautam-3a863b149/" target="_blank" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white transition-all duration-300">
                        <Linkedin className="w-5 h-5" />
                    </a>
                    <a href="https://github.com/GITANSHU7/" target="_blank" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white transition-all duration-300">
                        <Github className="w-5 h-5" />
                    </a>
                    <a href="https://www.instagram.com/gitanshu_gautam7/" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white transition-all duration-300">
                        <Instagram className="w-5 h-5" />
                    </a>
                    {/* <a href="#" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white transition-all duration-300">
                        <Dribbble className="w-5 h-5" />
                    </a> */}
                </div>
                <div className="flex flex-col md:flex-row justify-center items-center gap-4">
                    <p className="text-muted-foreground text-sm">
                        © {new Date().getFullYear()} Gitanshu.dev. All rights reserved.
                    </p>
                    <span className="hidden md:inline text-muted-foreground/30">|</span>
                    <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                        Admin Login
                    </Link>
                </div>
            </div>
        </footer>
    );
}
