import type { Condition } from "./operators/base-types";
import jsts from "jsts";

const geoJsonReader = new jsts.io.GeoJSONReader();
const wktWriter = new jsts.io.WKTWriter();

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
 *   .filter(and(eq('status', 'ACTIVE'), beginsWith('name', 'John')))
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
  filter(condition: Condition): QueryBuilder<T> {
    this.options.filter = condition;
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
        return `${condition.attr} = ${this.formatValue(condition.value)}`;
      case "ne":
        return `${condition.attr} <> ${this.formatValue(condition.value)}`;
      case "lt":
        return `${condition.attr} < ${this.formatValue(condition.value)}`;
      case "lte":
        return `${condition.attr} <= ${this.formatValue(condition.value)}`;
      case "gt":
        return `${condition.attr} > ${this.formatValue(condition.value)}`;
      case "gte":
        return `${condition.attr} >= ${this.formatValue(condition.value)}`;
      case "between": {
        const [lower, upper] = condition.value as [unknown, unknown];
        return `${condition.attr} BETWEEN ${this.formatValue(lower)} AND ${this.formatValue(upper)}`;
      }
      case "like":
        return `${condition.attr} LIKE ${this.formatValue(condition.value)}`;
      case "contains":
        // Handle both text contains and spatial contains based on presence of geometry
        if (condition.geometry) {
          return `CONTAINS(${condition.attr}, ${JSON.stringify(condition.geometry)})`;
        }
        // Text contains if no geometry provided
        return `${condition.attr} LIKE ${this.formatValue(`%${condition.value}%`)}`;
      case "intersects": {
        const geo = geoJsonReader.read(condition.geometry!);
        const wkt = wktWriter.write(geo);
        return `INTERSECTS(${condition.attr}, ${wkt})`;
      }
      case "disjoint":
        return `DISJOINT(${condition.attr}, ${JSON.stringify(condition.geometry)})`;
      case "within":
        return `WITHIN(${condition.attr}, ${JSON.stringify(condition.geometry)})`;
      case "touches":
        return `TOUCHES(${condition.attr}, ${JSON.stringify(condition.geometry)})`;
      case "overlaps":
        return `OVERLAPS(${condition.attr}, ${JSON.stringify(condition.geometry)})`;
      case "crosses":
        return `CROSSES(${condition.attr}, ${JSON.stringify(condition.geometry)})`;
      case "and":
        return condition.conditions && condition.conditions.length > 0
          ? `(${condition.conditions.map((c) => this.conditionToCQL(c)).join(" AND ")})`
          : "";
      case "or":
        return condition.conditions && condition.conditions.length > 0
          ? `(${condition.conditions.map((c) => this.conditionToCQL(c)).join(" OR ")})`
          : "";
      case "not":
        return condition.condition
          ? `NOT (${this.conditionToCQL(condition.condition)})`
          : "";
      default:
        return "";
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
      return `TIMESTAMP('${value.toISOString()}')}`;
    }
    return String(value);
  }
}
