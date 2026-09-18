import type { FastifyTypeProvider } from "fastify";
import type Schema from "schemastery";

export interface SchemasteryTypeProvider extends FastifyTypeProvider {
  validator: this["schema"] extends Schema<infer T> ? T : unknown;
  serializer: this["schema"] extends Schema<infer T> ? T : unknown;
}
