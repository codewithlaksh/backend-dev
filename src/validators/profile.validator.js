import { z } from "zod";
import {createProfileSchema} from "./schemas/profile.schema.js";

export const createProfileValidator = z.object({
    body: createProfileSchema
})