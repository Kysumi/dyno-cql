import type { Geometry } from "geojson";
// @ts-ignore - ignore resolution issues with JSTS module
import GeoJSONReader from "jsts/org/locationtech/jts/io/GeoJSONReader.js";
import WKTWriter from "jsts/org/locationtech/jts/io/WKTWriter.js";
import { SpatialOperationError } from "./errors";
import type { CQLContext } from "./operators/base-types";
import type { TemporalValue } from "./operators/temporal-operators";

// Create instances of JSTS readers and writers
// @ts-expect-error
const geoJsonReader = new GeoJSONReader();
// @ts-expect-error
const wktWriter = new WKTWriter();

/**
 * Formats a value for use in CQL expressions.
 * Handles null, strings, booleans, dates, and other primitives.
 *
 * @param value The value to format
 * @returns The formatted value as a CQL string
 */
function formatValue(value: unknown): string {
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
 * Formats a temporal value for use in CQL temporal operators.
 * Handles Date objects, ISO 8601 strings, and temporal intervals.
 *
 * @param value The temporal value to format
 * @returns The formatted temporal value as a CQL string
 */
function formatTemporalValue(value: TemporalValue): string {
  if (value instanceof Date) {
    return `TIMESTAMP('${value.toISOString()}')`;
  }
  if (typeof value === "string") {
    return `TIMESTAMP('${value}')`;
  }
  // Handle interval objects
  if (
    typeof value === "object" &&
    value !== null &&
    "start" in value &&
    "end" in value
  ) {
    const start =
      value.start instanceof Date
        ? value.start.toISOString()
        : String(value.start);
    const end =
      value.end instanceof Date ? value.end.toISOString() : String(value.end);
    return `INTERVAL('${start}', '${end}')`;
  }
  return String(value);
}

/**
 * Formats a spatial query by converting GeoJSON to Well-Known Text (WKT) format.
 *
 * @param operator The spatial operator (e.g., "INTERSECTS", "WITHIN")
 * @param attribute The attribute/field name to apply the operator to
 * @param geometry The GeoJSON geometry to be converted to WKT
 * @returns The formatted spatial query string
 * @throws SpatialOperationError if there's an issue with the spatial operation
 */
function formatSpatialQuery(
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

/**
 * Creates a CQL context object with formatting utilities.
 * This context is passed to condition toCQL methods for serialization.
 *
 * @returns A CQLContext object with formatting functions
 */
export function createCQLContext(): CQLContext {
  return {
    formatValue,
    formatTemporalValue,
    formatSpatialQuery,
  };
}
