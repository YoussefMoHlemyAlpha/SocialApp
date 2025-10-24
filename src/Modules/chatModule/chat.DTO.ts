import { createGroupSchema } from "./chat.validation";
import z from 'zod'


export type CreateGroupDTO=z.infer<typeof createGroupSchema>
