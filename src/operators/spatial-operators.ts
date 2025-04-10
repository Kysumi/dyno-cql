import type { Geometry } from "geojson";
import type { Condition } from "./base-types";

/**
 * Creates a spatial INTERSECTS condition
 * @example
 * intersects("geometry", { type: "Point", coordinates: [0, 0] })
 * @see {@link https://docs.ogc.org/is/21-065r2/21-065r2.html OGC CQL - Spatial Operators}
 */
export const intersects = (attr: string, geometry: Geometry): Condition => ({
  type: "intersects",
  attr,
  geometry,
});

/**
 * Creates a spatial DISJOINT condition
 * @example
 * disjoint("geometry", { type: "Point", coordinates: [0, 0] })
 * @see {@link https://docs.ogc.org/is/21-065r2/21-065r2.html OGC CQL - Spatial Operators}
 */
export const disjoint = (attr: string, geometry: Geometry): Condition => ({
  type: "disjoint",
  attr,
  geometry,
});

/**
 * Creates a spatial CONTAINS condition
 * @example
 * spatialContains("geometry", { type: "Point", coordinates: [0, 0] })
 * @see {@link https://docs.ogc.org/is/21-065r2/21-065r2.html OGC CQL - Spatial Operators}
 */
export const spatialContains = (
  attr: string,
  geometry: Geometry,
): Condition => ({
  type: "contains",
  attr,
  geometry,
});

/**
 * Creates a spatial WITHIN condition
 * @example
 * within("geometry", { type: "Polygon", coordinates: [[[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]] })
 * @see {@link https://docs.ogc.org/is/21-065r2/21-065r2.html OGC CQL - Spatial Operators}
 */
export const within = (attr: string, geometry: Geometry): Condition => ({
  type: "within",
  attr,
  geometry,
});

/**
 * Creates a spatial TOUCHES condition
 * @example
 * touches("geometry", { type: "LineString", coordinates: [[0, 0], [1, 1]] })
 * @see {@link https://docs.ogc.org/is/21-065r2/21-065r2.html OGC CQL - Spatial Operators}
 */
export const touches = (attr: string, geometry: Geometry): Condition => ({
  type: "touches",
  attr,
  geometry,
});

/**
 * Creates a spatial OVERLAPS condition
 * @example
 * overlaps("geometry", { type: "Polygon", coordinates: [[[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]] })
 * @see {@link https://docs.ogc.org/is/21-065r2/21-065r2.html OGC CQL - Spatial Operators}
 */
export const overlaps = (attr: string, geometry: Geometry): Condition => ({
  type: "overlaps",
  attr,
  geometry,
});

/**
 * Creates a spatial CROSSES condition
 * @example
 * crosses("geometry", { type: "LineString", coordinates: [[0, 0], [1, 1]] })
 * @see {@link https://docs.ogc.org/is/21-065r2/21-065r2.html OGC CQL - Spatial Operators}
 */
export const crosses = (attr: string, geometry: Geometry): Condition => ({
  type: "crosses",
  attr,
  geometry,
});

/**
 * Creates a spatial EQUALS condition
 * @example
 * spatialEquals("geometry", { type: "Point", coordinates: [0, 0] })
 * @see {@link https://docs.ogc.org/is/21-065r2/21-065r2.html OGC CQL - Spatial Operators}
 */
export const spatialEquals = (attr: string, geometry: Geometry): Condition => ({
  type: "eq",
  attr,
  geometry,
});
