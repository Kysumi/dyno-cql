import type { Geometry } from "geojson";
import type { Path, PathType } from "./path-type";
import type { TemporalOperator, TemporalValue } from "./temporal-operators";

/**
 * Supported comparison operators for OGC CQL conditions.
 * @see {@link https://docs.ogc.org/is/21-065r2/21-065r2.html OGC CQL - Comparison Operator Reference}
 */
export type ComparisonOperator =
  | "eq"
  | "ne"
  | "lt"
  | "lte"
  | "gt"
  | "gte"
  | "between";

/**
 * Logical operators for combining multiple conditions.
 * @see {@link https://docs.ogc.org/is/21-065r2/21-065r2.html OGC CQL - Logical Operator Reference}
 */
export type LogicalOperator = "and" | "or" | "not";

/**
 * Spatial operators for geospatial filtering in CQL.
 * @see {@link https://docs.ogc.org/is/21-065r2/21-065r2.html OGC CQL - Spatial Operator Reference}
 */
export type SpatialOperator =
  | "intersects"
  | "disjoint"
  | "contains"
  | "within"
  | "touches"
  | "overlaps"
  | "crosses";

/**
 * Text operators for string manipulation and comparison.
 * @see {@link https://docs.ogc.org/is/21-065r2/21-065r2.html OGC CQL - Text Operator Reference}
 */
export type TextOperator = "like" | "contains";

/**
 * Context object providing formatting utilities for CQL serialization.
 */
export interface CQLContext {
  formatValue: (value: unknown) => string;
  formatTemporalValue: (value: TemporalValue) => string;
  formatSpatialQuery: (
    operator: string,
    attr: string,
    geometry: Geometry,
  ) => string;
}

/**
 * Represents an OGC CQL condition expression.
 * Conditions are self-serializing objects that know how to convert themselves to CQL strings.
 */
export interface Condition {
  /** The type of condition (comparison, logical, spatial, temporal, or text operator) */
  type:
    | ComparisonOperator
    | LogicalOperator
    | SpatialOperator
    | TemporalOperator
    | TextOperator;
  /** The attribute name for comparison conditions */
  attr?: string;
  /** The value to compare against for comparison conditions */
  value?: unknown;
  /** Array of conditions for logical operators (and/or) */
  conditions?: Condition[];
  /** Single condition for the 'not' operator */
  condition?: Condition;
  /** Geometry for spatial operators */
  geometry?: Geometry;
  /** Self-serialization method that converts this condition to a CQL string */
  toCQL: (context: CQLContext) => string;
}

/**
 * Type-safe operators for building CQL filter conditions.
 * Includes all available CQL filter operators with proper type inference.
 * @see {@link https://docs.ogc.org/is/21-065r2/21-065r2.html OGC CQL - Condition Expressions}
 */
export type ConditionOperator<T extends Record<string, unknown>> = {
  eq: <K extends Path<T>>(attr: K, value: PathType<T, K>) => Condition;
  ne: <K extends Path<T>>(attr: K, value: PathType<T, K>) => Condition;
  lt: <K extends Path<T>>(attr: K, value: PathType<T, K>) => Condition;
  lte: <K extends Path<T>>(attr: K, value: PathType<T, K>) => Condition;
  gt: <K extends Path<T>>(attr: K, value: PathType<T, K>) => Condition;
  gte: <K extends Path<T>>(attr: K, value: PathType<T, K>) => Condition;
  between: <K extends Path<T>>(
    attr: K,
    lower: PathType<T, K>,
    upper: PathType<T, K>,
  ) => Condition;
  contains: <K extends Path<T>>(attr: K, value: string) => Condition;
  like: <K extends Path<T>>(attr: K, value: string) => Condition;
  isNull: <K extends Path<T>>(attr: K) => Condition;
  isNotNull: <K extends Path<T>>(attr: K) => Condition;
  intersects: <K extends Path<T>>(attr: K, geometry: Geometry) => Condition;
  disjoint: <K extends Path<T>>(attr: K, geometry: Geometry) => Condition;
  spatialContains: <K extends Path<T>>(
    attr: K,
    geometry: Geometry,
  ) => Condition;
  within: <K extends Path<T>>(attr: K, geometry: Geometry) => Condition;
  // Temporal operators
  anyinteracts: <K extends Path<T>>(attr: K, value: TemporalValue) => Condition;
  after: <K extends Path<T>>(attr: K, value: TemporalValue) => Condition;
  before: <K extends Path<T>>(attr: K, value: TemporalValue) => Condition;
  begins: <K extends Path<T>>(attr: K, value: TemporalValue) => Condition;
  begunby: <K extends Path<T>>(attr: K, value: TemporalValue) => Condition;
  tcontains: <K extends Path<T>>(attr: K, value: TemporalValue) => Condition;
  during: <K extends Path<T>>(attr: K, value: TemporalValue) => Condition;
  endedby: <K extends Path<T>>(attr: K, value: TemporalValue) => Condition;
  ends: <K extends Path<T>>(attr: K, value: TemporalValue) => Condition;
  tequals: <K extends Path<T>>(attr: K, value: TemporalValue) => Condition;
  meets: <K extends Path<T>>(attr: K, value: TemporalValue) => Condition;
  metby: <K extends Path<T>>(attr: K, value: TemporalValue) => Condition;
  toverlaps: <K extends Path<T>>(attr: K, value: TemporalValue) => Condition;
  overlappedby: <K extends Path<T>>(attr: K, value: TemporalValue) => Condition;
  tintersects: <K extends Path<T>>(attr: K, value: TemporalValue) => Condition;
  // Logical operators
  and: (...conditions: Condition[]) => Condition;
  or: (...conditions: Condition[]) => Condition;
  not: (condition: Condition) => Condition;
};
