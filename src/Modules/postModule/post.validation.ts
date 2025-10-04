import z from 'zod';
import { allowComments, availability } from '../../common/Enums/post.enum';
import mongoose from 'mongoose';

export const createPostSchema = {
    body: z.strictObject({
        content: z.string().min(5).max(10000).optional(),
        attachments: z.array(z.object({
            filedname: z.string(),
            originalname: z.string(),
            encoding: z.string(),
            mimetype: z.string(),
            buffer: z.any().optional(),
            size: z.number(),
            path: z.string(),
        })).max(10).optional(),
        assetFolderId: z.string().optional(),
        allowComments: z.enum(allowComments).default(allowComments.allow).optional(),
        availability: z.enum(availability).default(availability.public).optional(),
        tags: z.array(z.string().refine((data) => mongoose.Types.ObjectId.isValid(data), { message: "Invalid user id", })).optional()

    }).superRefine((data, ctx) => {
        if (!data?.content && (!data.attachments || !data.attachments?.length)) {
            ctx.addIssue({
                code: 'custom',
                path: ['content'],
                message: "content is required you must provide at least one content ",
            })
        }
        if (data?.tags && new Set(data.tags).size !== data.tags.length) {
            ctx.addIssue({
                code: 'custom',
                path: ['tags'],
                message: 'Duplicate tags detected',
            });
        }
    }).optional()
}
