import z from 'zod'
import { createPostSchema, LikeandUnlikeSchema } from './post.validation'


export type createPostDTO =z.infer<typeof createPostSchema>

export type LikeandUnlikeDTO =z.infer<typeof LikeandUnlikeSchema>