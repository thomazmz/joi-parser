import { boolean, object, string, number, date } from "@thomazmz/joi-utils";
import { JoiParser } from "./joi-parser";

describe("parser", () => {
  const parser = new JoiParser(
    object({
      boolean: boolean(),
      string: string(),
      number: number(),
      date: date(),
    })
  );

  describe("parse", () => {
    it("should return parsed value when value being passed fits the parser schema", () => {
      const parseableValue = {
        boolean: "true",
        string: "string",
        number: "123",
        date: "Wed May 17 2023 00:07:43 GMT-0700",
      };

      const parsedValue = parser.parse(parseableValue);

      expect(parsedValue).toEqual({
        boolean: true,
        string: "string",
        number: 123,
        date: new Date("Wed May 17 2023 00:07:43 GMT-0700"),
      });
    });

    it("should throw ValidationError when value being parsed does not fit the parser schema", async () => {
      const expectedErrorMessage = `"boolean" must be a boolean. "number" must be a number. "date" must be a valid date`;

      const unparseableValue = {
        boolean: "notBoolean",
        string: "notNumber",
        number: true,
        date: "someString",
      };

      const callParser = async () => await parser.parse(unparseableValue);

      await expect(callParser).rejects.toThrowError(Error);
      await expect(callParser).rejects.toThrowError(expectedErrorMessage);
    });
  });
});
