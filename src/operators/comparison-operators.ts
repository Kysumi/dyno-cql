import type { Condition } from "./base-types";

/**
 * Creates a comparison condition builder function for the specified operator.
 * @internal
 */
const createComparisonCondition =
  (type: "eq" | "ne" | "lt" | "lte" | "gt" | "gte") =>
  (attr: string, value: unknown): Condition => ({
    type,
    attr,
    value,
  });

/**
 * Creates an equals (=) condition
 * @example
 * eq("status", "ACTIVE") // status = "ACTIVE"
 * @see {@link https://docs.ogc.org/is/21-065r2/21-065r2.html OGC CQL - Comparison Operators}
 */
export const eq = createComparisonCondition("eq");

/**
 * Creates a not equals (!=) condition
 * @example
 * ne("status", "DELETED") // status <> "DELETED"
 * @see {@link https://docs.ogc.org/is/21-065r2/21-065r2.html OGC CQL - Comparison Operators}
 */
export const ne = createComparisonCondition("ne");

/**
 * Creates a less than (<) condition
 * @example
 * lt("age", 18) // age < 18
 * @see {@link https://docs.ogc.org/is/21-065r2/21-065r2.html OGC CQL - Comparison Operators}
 */
export const lt = createComparisonCondition("lt");

/**
 * Creates a less than or equal to (<=) condition
 * @example
 * lte("age", 18) // age <= 18
 * @see {@link https://docs.ogc.org/is/21-065r2/21-065r2.html OGC CQL - Comparison Operators}
 */
export const lte = createComparisonCondition("lte");

/**
 * Creates a greater than (>) condition
 * @example
 * gt("price", 100) // price > 100
 * @see {@link https://docs.ogc.org/is/21-065r2/21-065r2.html OGC CQL - Comparison Operators}
 */
export const gt = createComparisonCondition("gt");

/**
 * Creates a greater than or equal to (>=) condition
 * @example
 * gte("price", 100) // price >= 100
 * @see {@link https://docs.ogc.org/is/21-065r2/21-065r2.html OGC CQL - Comparison Operators}
 */
export const gte = createComparisonCondition("gte");

/**
 * Creates a between condition that checks if a value is within a range (inclusive)
 * @example
 * between("age", 18, 65) // age BETWEEN 18 AND 65
 * @see {@link https://docs.ogc.org/is/21-065r2/21-065r2.html OGC CQL - Comparison Operators}
 */
export const between = (
  attr: string,
  lower: unknown,
  upper: unknown,
): Condition => ({
  type: "between",
  attr,
  value: [lower, upper],
});

/**
 * Creates a condition that checks if a property is NULL
 * @example
 * isNull("deletedAt") // deletedAt IS NULL
 * @see {@link https://docs.ogc.org/is/21-065r2/21-065r2.html OGC CQL - Comparison Operators}
 */
export const isNull = (attr: string): Condition => ({
  type: "eq",
  attr,
  value: null,
});

/**
 * Creates a condition that checks if a property is NOT NULL
 * @example
 * isNotNull("email") // email IS NOT NULL
 * @see {@link https://docs.ogc.org/is/21-065r2/21-065r2.html OGC CQL - Comparison Operators}
 */
export const isNotNull = (attr: string): Condition => ({
  type: "ne",
  attr,
  value: null,
});
