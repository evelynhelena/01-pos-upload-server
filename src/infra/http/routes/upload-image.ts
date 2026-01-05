import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { uploadImage } from '@/app/functions/uploadImage/upload-image';
import { isRight, unwrapEither } from '@/shared/either';
export const uploadImageRoute: FastifyPluginAsyncZod = async server => {
  server.post(
    '/uploads',
    {
      schema: {
        summary: 'Upload an Image',
        tags: ['uploads'],
        consumes: ['multipart/form-data'],
        response: {
          201: z.object({ message: z.string() }),
          400: z.object({ message: z.string() }).describe('File is required.'),
          409: z.object({ message: z.string() }).describe('Invalid format.'),
        },
      },
    },
    async (request, reply) => {
      const uploadeFile = await request.file({
        limits: {
          fileSize: 1024 * 1024 * 2, //2mb
        },
      });

      if (!uploadeFile) {
        return reply.status(400).send({ message: 'File is required' });
      }

      const result = await uploadImage({
        fileName: uploadeFile.filename,
        contentType: uploadeFile.mimetype,
        contentStream: uploadeFile.file,
      });

      if (uploadeFile.file.truncated) {
        return reply.status(400).send({ message: 'file size limit reached' });
      }

      if (isRight(result)) {
        console.log(unwrapEither(result));
        return reply.status(201).send({ message: 'dados inseridos' });
      }

      const error = unwrapEither(result);

      switch (error.constructor.name) {
        case 'InvalidFileFormat':
          return reply.status(400).send({ message: error.message });
      }
    }
  );
};
