import { InvalidConditionError } from "../errors";
import type { CQLContext, Condition, TextCondition } from "./base-types";

function createTextOperator(
  type: TextCondition["type"],
  formatter: (ctx: CQLContext, val: unknown) => string,
) {
  return (attr: string, value: unknown): Condition => {
    const errName = type === "contains" ? "contains (text)" : type;
    if (!attr) throw new InvalidConditionError(errName, { type, attr }, "attr");
    if (value === undefined)
      throw new InvalidConditionError(errName, { type, value }, "value");
    return {
      type,
      attr,
      value,
      toCQL: (ctx) => `${attr} LIKE ${formatter(ctx, value)}`,
    };
  };
}

/**
 * Creates a LIKE condition with a wildcard pattern
 * @example
 * like("name", "A%") // name LIKE 'A%'
 * @see {@link https://docs.ogc.org/is/21-065r2/21-065r2.html OGC CQL - Text Operators}
 */
export const like = createTextOperator("like", (ctx, val) =>
  ctx.formatValue(val),
);

/**
 * Creates a condition that checks if a string contains a substring
 * @example
 * contains("description", "important") // description LIKE '%important%'
 * @see {@link https://docs.ogc.org/is/21-065r2/21-065r2.html OGC CQL - Text Operators}
 */
export const contains = createTextOperator("contains", (ctx, val) =>
  ctx.formatValue(`%${val}%`),
);
