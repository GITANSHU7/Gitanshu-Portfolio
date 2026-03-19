export interface Project {
    id: string;
    title: string;
    category: string;
    image: string; // Tailwind class or URL
    description: string;
    fullDescription: string;
    technologies: string[];
    role: string;
    challenge: string;
    solution: string;
    demoUrl?: string;
    repoUrl?: string;
}

export const projects: Project[] = [
    {
        id: "ecommerce-platform",
        title: "E-Commerce Platform",
        category: "Web Design",
        image: "bg-blue-200",
        description: "A high-performance e-commerce platform built for scale.",
        fullDescription: "This project involved creating a full-featured e-commerce platform from scratch. The goal was to provide a seamless shopping experience while maintaining high performance and security.",
        technologies: ["Next.js", "Tailwind CSS", "Stripe", "Prisma", "PostgreSQL"],
        role: "Lead Developer",
        challenge: "Handling complex state management for the shopping cart and ensuring fast page loads with a large product catalog.",
        solution: "Implemented server-side rendering (SSR) for product pages and used Redux Toolkit for efficient global state management.",
        demoUrl: "https://example.com/demo",
        repoUrl: "https://github.com/example/ecommerce",
    },
    {
        id: "finance-dashboard",
        title: "Finance Dashboard",
        category: "App Design",
        image: "bg-green-200",
        description: "A comprehensive dashboard for managing personal finances.",
        fullDescription: "A sophisticated tool designed to help users track their spending, manage investments, and visualize financial data through intuitive charts and reports.",
        technologies: ["React", "Chart.js", "Firebase", "Styled Components"],
        role: "UI/UX Designer & Frontend Developer",
        challenge: "Visualizing complex financial data in a way that is easy for non-expert users to understand.",
        solution: "Designed interactive charts with drill-down capabilities and used a clean, minimalist UI to reduce cognitive load.",
        demoUrl: "https://example.com/demo",
    },
    {
        id: "travel-agency-brand",
        title: "Travel Agency Brand",
        category: "Branding",
        image: "bg-orange-200",
        description: "Full brand identity for a modern travel company.",
        fullDescription: "Created a vibrant and adventurous brand identity for a travel agency, including logo design, color palette, and marketing collateral.",
        technologies: ["Adobe Illustrator", "Figma", "Branding Design"],
        role: "Brand Identity Designer",
        challenge: "Capturing the essence of 'adventure' and 'trust' in a single cohesive brand identity.",
        solution: "Developed a dynamic logo mark and a warm, earthy color palette combined with modern typography.",
    },
    {
        id: "portfolio-template",
        title: "Portfolio Template",
        category: "Web Design",
        image: "bg-purple-200",
        description: "A premium, customizable portfolio template for creatives.",
        fullDescription: "Designed and developed a highly customizable portfolio template that helps other creatives showcase their work in a professional manner.",
        technologies: ["HTML5", "CSS3", "JavaScript", "GSAP"],
        role: "Full Stack Developer",
        challenge: "Creating a template that is both highly performant and easy for other developers to customize.",
        solution: "Used a modular CSS approach and commented code extensively, accompanied by a detailed documentation guide.",
    },
    {
        id: "social-media-app",
        title: "Social Media App",
        category: "App Design",
        image: "bg-pink-200",
        description: "A localized social networking app for niche communities.",
        fullDescription: "Built a community-focused social media application that allows users to connect based on shared interest and geographical proximity.",
        technologies: ["React Native", "Expo", "Node.js", "MongoDB"],
        role: "Mobile App Developer",
        challenge: "Real-time messaging and notification implementation with low latency.",
        solution: "Used Socket.IO for real-time communication and implemented a robust push notification system via FCM.",
    },
    {
        id: "restaurant-menu",
        title: "Restaurant Menu",
        category: "Branding",
        image: "bg-red-200",
        description: "Elegant digital and print menu design for a high-end restaurant.",
        fullDescription: "Designed an elegant, user-friendly digital and physical menu that reflects the upscale atmosphere of a fine-dining establishment.",
        technologies: ["InDesign", "Photoshop", "Typography"],
        role: "Graphic Designer",
        challenge: "Balancing high-end aesthetics with readability and ease of updating for seasonal menus.",
        solution: "Created a grid-based layout that allows for easy content swaps while maintaining the premium look.",
    },
];
