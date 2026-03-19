"use server";

export async function sendEmail(formData: {
    user_name: string;
    user_email: string;
    subject: string;
    message: string;
}) {
    const SERVICE_ID = process.env.EMAILJS_SERVICE_ID;
    const TEMPLATE_ID = process.env.EMAILJS_TEMPLATE_ID;
    const PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY;
    const PRIVATE_KEY = process.env.EMAILJS_PRIVATE_KEY;

    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
        return { 
            success: false, 
            message: "Email service is not configured correctly on the server." 
        };
    }

    try {
        const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                service_id: SERVICE_ID,
                template_id: TEMPLATE_ID,
                user_id: PUBLIC_KEY,
                accessToken: PRIVATE_KEY,
                template_params: {
                    from_name: formData.user_name,
                    from_email: formData.user_email,
                    subject: formData.subject,
                    message: formData.message,
                },
            }),
        });

        if (response.ok) {
            return { success: true, message: "Message sent successfully!" };
        } else {
            const errorText = await response.text();
            console.error("EmailJS API Error:", errorText);
            
            // Return a more descriptive error if possible
            if (errorText.includes("reCAPTCHA")) {
                return { success: false, message: "EmailJS reCAPTCHA verification failed. Please check your EmailJS settings." };
            }
            if (errorText.includes("template_id")) {
                return { success: false, message: "Invalid EmailJS Template ID. Please check your .env.local file." };
            }
            
            return { success: false, message: `EmailJS Error: ${errorText}` };
        }
    } catch (error: any) {
        console.error("Server Action Error:", error);
        return { success: false, message: `Server Error: ${error.message || "An unexpected error occurred"}` };
    }
}
