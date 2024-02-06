export const emailDomains = [
    "gmail.com",
    "yahoo.com",
    "yahoo.ro",
    "outlook.com",
    "hotmail.com",
    "hotmail.ro",
    "protonmail.com",
    "proton.me",
    "icloud.com",
    "aol.com"
];

/**
 * Check if the email contains a valid email provider
 * @param {string} email - The email you want to test 
 * @returns {boolean} **true** if the provided email is valid
 */
export const validateEmail = (email: string) => {
    const domain = email.split("@");
    return emailDomains.includes(domain[1]);
};