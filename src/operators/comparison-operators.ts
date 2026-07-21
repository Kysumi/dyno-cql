import { InvalidConditionError } from "../errors";
import type { ComparisonCondition, Condition } from "./base-types";

function createBinaryComparison(type: ComparisonCondition["type"], op: string) {
  return (attr: string, value: unknown): Condition => {
    if (!attr)
      throw new InvalidConditionError(type, { type, attr, value }, "attr");
    return {
      type,
      attr,
      value,
      toCQL: (ctx) => `${attr} ${op} ${ctx.formatValue(value)}`,
    };
  };
}

function createNullComparison(type: ComparisonCondition["type"], op: string) {
  return (attr: string): Condition => {
    if (!attr)
      throw new InvalidConditionError(
        type,
        { type, attr, value: null },
        "attr",
      );
    return {
      type,
      attr,
      value: null,
      toCQL: () => `${attr} ${op}`,
    };
  };
}

function createInComparison(type: ComparisonCondition["type"], op: string) {
  return (attr: string, values: unknown[]): Condition => {
    if (!attr)
      throw new InvalidConditionError(
        type,
        { type, attr, value: values },
        "attr",
      );
    if (!values || !Array.isArray(values) || values.length === 0) {
      throw new InvalidConditionError(
        type,
        { type, attr, value: values },
        "values",
      );
    }
    return {
      type,
      attr,
      value: values,
      toCQL: (ctx) => {
        const formattedValues = values
          .map((v) => ctx.formatValue(v))
          .join(", ");
        return `${attr} ${op} (${formattedValues})`;
      },
    };
  };
}

function createBetweenComparison() {
  return (attr: string, lower: unknown, upper: unknown): Condition => {
    if (!attr)
      throw new InvalidConditionError(
        "between",
        { type: "between", attr },
        "attr",
      );
    return {
      type: "between",
      attr,
      value: [lower, upper],
      toCQL: (ctx) =>
        `${attr} BETWEEN ${ctx.formatValue(lower)} AND ${ctx.formatValue(upper)}`,
    };
  };
}

/**
 * Creates an equals (=) condition
 * @example
 * eq("status", "ACTIVE") // status = "ACTIVE"
 * @see {@link https://docs.ogc.org/is/21-065r2/21-065r2.html OGC CQL - Comparison Operators}
 */
export const eq = createBinaryComparison("eq", "=");

/**
 * Creates a not equals (!=) condition
 * @example
 * ne("status", "DELETED") // status <> "DELETED"
 * @see {@link https://docs.ogc.org/is/21-065r2/21-065r2.html OGC CQL - Comparison Operators}
 */
export const ne = createBinaryComparison("ne", "<>");

/**
 * Creates a less than (<) condition
 * @example
 * lt("age", 18) // age < 18
 * @see {@link https://docs.ogc.org/is/21-065r2/21-065r2.html OGC CQL - Comparison Operators}
 */
export const lt = createBinaryComparison("lt", "<");

/**
 * Creates a less than or equal to (<=) condition
 * @example
 * lte("age", 18) // age <= 18
 * @see {@link https://docs.ogc.org/is/21-065r2/21-065r2.html OGC CQL - Comparison Operators}
 */
export const lte = createBinaryComparison("lte", "<=");

/**
 * Creates a greater than (>) condition
 * @example
 * gt("price", 100) // price > 100
 * @see {@link https://docs.ogc.org/is/21-065r2/21-065r2.html OGC CQL - Comparison Operators}
 */
export const gt = createBinaryComparison("gt", ">");

/**
 * Creates a greater than or equal to (>=) condition
 * @example
 * gte("price", 100) // price >= 100
 * @see {@link https://docs.ogc.org/is/21-065r2/21-065r2.html OGC CQL - Comparison Operators}
 */
export const gte = createBinaryComparison("gte", ">=");

/**
 * Creates a between condition that checks if a value is within a range (inclusive)
 * @example
 * between("age", 18, 65) // age BETWEEN 18 AND 65
 * @see {@link https://docs.ogc.org/is/21-065r2/21-065r2.html OGC CQL - Comparison Operators}
 */
export const between = createBetweenComparison();

/**
 * Creates a condition that checks if a property is NULL
 * @example
 * isNull("deletedAt") // deletedAt IS NULL
 * @see {@link https://docs.ogc.org/is/21-065r2/21-065r2.html OGC CQL - Comparison Operators}
 */
export const isNull = createNullComparison("eq", "IS NULL");

/**
 * Creates a condition that checks if a property is NOT NULL
 * @example
 * isNotNull("email") // email IS NOT NULL
 * @see {@link https://docs.ogc.org/is/21-065r2/21-065r2.html OGC CQL - Comparison Operators}
 */
export const isNotNull = createNullComparison("ne", "IS NOT NULL");

/**
 * Creates an IN condition checking if an attribute value matches any value in a list
 * @example
 * in_("investigation_type", ["CPT", "OTHER"]) // investigation_type IN ('CPT', 'OTHER')
 * @see {@link https://docs.ogc.org/is/21-065r2/21-065r2.html OGC CQL - Comparison Operators}
 */
const inCondition = createInComparison("in", "IN");
export { inCondition as in };

/**
 * Creates a NOT IN condition checking if an attribute value does not match any value in a list
 * @example
 * notIn("status", ["DELETED", "ARCHIVED"]) // status NOT IN ('DELETED', 'ARCHIVED')
 * @see {@link https://docs.ogc.org/is/21-065r2/21-065r2.html OGC CQL - Comparison Operators}
 */
export const notIn = createInComparison("notIn", "NOT IN");
