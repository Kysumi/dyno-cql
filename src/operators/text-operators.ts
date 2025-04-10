import type { Condition } from "./base-types";

/**
 * Creates a text condition builder function for the specified operator.
 * @internal
 */
const createTextCondition =
  (type: "like" | "beginsWith" | "contains") =>
  (attr: string, value: unknown): Condition => ({
    type,
    attr,
    value,
  });

/**
 * Creates a LIKE condition with a wildcard pattern
 * @example
 * like("name", "A%") // name LIKE 'A%'
 * @see {@link https://docs.ogc.org/is/21-065r2/21-065r2.html OGC CQL - Text Operators}
 */
export const like = createTextCondition("like");

/**
 * Creates a condition that checks if a string attribute starts with a substring
 * @example
 * beginsWith("email", "info") // email LIKE 'info%'
 * @see {@link https://docs.ogc.org/is/21-065r2/21-065r2.html OGC CQL - Text Operators}
 */
export const beginsWith = createTextCondition("beginsWith");

/**
 * Creates a condition that checks if a string contains a substring
 * @example
 * contains("description", "important") // description LIKE '%important%'
 * @see {@link https://docs.ogc.org/is/21-065r2/21-065r2.html OGC CQL - Text Operators}
 */
export const contains = createTextCondition("contains");
