import z from 'zod';
import { generalValidation } from '../../utils/generalValidation';


export const createReplySchema = z.object({
  content: generalValidation.shape.content,
  files: generalValidation.shape.files({}),
  assetFolderId: generalValidation.shape.assetFolderId,
  CommentId:z.string(),
  tags: generalValidation.shape.tags
}).superRefine((data, ctx) => {
  if (!data.content && (!data.files || data.files.length === 0)) {
    ctx.addIssue({
      code: 'custom',
      path: ['content', 'files'],
      message: "Either content or files are required"
    });
  }
});