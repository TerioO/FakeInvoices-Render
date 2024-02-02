export interface BrevoEmailPayload {
    subject: string;
    sender: {
        name: string;
        email: string;
    }
    to: {
        name: string;
        email: string;
    }[],
    htmlContent: string;
}