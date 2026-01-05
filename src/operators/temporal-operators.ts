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
export function anyinteracts<T>(attr: string, value: TemporalValue): Condition {
  return {
    type: "anyinteracts",
    attr,
    value,
    toCQL: (ctx) => {
      if (!attr) {
        throw new InvalidConditionError(
          "anyinteracts",
          { type: "anyinteracts", attr },
          "attr",
        );
      }
      return `ANYINTERACTS(${attr}, ${ctx.formatTemporalValue(value)})`;
    },
  };
}

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
export function after<T>(attr: string, value: TemporalValue): Condition {
  return {
    type: "after",
    attr,
    value,
    toCQL: (ctx) => {
      if (!attr) {
        throw new InvalidConditionError(
          "after",
          { type: "after", attr },
          "attr",
        );
      }
      return `AFTER(${attr}, ${ctx.formatTemporalValue(value)})`;
    },
  };
}

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
export function before<T>(attr: string, value: TemporalValue): Condition {
  return {
    type: "before",
    attr,
    value,
    toCQL: (ctx) => {
      if (!attr) {
        throw new InvalidConditionError(
          "before",
          { type: "before", attr },
          "attr",
        );
      }
      return `BEFORE(${attr}, ${ctx.formatTemporalValue(value)})`;
    },
  };
}

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
export function begins<T>(attr: string, value: TemporalValue): Condition {
  return {
    type: "begins",
    attr,
    value,
    toCQL: (ctx) => {
      if (!attr) {
        throw new InvalidConditionError(
          "begins",
          { type: "begins", attr },
          "attr",
        );
      }
      return `BEGINS(${attr}, ${ctx.formatTemporalValue(value)})`;
    },
  };
}

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
export function begunby<T>(attr: string, value: TemporalValue): Condition {
  return {
    type: "begunby",
    attr,
    value,
    toCQL: (ctx) => {
      if (!attr) {
        throw new InvalidConditionError(
          "begunby",
          { type: "begunby", attr },
          "attr",
        );
      }
      return `BEGUNBY(${attr}, ${ctx.formatTemporalValue(value)})`;
    },
  };
}

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
export function tcontains<T>(attr: string, value: TemporalValue): Condition {
  return {
    type: "tcontains",
    attr,
    value,
    toCQL: (ctx) => {
      if (!attr) {
        throw new InvalidConditionError(
          "tcontains",
          { type: "tcontains", attr },
          "attr",
        );
      }
      return `TCONTAINS(${attr}, ${ctx.formatTemporalValue(value)})`;
    },
  };
}

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
export function during<T>(attr: string, value: TemporalValue): Condition {
  return {
    type: "during",
    attr,
    value,
    toCQL: (ctx) => {
      if (!attr) {
        throw new InvalidConditionError(
          "during",
          { type: "during", attr },
          "attr",
        );
      }
      return `DURING(${attr}, ${ctx.formatTemporalValue(value)})`;
    },
  };
}

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
export function endedby<T>(attr: string, value: TemporalValue): Condition {
  return {
    type: "endedby",
    attr,
    value,
    toCQL: (ctx) => {
      if (!attr) {
        throw new InvalidConditionError(
          "endedby",
          { type: "endedby", attr },
          "attr",
        );
      }
      return `ENDEDBY(${attr}, ${ctx.formatTemporalValue(value)})`;
    },
  };
}

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
export function ends<T>(attr: string, value: TemporalValue): Condition {
  return {
    type: "ends",
    attr,
    value,
    toCQL: (ctx) => {
      if (!attr) {
        throw new InvalidConditionError("ends", { type: "ends", attr }, "attr");
      }
      return `ENDS(${attr}, ${ctx.formatTemporalValue(value)})`;
    },
  };
}

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
export function tequals<T>(attr: string, value: TemporalValue): Condition {
  return {
    type: "tequals",
    attr,
    value,
    toCQL: (ctx) => {
      if (!attr) {
        throw new InvalidConditionError(
          "tequals",
          { type: "tequals", attr },
          "attr",
        );
      }
      return `TEQUALS(${attr}, ${ctx.formatTemporalValue(value)})`;
    },
  };
}

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
export function meets<T>(attr: string, value: TemporalValue): Condition {
  return {
    type: "meets",
    attr,
    value,
    toCQL: (ctx) => {
      if (!attr) {
        throw new InvalidConditionError(
          "meets",
          { type: "meets", attr },
          "attr",
        );
      }
      return `MEETS(${attr}, ${ctx.formatTemporalValue(value)})`;
    },
  };
}

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
export function metby<T>(attr: string, value: TemporalValue): Condition {
  return {
    type: "metby",
    attr,
    value,
    toCQL: (ctx) => {
      if (!attr) {
        throw new InvalidConditionError(
          "metby",
          { type: "metby", attr },
          "attr",
        );
      }
      return `METBY(${attr}, ${ctx.formatTemporalValue(value)})`;
    },
  };
}

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
export function toverlaps<T>(attr: string, value: TemporalValue): Condition {
  return {
    type: "toverlaps",
    attr,
    value,
    toCQL: (ctx) => {
      if (!attr) {
        throw new InvalidConditionError(
          "toverlaps",
          { type: "toverlaps", attr },
          "attr",
        );
      }
      return `TOVERLAPS(${attr}, ${ctx.formatTemporalValue(value)})`;
    },
  };
}

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
export function overlappedby<T>(attr: string, value: TemporalValue): Condition {
  return {
    type: "overlappedby",
    attr,
    value,
    toCQL: (ctx) => {
      if (!attr) {
        throw new InvalidConditionError(
          "overlappedby",
          { type: "overlappedby", attr },
          "attr",
        );
      }
      return `OVERLAPPEDBY(${attr}, ${ctx.formatTemporalValue(value)})`;
    },
  };
}

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
export function tintersects<T>(attr: string, value: TemporalValue): Condition {
  return {
    type: "tintersects",
    attr,
    value,
    toCQL: (ctx) => {
      if (!attr) {
        throw new InvalidConditionError(
          "tintersects",
          { type: "tintersects", attr },
          "attr",
        );
      }
      return `TINTERSECTS(${attr}, ${ctx.formatTemporalValue(value)})`;
    },
  };
}
