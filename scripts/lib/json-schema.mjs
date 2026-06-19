#!/usr/bin/env node
import Ajv2020 from "ajv/dist/2020.js";

export function createSchemaValidator(schemas) {
  const ajv = new Ajv2020({
    allErrors: true,
    strict: true,
    strictRequired: false,
    allowUnionTypes: true
  });
  for (const schema of Object.values(schemas)) ajv.addSchema(schema);
  return {
    validate(schemaId, data) {
      const validator = ajv.getSchema(schemaId);
      if (!validator) throw new Error(`schema is not registered: ${schemaId}`);
      const valid = validator(data);
      return valid ? [] : (validator.errors ?? []).map((error) => {
        const location = error.instancePath || "/";
        const detail = error.params?.additionalProperty
          ? `additional property ${error.params.additionalProperty}`
          : error.message;
        return `${location}: ${detail}`;
      });
    }
  };
}
