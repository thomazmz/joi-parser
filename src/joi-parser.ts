import joi, { Schema, ValidationResult } from "joi";
import { Parser, Value } from "@thomazmz/core-context";

export class JoiParser<V extends Value> implements Parser<V> {
  constructor(private readonly schema: Schema<V>) {}

  parse(value: unknown): V | never {
    const { value: parsedValue, error } = this.validateAgainstSchema(value);
    return error ? this.throwError(error.message) : parsedValue;
  }

  protected mapValidationError(error: joi.ValidationError): Error {
    return new Error(error.message);
  }

  protected validateAgainstSchema(
    objectUnderValidation: unknown
  ): ValidationResult {
    return this.schema
      .prefs({
        stripUnknown: true,
        abortEarly: false,
      })
      .strict(false)
      .validate(objectUnderValidation);
  }

  protected throwError(reason: string): void {
    throw new Error(reason);
  }
}
