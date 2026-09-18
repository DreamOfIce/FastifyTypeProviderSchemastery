import { Converter } from "@dreamofice/schemastery-json-schema";
import { mapValues } from "cosmokit";
import type { ContextConfigDefault, FastifyPluginAsync, RouteGenericInterface } from "fastify";
import fastifyPlugin from "fastify-plugin";
import Schema from "schemastery";

export interface SchemasteryPluginOptions {
  converter?: Converter;
}

interface FastifySchema {
  body?: Schema | object | { content: Record<string, Schema | object> };
  query?: Schema | object;
  querystring?: Schema | object;
  params?: Schema | object;
  headers?: Schema | object;
  response?: Record<
    number | string,
    Schema | object | { content: Record<string, Schema | object> }
  >;
}

const convertSchema = (converter: Converter, schema: unknown) => {
  if (schema instanceof Schema) return converter.toJSONSchema(schema);
  else return schema;
};

const isContentTypeSchema = (
  schema: unknown,
): schema is { content: Record<string, Schema | object> } =>
  schema !== null && typeof schema === "object" && Reflect.has(schema, "content");

const plugin: FastifyPluginAsync<SchemasteryPluginOptions> = async (instance, options) => {
  const converter =
    options.converter ??
    new Converter({
      draft: "draft-07",
      addSchemaVersion: false,
      unsupportedTypes: "error",
      patternTransformOptions: {
        unicodeFlag: false,
        unicodeSetsFlag: false,
        unicodePropertyEscapes: false,
      },
    });

  instance.addHook<RouteGenericInterface, ContextConfigDefault, FastifySchema>(
    "onRoute",
    (routeOptions) => {
      const { schema } = routeOptions;
      if (schema) {
        routeOptions.schema = mapValues(schema as Required<FastifySchema>, (value, key) => {
          switch (key) {
            case "body":
              if (isContentTypeSchema(value))
                return mapValues(value.content, (s) => convertSchema(converter, s));
              else return convertSchema(converter, value);
            case "headers":
            case "params":
            case "query":
            case "querystring":
              return convertSchema(converter, value);
            case "response":
              return mapValues(value, (v) => {
                if (isContentTypeSchema(v))
                  return {
                    content: mapValues(v.content, (s) => convertSchema(converter, s)),
                  };
                else return convertSchema(converter, v);
              });
          }
        }) as FastifySchema;
      }
    },
  );
};

export const schemasteryPlugin = fastifyPlugin(plugin, {
  name: "type-provider-schemastery",
  fastify: "^5.0.0",
});
