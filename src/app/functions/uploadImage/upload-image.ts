import { Readable } from 'node:stream';
import z from 'zod';
import { db } from '@/infra/db';
import { schema } from '@/infra/db/schemas';
import { uploadFileToStorage } from '@/infra/storage/upload-file-to-storage';
import { type Either, makeLeft, makeRight } from '@/shared/either';
import { InvalidFileFormat } from '../errors/invalid-file-format';

const uploadImageInpyt = z.object({
  fileName: z.string(),
  contentType: z.string(),
  contentStream: z.instanceof(Readable), // quando utilizamos esse método, quardamos pedacinhos da imagem, sem comprometer tanto a memória, diferente do método buffer que sempre guarda o arquivo todo
});

type UploadImageInput = z.input<typeof uploadImageInpyt>;

const allowMimeTypes = ['image/jpg', 'image/jpeg', 'image.png', 'image/webp'];

export async function uploadImage(
  input: UploadImageInput
): Promise<Either<InvalidFileFormat, { url: string }>> {
  const { contentStream, contentType, fileName } =
    uploadImageInpyt.parse(input);

  if (!allowMimeTypes.includes(contentType)) {
    return makeLeft(new InvalidFileFormat());
  }

  // TODO: carregar a imagem p/ cloudFare R2

  const { key, url } = await uploadFileToStorage({
    fileName,
    contentType,
    contentStream,
    folder: 'images',
  });

  await db.insert(schema.uploads).values({
    name: fileName,
    remoteKey: key,
    remoteUrl: url,
  });

  return makeRight({ url: url });
}
