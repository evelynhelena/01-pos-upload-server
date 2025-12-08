import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { db } from '@/infra/db';
import { schema } from '@/infra/db/schemas';
export const uploadImageRoute: FastifyPluginAsyncZod = async server => {
  server.post(
    '/uploads',
    {
      schema: {
        summary: 'Upload an Image',
        consumes: ['multipart/form-data'],
        response: {
          201: z.object({ uploadId: z.string() }),
          409: z
            .object({ message: z.string() })
            .describe('upload already exists.'),
        },
      },
    },
    async (request, reply) => {
      await db.insert(schema.uploads).values({
        name: 'maria',
        remoteKey: 'maria.jpg',
        remoteUrl: 'http://teste.com.br',
      });

      return reply.status(201).send({ uploadId: 'teste' });
    }
  );
};
