import { jsonSchemaTransform } from 'fastify-type-provider-zod';

type TransformSwaggerSchemaData = Parameters<typeof jsonSchemaTransform>[0];

export function trasformSwaggerSchema(data: TransformSwaggerSchemaData) {
  const { schema, url } = jsonSchemaTransform(data);
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  let bodySchema = schema.body as {
    type: 'object';
    properties: any;
    required: string[];
  };

  if (schema.consumes?.includes('multipart/form-data')) {
    if (bodySchema === undefined) {
      bodySchema = {
        type: 'object',
        required: [],
        properties: {},
      };
    }

    bodySchema.properties.file = {
      type: 'string',
      format: 'binary',
    };

    bodySchema.required.push('file');
  }

  return { schema, url };
}
