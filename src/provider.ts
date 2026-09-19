import type { FastifyTypeProvider } from "fastify";
import type Schema from "schemastery";

export type InferType<T> = T extends Schema<infer U> ? U : T;

export interface SchemasteryTypeProvider extends FastifyTypeProvider {
  validator: InferType<this["schema"]>;
  serializer: InferType<this["schema"]>;
}
