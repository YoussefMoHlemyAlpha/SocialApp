import z from 'zod'



export const createGroupSchema=z.object({
    group:z.string().min(3).max(30),
    participants:z.array(z.string())
})