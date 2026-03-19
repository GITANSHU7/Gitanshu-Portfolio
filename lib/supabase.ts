import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let client: SupabaseClient | null = null;

if (supabaseUrl && supabaseAnonKey) {
    client = createClient(supabaseUrl, supabaseAnonKey);
} else {
    console.warn("Supabase environment variables are missing. Please check your .env.local file.");
}

// Export a proxy or a wrapper that doesn't crash on initialization
export const supabase = new Proxy({} as SupabaseClient, {
    get: (target, prop) => {
        // Gracefully handle internal React/Next.js property accesses
        if (typeof prop === 'string' && (prop.startsWith('$$') || prop === 'toJSON' || prop === 'constructor')) {
            return (target as any)[prop];
        }

        if (!client) {
            console.warn(`Supabase: Accessing "${String(prop)}" but environment variables are missing.`);

            // Return a recursive proxy that logs and returns a mock failure
            const mock = (() => ({ data: null, error: { message: "Supabase not configured" } })) as any;
            return new Proxy(mock, {
                get: (_, nestedProp) => {
                    console.error(`Supabase: Tried to access "supabase.${String(prop)}.${String(nestedProp)}" but config is missing.`);
                    return () => Promise.resolve({ data: null, error: { message: "Supabase not configured" } });
                }
            });
        }
        return (client as any)[prop];
    }
});
