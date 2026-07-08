import { z } from "zod";
import {createProfileSchema, updateProfileSchema} from "./schemas/profile.schema.js";

export const createProfileValidator = z.object({
    body: createProfileSchema
})

export const updateProfileValidator = z.object({
    body: updateProfileSchema,
    query: z.object({
        profileId: z.string({
            error: 'Missing profile id!'
        })
    })
})

export const deleteProfileValidator = z.object({
    query: z.object({
        profileId: z.string({
            error: 'Missing profile id!'
        })
    })
})