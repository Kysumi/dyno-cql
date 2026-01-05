import type { Geometry } from "geojson";
import { InvalidConditionError } from "../errors";
import type { Condition } from "./base-types";

/**
 * Creates a spatial INTERSECTS condition
 * @example
 * intersects("geometry", { type: "Point", coordinates: [0, 0] })
 *  generates: INTERSECTS(geometry, POINT(0 0))
 *  Other outputs based on geometry type:
 *  - INTERSECTS(geometry, POINT(0 0))
 *  - INTERSECTS(geometry, LINESTRING(0 0, 1 1, 2 2))
 *  - INTERSECTS(geometry, POLYGON((0 0, 1 0, 1 1, 0 1, 0 0)))
 *  - INTERSECTS(geometry, MULTIPOINT((0 0), (1 1)))
 *  - INTERSECTS(geometry, MULTILINESTRING((0 0, 1 1), (2 2, 3 3)))
 *  - INTERSECTS(geometry, MULTIPOLYGON(((0 0, 1 0, 1 1, 0 1, 0 0)), ((2 2, 3 2, 3 3, 2 3, 2 2))))
 * @see {@link https:docs.ogc.org/is/21-065r2/21-065r2.html OGC CQL - Spatial Operators}
 */
export const intersects = (attr: string, geometry: Geometry): Condition => ({
  type: "intersects",
  attr,
  geometry,
  toCQL: (ctx) => {
    if (!attr) {
      throw new InvalidConditionError(
        "intersects",
        { type: "intersects", attr },
        "attr",
      );
    }
    if (!geometry) {
      throw new InvalidConditionError(
        "intersects",
        { type: "intersects", geometry },
        "geometry",
      );
    }
    return ctx.formatSpatialQuery("INTERSECTS", attr, geometry);
  },
});

/**
 * Creates a spatial DISJOINT condition
 * @example
 * disjoint("geometry", { type: "Point", coordinates: [0, 0] })
 *  generates: DISJOINT(geometry, POINT(0 0))
 *  Other outputs based on geometry type:
 *  - DISJOINT(geometry, POINT(0 0))
 *  - DISJOINT(geometry, LINESTRING(0 0, 1 1, 2 2))
 *  - DISJOINT(geometry, POLYGON((0 0, 1 0, 1 1, 0 1, 0 0)))
 *  - DISJOINT(geometry, MULTIPOINT((0 0), (1 1)))
 *  - DISJOINT(geometry, MULTILINESTRING((0 0, 1 1), (2 2, 3 3)))
 *  - DISJOINT(geometry, MULTIPOLYGON(((0 0, 1 0, 1 1, 0 1, 0 0)), ((2 2, 3 2, 3 3, 2 3, 2 2))))
 * @see {@link https:docs.ogc.org/is/21-065r2/21-065r2.html OGC CQL - Spatial Operators}
 */
export const disjoint = (attr: string, geometry: Geometry): Condition => ({
  type: "disjoint",
  attr,
  geometry,
  toCQL: (ctx) => {
    if (!attr) {
      throw new InvalidConditionError(
        "disjoint",
        { type: "disjoint", attr },
        "attr",
      );
    }
    if (!geometry) {
      throw new InvalidConditionError(
        "disjoint",
        { type: "disjoint", geometry },
        "geometry",
      );
    }
    return ctx.formatSpatialQuery("DISJOINT", attr, geometry);
  },
});

/**
 * Creates a spatial CONTAINS condition
 * @example
 * spatialContains("geometry", { type: "Point", coordinates: [0, 0] })
 *  generates: CONTAINS(geometry, POINT(0 0))
 *  Other outputs based on geometry type:
 *  - CONTAINS(geometry, POINT(0 0))
 *  - CONTAINS(geometry, LINESTRING(0 0, 1 1, 2 2))
 *  - CONTAINS(geometry, POLYGON((0 0, 1 0, 1 1, 0 1, 0 0)))
 *  - CONTAINS(geometry, MULTIPOINT((0 0), (1 1)))
 *  - CONTAINS(geometry, MULTILINESTRING((0 0, 1 1), (2 2, 3 3)))
 *  - CONTAINS(geometry, MULTIPOLYGON(((0 0, 1 0, 1 1, 0 1, 0 0)), ((2 2, 3 2, 3 3, 2 3, 2 2))))
 * @see {@link https:docs.ogc.org/is/21-065r2/21-065r2.html OGC CQL - Spatial Operators}
 */
export const spatialContains = (
  attr: string,
  geometry: Geometry,
): Condition => ({
  type: "contains",
  attr,
  geometry,
  toCQL: (ctx) => {
    if (!attr) {
      throw new InvalidConditionError(
        "contains (spatial)",
        { type: "contains", attr },
        "attr",
      );
    }
    if (!geometry) {
      throw new InvalidConditionError(
        "contains (spatial)",
        { type: "contains", geometry },
        "geometry",
      );
    }
    return ctx.formatSpatialQuery("CONTAINS", attr, geometry);
  },
});

/**
 * Creates a spatial WITHIN condition
 * @example
 * within("geometry", { type: "Polygon", coordinates: [[[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]] })
 *  generates: WITHIN(geometry, POLYGON((0 0, 1 0, 1 1, 0 1, 0 0)))
 *  Other outputs based on geometry type:
 *  - WITHIN(geometry, POINT(0 0))
 *  - WITHIN(geometry, LINESTRING(0 0, 1 1, 2 2))
 *  - WITHIN(geometry, POLYGON((0 0, 1 0, 1 1, 0 1, 0 0)))
 *  - WITHIN(geometry, MULTIPOINT((0 0), (1 1)))
 *  - WITHIN(geometry, MULTILINESTRING((0 0, 1 1), (2 2, 3 3)))
 *  - WITHIN(geometry, MULTIPOLYGON(((0 0, 1 0, 1 1, 0 1, 0 0)), ((2 2, 3 2, 3 3, 2 3, 2 2))))
 * @see {@link https:docs.ogc.org/is/21-065r2/21-065r2.html OGC CQL - Spatial Operators}
 */
export const within = (attr: string, geometry: Geometry): Condition => ({
  type: "within",
  attr,
  geometry,
  toCQL: (ctx) => {
    if (!attr) {
      throw new InvalidConditionError(
        "within",
        { type: "within", attr },
        "attr",
      );
    }
    if (!geometry) {
      throw new InvalidConditionError(
        "within",
        { type: "within", geometry },
        "geometry",
      );
    }
    return ctx.formatSpatialQuery("WITHIN", attr, geometry);
  },
});

/**
 * Creates a spatial TOUCHES condition
 * @example
 * touches("geometry", { type: "LineString", coordinates: [[0, 0], [1, 1]] })
 *  generates: TOUCHES(geometry, LINESTRING(0 0, 1 1))
 *  Other outputs based on geometry type:
 *  - TOUCHES(geometry, POINT(0 0))
 *  - TOUCHES(geometry, LINESTRING(0 0, 1 1, 2 2))
 *  - TOUCHES(geometry, POLYGON((0 0, 1 0, 1 1, 0 1, 0 0)))
 *  - TOUCHES(geometry, MULTIPOINT((0 0), (1 1)))
 *  - TOUCHES(geometry, MULTILINESTRING((0 0, 1 1), (2 2, 3 3)))
 *  - TOUCHES(geometry, MULTIPOLYGON(((0 0, 1 0, 1 1, 0 1, 0 0)), ((2 2, 3 2, 3 3, 2 3, 2 2))))
 * @see {@link https:docs.ogc.org/is/21-065r2/21-065r2.html OGC CQL - Spatial Operators}
 */
export const touches = (attr: string, geometry: Geometry): Condition => ({
  type: "touches",
  attr,
  geometry,
  toCQL: (ctx) => {
    if (!attr) {
      throw new InvalidConditionError(
        "touches",
        { type: "touches", attr },
        "attr",
      );
    }
    if (!geometry) {
      throw new InvalidConditionError(
        "touches",
        { type: "touches", geometry },
        "geometry",
      );
    }
    return ctx.formatSpatialQuery("TOUCHES", attr, geometry);
  },
});

/**
 * Creates a spatial OVERLAPS condition
 * @example
 * overlaps("geometry", { type: "Polygon", coordinates: [[[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]] })
 *  generates: OVERLAPS(geometry, POLYGON((0 0, 1 0, 1 1, 0 1, 0 0)))
 *  Other outputs based on geometry type:
 *  - OVERLAPS(geometry, POINT(0 0))
 *  - OVERLAPS(geometry, LINESTRING(0 0, 1 1, 2 2))
 *  - OVERLAPS(geometry, POLYGON((0 0, 1 0, 1 1, 0 1, 0 0)))
 *  - OVERLAPS(geometry, MULTIPOINT((0 0), (1 1)))
 *  - OVERLAPS(geometry, MULTILINESTRING((0 0, 1 1), (2 2, 3 3)))
 *  - OVERLAPS(geometry, MULTIPOLYGON(((0 0, 1 0, 1 1, 0 1, 0 0)), ((2 2, 3 2, 3 3, 2 3, 2 2))))
 * @see {@link https:docs.ogc.org/is/21-065r2/21-065r2.html OGC CQL - Spatial Operators}
 */
export const overlaps = (attr: string, geometry: Geometry): Condition => ({
  type: "overlaps",
  attr,
  geometry,
  toCQL: (ctx) => {
    if (!attr) {
      throw new InvalidConditionError(
        "overlaps",
        { type: "overlaps", attr },
        "attr",
      );
    }
    if (!geometry) {
      throw new InvalidConditionError(
        "overlaps",
        { type: "overlaps", geometry },
        "geometry",
      );
    }
    return ctx.formatSpatialQuery("OVERLAPS", attr, geometry);
  },
});

/**
 * Creates a spatial CROSSES condition
 * @example
 * crosses("geometry", { type: "LineString", coordinates: [[0, 0], [1, 1]] })
 *  generates: CROSSES(geometry, LINESTRING(0 0, 1 1))
 *  Other outputs based on geometry type:
 *  - CROSSES(geometry, POINT(0 0))
 *  - CROSSES(geometry, LINESTRING(0 0, 1 1, 2 2))
 *  - CROSSES(geometry, POLYGON((0 0, 1 0, 1 1, 0 1, 0 0)))
 *  - CROSSES(geometry, MULTIPOINT((0 0), (1 1)))
 *  - CROSSES(geometry, MULTILINESTRING((0 0, 1 1), (2 2, 3 3)))
 *  - CROSSES(geometry, MULTIPOLYGON(((0 0, 1 0, 1 1, 0 1, 0 0)), ((2 2, 3 2, 3 3, 2 3, 2 2))))
 * @see {@link https:docs.ogc.org/is/21-065r2/21-065r2.html OGC CQL - Spatial Operators}
 */
export const crosses = (attr: string, geometry: Geometry): Condition => ({
  type: "crosses",
  attr,
  geometry,
  toCQL: (ctx) => {
    if (!attr) {
      throw new InvalidConditionError(
        "crosses",
        { type: "crosses", attr },
        "attr",
      );
    }
    if (!geometry) {
      throw new InvalidConditionError(
        "crosses",
        { type: "crosses", geometry },
        "geometry",
      );
    }
    return ctx.formatSpatialQuery("CROSSES", attr, geometry);
  },
});

/**
 * Creates a spatial EQUALS condition
 * @example
 * spatialEquals("geometry", { type: "Point", coordinates: [0, 0] })
 *  generates: EQUALS(geometry, {"type":"Point","coordinates":[0,0]})
 *  Other outputs based on geometry type:
 *  - EQUALS(geometry, {"type":"Point","coordinates":[0,0]})
 *  - EQUALS(geometry, {"type":"LineString","coordinates":[[0,0],[1,1],[2,2]]})
 *  - EQUALS(geometry, {"type":"Polygon","coordinates":[[[0,0],[1,0],[1,1],[0,1],[0,0]]]})
 *  - EQUALS(geometry, {"type":"MultiPoint","coordinates":[[0,0],[1,1]]})
 *  - EQUALS(geometry, {"type":"MultiLineString","coordinates":[[[0,0],[1,1]],[[2,2],[3,3]]]})
 *  - EQUALS(geometry, {"type":"MultiPolygon","coordinates":[[[[0,0],[1,0],[1,1],[0,1],[0,0]]],[[[2,2],[3,2],[3,3],[2,3],[2,2]]]]})
 * @see {@link https:docs.ogc.org/is/21-065r2/21-065r2.html OGC CQL - Spatial Operators}
 */
export const spatialEquals = (attr: string, geometry: Geometry): Condition => ({
  type: "eq",
  attr,
  geometry,
  toCQL: (ctx) => {
    if (!attr) {
      throw new InvalidConditionError(
        "spatialEquals",
        { type: "eq", attr },
        "attr",
      );
    }
    if (!geometry) {
      throw new InvalidConditionError(
        "spatialEquals",
        { type: "eq", geometry },
        "geometry",
      );
    }
    return ctx.formatSpatialQuery("EQUALS", attr, geometry);
  },
});
