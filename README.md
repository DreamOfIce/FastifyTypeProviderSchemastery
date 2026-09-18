# FastifyTypeProviderSchemastery

[Schemastery](https://github.com/shigma/schemastery) type provider for Fastify v5

> **NOTICE**: this package converts Schemastery to JSON Schema within [schemastery-json-schema](https://github.com/DreamOfIce/SchemasteryJSONSchema) in the `onRoute` hook
> While this approach minimizes changes to the Fastify instance, but it also results some advanced types are not supported

## Usage

```ts
import Fastify from "fastify";
import { schemasteryPlugin, type SchemasteryTypeProvider } from "fastify-type-provider-schemastery";

const fastify = Fastify({}).withTypeProvider<SchemasteryTypeProvider>();
fastify.register(schemasteryPlugin);
// or use you custom converter:
// fastify.register(schemasteryPlugin, {converter: yourConverter});
```

## License

[MIT](./LICENSE)
