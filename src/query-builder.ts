import { createCQLContext } from "./cql-context";
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
import {
  after,
  anyinteracts,
  before,
  begins,
  begunby,
  during,
  endedby,
  ends,
  meets,
  metby,
  overlappedby,
  tcontains,
  tequals,
  tintersects,
  toverlaps,
} from "./operators/temporal-operators";
import { contains, like } from "./operators/text-operators";

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
  private cqlContext = createCQLContext();

  // Helper for testing
  _getOptions(): QueryOptions {
    return this.options;
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
        // Temporal operators
        anyinteracts,
        after,
        before,
        begins,
        begunby,
        tcontains,
        during,
        endedby,
        ends,
        tequals,
        meets,
        metby,
        toverlaps,
        overlappedby,
        tintersects,
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
    const clone = new QueryBuilder<T>();
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
   * Delegates to the condition's self-serialization method.
   *
   * @param condition The condition to convert
   * @returns The CQL string representation of the condition
   */
  private conditionToCQL(condition?: Condition): string {
    if (!condition) {
      return "";
    }
    return condition.toCQL(this.cqlContext);
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
 * // Complex queries with method chaining
 * const query = queryBuilder()
 *   .filter(and(eq('status', 'ACTIVE'), gt('age', 18)))
 *   .toCQL();
 * ```
 *
 * @typeParam T - The type of items being queried (defaults to generic Record)
 * @returns A new QueryBuilder instance
 */
export function queryBuilder<
  T extends Record<string, unknown> = Record<string, unknown>,
>(): QueryBuilder<T> {
  return new QueryBuilder<T>();
}
