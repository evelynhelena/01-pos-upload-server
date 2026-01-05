import { randomUUID } from 'node:crypto';
import dayjs from 'dayjs';
import { describe, expect, it } from 'vitest';
import { isRight, unwrapEither } from '@/shared/either';
import { makeUpload } from '@/test/factories/make-upload';
import { getUploads } from '../getUploads/get-uploads';
import { exportUploads } from './export-uploads';

describe('export uploads', () => {
  it('should be able to export uploads', async () => {
    const namePattern = randomUUID();

    const upload1 = await makeUpload({ name: `${namePattern}.wep` });
    const upload2 = await makeUpload({ name: `${namePattern}.wep` });
    const upload3 = await makeUpload({ name: `${namePattern}.wep` });
    const upload4 = await makeUpload({ name: `${namePattern}.wep` });
    const upload5 = await makeUpload({ name: `${namePattern}.wep` });

    const sut = await exportUploads({
      searchQuery: namePattern,
    });
  });
});
