import { InvalidConditionError } from "../errors";
import type { Condition } from "./base-types";

/**
 * Creates an equals (=) condition
 * @example
 * eq("status", "ACTIVE") // status = "ACTIVE"
 * @see {@link https://docs.ogc.org/is/21-065r2/21-065r2.html OGC CQL - Comparison Operators}
 */
export const eq = (attr: string, value: unknown): Condition => ({
  type: "eq",
  attr,
  value,
  toCQL: (ctx) => {
    if (!attr) {
      throw new InvalidConditionError(
        "eq",
        { type: "eq", attr, value },
        "attr",
      );
    }
    return `${attr} = ${ctx.formatValue(value)}`;
  },
});

/**
 * Creates a not equals (!=) condition
 * @example
 * ne("status", "DELETED") // status <> "DELETED"
 * @see {@link https://docs.ogc.org/is/21-065r2/21-065r2.html OGC CQL - Comparison Operators}
 */
export const ne = (attr: string, value: unknown): Condition => ({
  type: "ne",
  attr,
  value,
  toCQL: (ctx) => {
    if (!attr) {
      throw new InvalidConditionError(
        "ne",
        { type: "ne", attr, value },
        "attr",
      );
    }
    return `${attr} <> ${ctx.formatValue(value)}`;
  },
});

/**
 * Creates a less than (<) condition
 * @example
 * lt("age", 18) // age < 18
 * @see {@link https://docs.ogc.org/is/21-065r2/21-065r2.html OGC CQL - Comparison Operators}
 */
export const lt = (attr: string, value: unknown): Condition => ({
  type: "lt",
  attr,
  value,
  toCQL: (ctx) => {
    if (!attr) {
      throw new InvalidConditionError(
        "lt",
        { type: "lt", attr, value },
        "attr",
      );
    }
    return `${attr} < ${ctx.formatValue(value)}`;
  },
});

/**
 * Creates a less than or equal to (<=) condition
 * @example
 * lte("age", 18) // age <= 18
 * @see {@link https://docs.ogc.org/is/21-065r2/21-065r2.html OGC CQL - Comparison Operators}
 */
export const lte = (attr: string, value: unknown): Condition => ({
  type: "lte",
  attr,
  value,
  toCQL: (ctx) => {
    if (!attr) {
      throw new InvalidConditionError(
        "lte",
        { type: "lte", attr, value },
        "attr",
      );
    }
    return `${attr} <= ${ctx.formatValue(value)}`;
  },
});

/**
 * Creates a greater than (>) condition
 * @example
 * gt("price", 100) // price > 100
 * @see {@link https://docs.ogc.org/is/21-065r2/21-065r2.html OGC CQL - Comparison Operators}
 */
export const gt = (attr: string, value: unknown): Condition => ({
  type: "gt",
  attr,
  value,
  toCQL: (ctx) => {
    if (!attr) {
      throw new InvalidConditionError(
        "gt",
        { type: "gt", attr, value },
        "attr",
      );
    }
    return `${attr} > ${ctx.formatValue(value)}`;
  },
});

/**
 * Creates a greater than or equal to (>=) condition
 * @example
 * gte("price", 100) // price >= 100
 * @see {@link https://docs.ogc.org/is/21-065r2/21-065r2.html OGC CQL - Comparison Operators}
 */
export const gte = (attr: string, value: unknown): Condition => ({
  type: "gte",
  attr,
  value,
  toCQL: (ctx) => {
    if (!attr) {
      throw new InvalidConditionError(
        "gte",
        { type: "gte", attr, value },
        "attr",
      );
    }
    return `${attr} >= ${ctx.formatValue(value)}`;
  },
});

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
  toCQL: (ctx) => {
    if (!attr) {
      throw new InvalidConditionError(
        "between",
        { type: "between", attr },
        "attr",
      );
    }
    return `${attr} BETWEEN ${ctx.formatValue(lower)} AND ${ctx.formatValue(upper)}`;
  },
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
  toCQL: (ctx) => {
    if (!attr) {
      throw new InvalidConditionError(
        "isNull",
        { type: "eq", attr, value: null },
        "attr",
      );
    }
    return `${attr} IS NULL`;
  },
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
  toCQL: (ctx) => {
    if (!attr) {
      throw new InvalidConditionError(
        "isNotNull",
        { type: "ne", attr, value: null },
        "attr",
      );
    }
    return `${attr} IS NOT NULL`;
  },
});
