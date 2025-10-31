import type { Geometry } from "geojson";
// @ts-ignore - ignore resolution issues with JSTS module
import GeoJSONReader from "jsts/org/locationtech/jts/io/GeoJSONReader.js";
import WKTWriter from "jsts/org/locationtech/jts/io/WKTWriter.js";
import {
  InvalidConditionError,
  SpatialOperationError,
  UnsupportedConditionTypeError,
} from "./errors";
import type { Condition, ConditionOperator } from "./operators/base-types";
import {
  between,
  eq,
  gt,
  gte,
  isNotNull,
  isNull,
  lt,
  lte,
  ne,
} from "./operators/comparison-operators";
import { and, not, or } from "./operators/logical-operators";
import {
  disjoint,
  intersects,
  spatialContains,
  within,
} from "./operators/spatial-operators";
import { contains, like } from "./operators/text-operators";

// Create instances of JSTS readers and writers
// @ts-expect-error
const geoJsonReader = new GeoJSONReader();
// @ts-expect-error
const wktWriter = new WKTWriter();

/**
 * Interface for QueryBuilder implementation
 */
export interface QueryBuilderInterface<T, R> {
  filter(condition: Condition): QueryBuilderInterface<T, R>;
  clone(): QueryBuilderInterface<T, R>;
  toCQL(): string;
  toCQLUrlSafe(): string;
}

/**
 * Configuration options for OGC CQL query operations.
 */
export interface QueryOptions {
  /** Filter condition for the query */
  filter?: Condition;
}

/**
 * Builder for creating OGC CQL query operations.
 * This class helps build CQL-compliant queries with a fluent interface.
 *
 * @example
 * ```typescript
 * // Simple query
 * const result = await new QueryBuilder()
 *   .filter(eq('userId', '123'))
 *   .toCQL();
 *
 * // Complex query with filtering
 * const result = await new QueryBuilder()
 *   .filter(and(eq('status', 'ACTIVE'), like('name', 'John')))
 *   .toCQL();
 * ```
 *
 * @typeParam T - The type of items being queried
 */
export class QueryBuilder<T extends Record<string, unknown>>
  implements QueryBuilderInterface<T, unknown>
{
  protected options: QueryOptions = {};
  protected selectedFields: Set<string> = new Set();
  protected executor: unknown;

  // Helper for testing
  _getOptions(): QueryOptions {
    return this.options;
  }

  constructor(executor?: unknown) {
    this.executor = executor;
  }

  /**
   * Sets the filter condition for the query.
   * This method allows you to specify complex filter criteria using the condition helpers.
   *
   * @example
   * ```typescript
   * // Simple filter
   * qb.filter(eq("status", "ACTIVE"));
   *
   * // Complex filter
   * qb.filter(and(eq("status", "ACTIVE"), eq("active", true)));
   * ```
   *
   * @param condition The condition to filter by
   * @returns The builder instance for method chaining
   */
  filter(
    condition: Condition | ((op: ConditionOperator<T>) => Condition),
  ): QueryBuilder<T> {
    if (typeof condition === "function") {
      const conditionOperator: ConditionOperator<T> = {
        eq,
        ne,
        lt,
        lte,
        gt,
        gte,
        between,
        contains,
        and,
        or,
        not,
        intersects,
        disjoint,
        isNotNull,
        isNull,
        like,
        spatialContains,
        within,
      };
      this.options.filter = condition(conditionOperator);
    } else {
      this.options.filter = condition;
    }
    return this;
  }

  /**
   * Creates a deep clone of this QueryBuilder instance.
   *
   * @example
   * ```typescript
   * // Create a base query
   * const baseQuery = new QueryBuilder()
   *   .filter(eq("type", "product"));
   *
   * // Clone for active products
   * const activeProducts = baseQuery.clone()
   *   .filter(and(eq("type", "product"), eq("status", "ACTIVE")));
   * ```
   *
   * @returns A new QueryBuilder instance with the same configuration
   */
  clone(): QueryBuilder<T> {
    const clone = new QueryBuilder<T>(this.executor);
    clone.options = { ...this.options };
    clone.selectedFields = new Set(this.selectedFields);
    return clone;
  }

  /**
   * Converts the current query to a CQL string representation.
   * This can be useful for debugging or sending the query to services that accept CQL.
   *
   * @returns The CQL string representation of the current query
   */
  toCQL(): string {
    return this.conditionToCQL(this.options.filter);
  }

  /**
   * Converts the current query to a URL-safe CQL string representation.
   * This is useful when passing CQL strings in URLs or query parameters.
   *
   * @example
   * ```typescript
   * // Create a URL with a CQL filter
   * const query = new QueryBuilder().filter(eq("name", "John Doe"));
   * const url = `https://api.example.com/data?filter=${query.toCQLUrlSafe()}`;
   * ```
   *
   * @returns The URL-safe encoded CQL string representation of the current query
   */
  toCQLUrlSafe(): string {
    const cqlString = this.toCQL();
    return encodeURIComponent(cqlString);
  }

  /**
   * Helper method to convert a condition to CQL string.
   *
   * @param condition The condition to convert
   * @returns The CQL string representation of the condition
   * @throws InvalidConditionError if the condition is missing required attributes
   * @throws UnsupportedConditionTypeError if the condition type is not supported
   * @throws SpatialOperationError if there's an issue with a spatial operation
   */
  private conditionToCQL(condition?: Condition): string {
    if (!condition) {
      return "";
    }

    switch (condition.type) {
      case "eq":
        if (condition.geometry) {
          return `EQUALS(${condition.attr}, ${JSON.stringify(condition.geometry)})`;
        }
        if (!condition.attr) {
          throw new InvalidConditionError("eq", condition, "attr");
        }
        return `${condition.attr} = ${this.formatValue(condition.value)}`;
      case "ne":
        if (!condition.attr) {
          throw new InvalidConditionError("ne", condition, "attr");
        }
        return `${condition.attr} <> ${this.formatValue(condition.value)}`;
      case "lt":
        if (!condition.attr) {
          throw new InvalidConditionError("lt", condition, "attr");
        }
        return `${condition.attr} < ${this.formatValue(condition.value)}`;
      case "lte":
        if (!condition.attr) {
          throw new InvalidConditionError("lte", condition, "attr");
        }
        return `${condition.attr} <= ${this.formatValue(condition.value)}`;
      case "gt":
        if (!condition.attr) {
          throw new InvalidConditionError("gt", condition, "attr");
        }
        return `${condition.attr} > ${this.formatValue(condition.value)}`;
      case "gte":
        if (!condition.attr) {
          throw new InvalidConditionError("gte", condition, "attr");
        }
        return `${condition.attr} >= ${this.formatValue(condition.value)}`;
      case "between": {
        if (!condition.attr) {
          throw new InvalidConditionError("between", condition, "attr");
        }
        if (
          !condition.value ||
          !Array.isArray(condition.value) ||
          condition.value.length !== 2
        ) {
          throw new InvalidConditionError(
            "between",
            condition,
            "value (array with 2 elements)",
          );
        }
        const [lower, upper] = condition.value as [unknown, unknown];
        return `${condition.attr} BETWEEN ${this.formatValue(lower)} AND ${this.formatValue(upper)}`;
      }
      case "like":
        if (!condition.attr) {
          throw new InvalidConditionError("like", condition, "attr");
        }
        return `${condition.attr} LIKE ${this.formatValue(condition.value)}`;
      case "contains":
        // Handle both text contains and spatial contains based on presence of geometry
        if (condition.geometry) {
          if (!condition.attr) {
            throw new InvalidConditionError(
              "contains (spatial)",
              condition,
              "attr",
            );
          }
          return this.formatSpatialQuery(
            "CONTAINS",
            condition.attr,
            condition.geometry,
          );
        }
        // Text contains if no geometry provided
        if (!condition.attr) {
          throw new InvalidConditionError("contains (text)", condition, "attr");
        }
        if (condition.value === undefined) {
          throw new InvalidConditionError(
            "contains (text)",
            condition,
            "value",
          );
        }
        return `${condition.attr} LIKE ${this.formatValue(`%${condition.value}%`)}`;
      case "intersects":
        if (!condition.geometry) {
          throw new InvalidConditionError("intersects", condition, "geometry");
        }
        if (!condition.attr) {
          throw new InvalidConditionError("intersects", condition, "attr");
        }
        return this.formatSpatialQuery(
          "INTERSECTS",
          condition.attr,
          condition.geometry,
        );
      case "disjoint":
        if (!condition.geometry) {
          throw new InvalidConditionError("disjoint", condition, "geometry");
        }
        if (!condition.attr) {
          throw new InvalidConditionError("disjoint", condition, "attr");
        }
        return this.formatSpatialQuery(
          "DISJOINT",
          condition.attr,
          condition.geometry,
        );
      case "within":
        if (!condition.geometry) {
          throw new InvalidConditionError("within", condition, "geometry");
        }
        if (!condition.attr) {
          throw new InvalidConditionError("within", condition, "attr");
        }
        return this.formatSpatialQuery(
          "WITHIN",
          condition.attr,
          condition.geometry,
        );
      case "touches":
        if (!condition.geometry) {
          throw new InvalidConditionError("touches", condition, "geometry");
        }
        if (!condition.attr) {
          throw new InvalidConditionError("touches", condition, "attr");
        }
        return this.formatSpatialQuery(
          "TOUCHES",
          condition.attr,
          condition.geometry,
        );
      case "overlaps":
        if (!condition.geometry) {
          throw new InvalidConditionError("overlaps", condition, "geometry");
        }
        if (!condition.attr) {
          throw new InvalidConditionError("overlaps", condition, "attr");
        }
        return this.formatSpatialQuery(
          "OVERLAPS",
          condition.attr,
          condition.geometry,
        );
      case "crosses":
        if (!condition.geometry) {
          throw new InvalidConditionError("crosses", condition, "geometry");
        }
        if (!condition.attr) {
          throw new InvalidConditionError("crosses", condition, "attr");
        }
        return this.formatSpatialQuery(
          "CROSSES",
          condition.attr,
          condition.geometry,
        );
      case "and":
        if (
          !condition.conditions ||
          !Array.isArray(condition.conditions) ||
          condition.conditions.length === 0
        ) {
          throw new InvalidConditionError(
            "and",
            condition,
            "conditions (non-empty array)",
          );
        }
        return `(${condition.conditions.map((c) => this.conditionToCQL(c)).join(" AND ")})`;
      case "or":
        if (
          !condition.conditions ||
          !Array.isArray(condition.conditions) ||
          condition.conditions.length === 0
        ) {
          throw new InvalidConditionError(
            "or",
            condition,
            "conditions (non-empty array)",
          );
        }
        return `(${condition.conditions.map((c) => this.conditionToCQL(c)).join(" OR ")})`;
      case "not":
        if (!condition.condition) {
          throw new InvalidConditionError("not", condition, "condition");
        }
        return `NOT (${this.conditionToCQL(condition.condition)})`;
      default:
        throw new UnsupportedConditionTypeError(
          (condition as Condition).type || "unknown",
          condition,
        );
    }
  }

  /**
   * Helper method to format values for CQL strings.
   *
   * @param value The value to format
   * @returns The formatted value
   */
  private formatValue(value: unknown): string {
    if (value === null || value === undefined) {
      return "NULL";
    }
    if (typeof value === "string") {
      return `'${value.replace(/'/g, "\\'")}'`;
    }
    if (typeof value === "boolean") {
      return value ? "TRUE" : "FALSE";
    }
    if (value instanceof Date) {
      return `TIMESTAMP('${value.toISOString()}')`;
    }
    return String(value);
  }

  /**
   * Helper method to format spatial queries consistently.
   * Converts GeoJSON to Well-Known Text (WKT) format for CQL.
   *
   * @param operator The spatial operator (e.g., "INTERSECTS", "WITHIN")
   * @param attribute The attribute/field name to apply the operator to
   * @param geometry The GeoJSON geometry to be converted to WKT
   * @returns The formatted spatial query string
   * @throws SpatialOperationError if there's an issue with the spatial operation
   */
  private formatSpatialQuery(
    operator: string,
    attribute: string,
    geometry: Geometry,
  ): string {
    try {
      const geo = geoJsonReader.read(geometry);
      const wkt = wktWriter.write(geo);
      return `${operator}(${attribute}, ${wkt})`;
    } catch (error) {
      throw new SpatialOperationError(
        operator,
        error instanceof Error ? error.message : String(error),
      );
    }
  }
}

/**
 * Factory function that creates a new QueryBuilder instance without requiring the `new` keyword.
 * This provides a more convenient and fluent API for creating queries.
 *
 * @example
 * ```typescript
 * // Without new keyword
 * const query = queryBuilder()
 *   .filter(eq('status', 'ACTIVE'))
 *   .toCQL();
 *
 * // With executor
 * const query = queryBuilder(customExecutor)
 *   .filter(eq('userId', '123'))
 *   .toCQL();
 * ```
 *
 * @typeParam T - The type of items being queried (defaults to generic Record)
 * @param executor Optional executor for the query builder
 * @returns A new QueryBuilder instance
 */
export function queryBuilder<
  T extends Record<string, unknown> = Record<string, unknown>,
>(executor?: unknown): QueryBuilder<T> {
  return new QueryBuilder<T>(executor);
}
