import { InvalidConditionError } from "../errors";
import type { Condition } from "./base-types";

/**
 * Creates a LIKE condition with a wildcard pattern
 * @example
 * like("name", "A%") // name LIKE 'A%'
 * @see {@link https://docs.ogc.org/is/21-065r2/21-065r2.html OGC CQL - Text Operators}
 */
export const like = (attr: string, value: unknown): Condition => ({
  type: "like",
  attr,
  value,
  toCQL: (ctx) => {
    if (!attr) {
      throw new InvalidConditionError("like", { type: "like", attr }, "attr");
    }
    return `${attr} LIKE ${ctx.formatValue(value)}`;
  },
});

/**
 * Creates a condition that checks if a string contains a substring
 * @example
 * contains("description", "important") // description LIKE '%important%'
 * @see {@link https://docs.ogc.org/is/21-065r2/21-065r2.html OGC CQL - Text Operators}
 */
export const contains = (attr: string, value: unknown): Condition => ({
  type: "contains",
  attr,
  value,
  toCQL: (ctx) => {
    if (!attr) {
      throw new InvalidConditionError(
        "contains (text)",
        { type: "contains", attr },
        "attr",
      );
    }
    if (value === undefined) {
      throw new InvalidConditionError(
        "contains (text)",
        { type: "contains", value },
        "value",
      );
    }
    return `${attr} LIKE ${ctx.formatValue(`%${value}%`)}`;
  },
});
