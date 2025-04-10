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
export const and = (...conditions: Condition[]): Condition => ({
  type: "and",
  conditions,
});

/**
 * Combines multiple conditions with OR operator
 * @example
 * or(
 *   eq("status", "PENDING"),
 *   eq("status", "PROCESSING")
 * ) // status = "PENDING" OR status = "PROCESSING"
 * @see {@link https://docs.ogc.org/is/21-065r1/21-065r1.html OGC CQL - Logical Operators}
 */
export const or = (...conditions: Condition[]): Condition => ({
  type: "or",
  conditions,
});

/**
 * Negates a condition
 * @example
 * not(eq("status", "DELETED")) // NOT status = "DELETED"
 * @see {@link https://docs.ogc.org/is/21-065r2/21-065r2.html OGC CQL - Logical Operators}
 */
export const not = (condition: Condition): Condition => ({
  type: "not",
  condition,
});
