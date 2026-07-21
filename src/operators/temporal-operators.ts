import { InvalidConditionError } from "../errors";
import type { Condition } from "./base-types";

/**
 * Temporal operator types as specified in OGC CQL2 spec
 * Simple CQL: anyinteracts
 * Enhanced Temporal Operators: after, before, begins, begunby, tcontains, during,
 *                              endedby, ends, tequals, meets, metby, toverlaps,
 *                              overlappedby, intersects
 */
export type TemporalOperator =
  | "anyinteracts" // Simple CQL
  | "after"
  | "before"
  | "begins"
  | "begunby"
  | "tcontains"
  | "during"
  | "endedby"
  | "ends"
  | "tequals"
  | "meets"
  | "metby"
  | "toverlaps"
  | "overlappedby"
  | "tintersects";

/**
 * Temporal value types that can be used in temporal operators
 * Supports ISO 8601 strings, Date objects, or temporal intervals
 */
export type TemporalValue =
  | string // ISO 8601 date/time string
  | Date
  | { start: string | Date; end: string | Date }; // Interval

/**
 * Creates a condition where the temporal property has any interaction with the given temporal value.
 * Part of Simple CQL conformance class.
 *
 * @param attr - The temporal property name
 * @param value - The temporal value (date, datetime, or interval)
 * @returns A condition object representing the ANYINTERACTS operation
 *
 * @example
 * anyinteracts('eventDate', '2023-01-01')
 * // Returns: ANYINTERACTS(eventDate, TIMESTAMP('2023-01-01'))
 *
 * @example
 * anyinteracts('eventDate', { start: '2023-01-01', end: '2023-12-31' })
 * // Returns: ANYINTERACTS(eventDate, INTERVAL('2023-01-01', '2023-12-31'))
 */

function createTemporalOperator(type: TemporalOperator, opName: string) {
  return <_T>(attr: string, value: TemporalValue): Condition => {
    if (!attr) {
      throw new InvalidConditionError(type, { type, attr }, "attr");
    }
    return {
      type,
      attr,
      value,
      toCQL: (ctx) => `${opName}(${attr}, ${ctx.formatTemporalValue(value)})`,
    };
  };
}

/**
 * Creates a condition where the temporal property has any interaction with the given temporal value.
 * Part of Simple CQL conformance class.
 *
 * @param attr - The temporal property name
 * @param value - The temporal value (date, datetime, or interval)
 * @returns A condition object representing the ANYINTERACTS operation
 *
 * @example
 * anyinteracts('eventDate', '2023-01-01')
 * // Returns: ANYINTERACTS(eventDate, TIMESTAMP('2023-01-01'))
 *
 * @example
 * anyinteracts('eventDate', { start: '2023-01-01', end: '2023-12-31' })
 * // Returns: ANYINTERACTS(eventDate, INTERVAL('2023-01-01', '2023-12-31'))
 */
export const anyinteracts = createTemporalOperator(
  "anyinteracts",
  "ANYINTERACTS",
);

/**
 * Creates a condition where the temporal property occurs after the given temporal value.
 *
 * @param attr - The temporal property name
 * @param value - The temporal value (date, datetime, or interval)
 * @returns A condition object representing the AFTER operation
 *
 * @example
 * after('eventDate', '2023-01-01')
 * // Returns: AFTER(eventDate, TIMESTAMP('2023-01-01'))
 */
export const after = createTemporalOperator("after", "AFTER");

/**
 * Creates a condition where the temporal property occurs before the given temporal value.
 *
 * @param attr - The temporal property name
 * @param value - The temporal value (date, datetime, or interval)
 * @returns A condition object representing the BEFORE operation
 *
 * @example
 * before('eventDate', '2023-12-31')
 * // Returns: BEFORE(eventDate, TIMESTAMP('2023-12-31'))
 */
export const before = createTemporalOperator("before", "BEFORE");

/**
 * Creates a condition where the temporal interval property begins at the same instant
 * as the given temporal value.
 *
 * @param attr - The temporal property name (must be an interval)
 * @param value - The temporal value (date, datetime, or interval)
 * @returns A condition object representing the BEGINS operation
 *
 * @example
 * begins('eventPeriod', '2023-01-01')
 * // Returns: BEGINS(eventPeriod, TIMESTAMP('2023-01-01'))
 */
export const begins = createTemporalOperator("begins", "BEGINS");

/**
 * Creates a condition where the temporal interval property is begun by the given temporal value.
 *
 * @param attr - The temporal property name (must be an interval)
 * @param value - The temporal value (date, datetime, or interval)
 * @returns A condition object representing the BEGUNBY operation
 *
 * @example
 * begunby('eventPeriod', '2023-01-01')
 * // Returns: BEGUNBY(eventPeriod, TIMESTAMP('2023-01-01'))
 */
export const begunby = createTemporalOperator("begunby", "BEGUNBY");

/**
 * Creates a condition where the temporal interval property contains the given temporal value.
 *
 * @param attr - The temporal property name (must be an interval)
 * @param value - The temporal value (date, datetime, or interval)
 * @returns A condition object representing the TCONTAINS operation
 *
 * @example
 * tcontains('eventPeriod', '2023-06-15')
 * // Returns: TCONTAINS(eventPeriod, TIMESTAMP('2023-06-15'))
 */
export const tcontains = createTemporalOperator("tcontains", "TCONTAINS");

/**
 * Creates a condition where the temporal property occurs during the given temporal interval.
 *
 * @param attr - The temporal property name
 * @param value - The temporal interval
 * @returns A condition object representing the DURING operation
 *
 * @example
 * during('eventDate', { start: '2023-01-01', end: '2023-12-31' })
 * // Returns: DURING(eventDate, INTERVAL('2023-01-01', '2023-12-31'))
 */
export const during = createTemporalOperator("during", "DURING");

/**
 * Creates a condition where the temporal interval property is ended by the given temporal value.
 *
 * @param attr - The temporal property name (must be an interval)
 * @param value - The temporal value (date, datetime, or interval)
 * @returns A condition object representing the ENDEDBY operation
 *
 * @example
 * endedby('eventPeriod', '2023-12-31')
 * // Returns: ENDEDBY(eventPeriod, TIMESTAMP('2023-12-31'))
 */
export const endedby = createTemporalOperator("endedby", "ENDEDBY");

/**
 * Creates a condition where the temporal interval property ends at the same instant
 * as the given temporal value.
 *
 * @param attr - The temporal property name (must be an interval)
 * @param value - The temporal value (date, datetime, or interval)
 * @returns A condition object representing the ENDS operation
 *
 * @example
 * ends('eventPeriod', '2023-12-31')
 * // Returns: ENDS(eventPeriod, TIMESTAMP('2023-12-31'))
 */
export const ends = createTemporalOperator("ends", "ENDS");

/**
 * Creates a condition where the temporal property is equal to the given temporal value.
 *
 * @param attr - The temporal property name
 * @param value - The temporal value (date, datetime, or interval)
 * @returns A condition object representing the TEQUALS operation
 *
 * @example
 * tequals('eventDate', '2023-01-01')
 * // Returns: TEQUALS(eventDate, TIMESTAMP('2023-01-01'))
 */
export const tequals = createTemporalOperator("tequals", "TEQUALS");

/**
 * Creates a condition where the temporal interval property meets the given temporal value.
 * The end of the first interval equals the start of the second.
 *
 * @param attr - The temporal property name (must be an interval)
 * @param value - The temporal value (date, datetime, or interval)
 * @returns A condition object representing the MEETS operation
 *
 * @example
 * meets('eventPeriod', { start: '2023-07-01', end: '2023-12-31' })
 * // Returns: MEETS(eventPeriod, INTERVAL('2023-07-01', '2023-12-31'))
 */
export const meets = createTemporalOperator("meets", "MEETS");

/**
 * Creates a condition where the temporal interval property is met by the given temporal value.
 * The start of the first interval equals the end of the second.
 *
 * @param attr - The temporal property name (must be an interval)
 * @param value - The temporal value (date, datetime, or interval)
 * @returns A condition object representing the METBY operation
 *
 * @example
 * metby('eventPeriod', { start: '2022-07-01', end: '2023-01-01' })
 * // Returns: METBY(eventPeriod, INTERVAL('2022-07-01', '2023-01-01'))
 */
export const metby = createTemporalOperator("metby", "METBY");

/**
 * Creates a condition where the temporal interval property overlaps the given temporal interval.
 *
 * @param attr - The temporal property name (must be an interval)
 * @param value - The temporal interval
 * @returns A condition object representing the TOVERLAPS operation
 *
 * @example
 * toverlaps('eventPeriod', { start: '2023-06-01', end: '2023-12-31' })
 * // Returns: TOVERLAPS(eventPeriod, INTERVAL('2023-06-01', '2023-12-31'))
 */
export const toverlaps = createTemporalOperator("toverlaps", "TOVERLAPS");

/**
 * Creates a condition where the temporal interval property is overlapped by the given temporal interval.
 *
 * @param attr - The temporal property name (must be an interval)
 * @param value - The temporal interval
 * @returns A condition object representing the OVERLAPPEDBY operation
 *
 * @example
 * overlappedby('eventPeriod', { start: '2022-06-01', end: '2023-06-30' })
 * // Returns: OVERLAPPEDBY(eventPeriod, INTERVAL('2022-06-01', '2023-06-30'))
 */
export const overlappedby = createTemporalOperator(
  "overlappedby",
  "OVERLAPPEDBY",
);

/**
 * Creates a condition where the temporal property intersects with the given temporal value.
 * Note: This is TINTERSECTS to distinguish from spatial INTERSECTS.
 *
 * @param attr - The temporal property name
 * @param value - The temporal value (date, datetime, or interval)
 * @returns A condition object representing the TINTERSECTS operation
 *
 * @example
 * tintersects('eventDate', { start: '2023-01-01', end: '2023-12-31' })
 * // Returns: TINTERSECTS(eventDate, INTERVAL('2023-01-01', '2023-12-31'))
 */
export const tintersects = createTemporalOperator("tintersects", "TINTERSECTS");
