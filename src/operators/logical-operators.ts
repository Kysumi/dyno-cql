import { InvalidConditionError } from "../errors";
import type { Condition } from "./base-types";

/**
 * Combines multiple conditions with AND operator
 * @example
 * and(
 *   eq("status", "ACTIVE"),
 *   gt("age", 18)
 * ) // status = "ACTIVE" AND age > 18
 * @see {@link https://docs.ogc.org/is/21-065r2/21-065r2.html OGC CQL - Logical Operators}
 */
export const and = (...conditions: Condition[]): Condition => {
  if (!conditions || conditions.length === 0) {
    throw new InvalidConditionError(
      "and",
      { type: "and", conditions },
      "conditions (non-empty array)",
    );
  }
  return {
    type: "and",
    conditions,
    toCQL: (ctx) => `(${conditions.map((c) => c.toCQL(ctx)).join(" AND ")})`,
  };
};

/**
 * Combines multiple conditions with OR operator
 * @example
 * or(
 *   eq("status", "PENDING"),
 *   eq("status", "PROCESSING")
 * ) // status = "PENDING" OR status = "PROCESSING"
 * @see {@link https://docs.ogc.org/is/21-065r1/21-065r1.html OGC CQL - Logical Operators}
 */
export const or = (...conditions: Condition[]): Condition => {
  if (!conditions || conditions.length === 0) {
    throw new InvalidConditionError(
      "or",
      { type: "or", conditions },
      "conditions (non-empty array)",
    );
  }
  return {
    type: "or",
    conditions,
    toCQL: (ctx) => `(${conditions.map((c) => c.toCQL(ctx)).join(" OR ")})`,
  };
};

/**
 * Negates a condition
 * @example
 * not(eq("status", "DELETED")) // NOT status = "DELETED"
 * @see {@link https://docs.ogc.org/is/21-065r2/21-065r2.html OGC CQL - Logical Operators}
 */
export const not = (condition: Condition): Condition => {
  if (!condition) {
    throw new InvalidConditionError("not", { type: "not" }, "condition");
  }
  return {
    type: "not",
    condition,
    toCQL: (ctx) => `NOT (${condition.toCQL(ctx)})`,
  };
};
