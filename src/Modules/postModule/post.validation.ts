import z from 'zod';
import { allowComments, availability } from '../../common/Enums/post.enum';
import { generalValidation } from '../../utils/generalValidation';

export const createPostSchema = z.object({
  content: generalValidation.shape.content,
  files: generalValidation.shape.files({}),
  assetFolderId: generalValidation.shape.assetFolderId,
  allowComments: generalValidation.shape.allowComments,
  availability: generalValidation.shape.availability,
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


