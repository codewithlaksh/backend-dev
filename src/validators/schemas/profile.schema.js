import { z } from "zod";

const socialLinksSchema = z.object({
    name: z.string(),
    website: z.string()
})

export const createProfileSchema = z.object({
    phone: z.string().optional(),
    socialLinks: z.preprocess((value) => {
        if (Array.isArray(value)) return value;

        if (typeof value === "string") {
            try {
                return JSON.parse(value);
            } catch {
                return value;
            }
        }

        return value;
    }, z.array(socialLinksSchema)),
    bio: z.string().optional()
})