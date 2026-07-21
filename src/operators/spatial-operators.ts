import type { Geometry } from "geojson";
import { InvalidConditionError } from "../errors";
import type { Condition, SpatialCondition } from "./base-types";

function createSpatialOperator(type: SpatialCondition["type"], opName: string) {
  return (attr: string, geometry: Geometry): Condition => {
    const errName =
      type === "eq"
        ? "spatialEquals"
        : type === "contains"
          ? "contains (spatial)"
          : type;
    if (!attr) {
      throw new InvalidConditionError(errName, { type, attr }, "attr");
    }
    if (!geometry) {
      throw new InvalidConditionError(errName, { type, geometry }, "geometry");
    }
    return {
      type,
      attr,
      geometry,
      toCQL: (ctx) => ctx.formatSpatialQuery(opName, attr, geometry),
    };
  };
}

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
export const intersects = createSpatialOperator("intersects", "INTERSECTS");

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
export const disjoint = createSpatialOperator("disjoint", "DISJOINT");

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
export const spatialContains = createSpatialOperator("contains", "CONTAINS");

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
export const within = createSpatialOperator("within", "WITHIN");

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
export const touches = createSpatialOperator("touches", "TOUCHES");

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
export const overlaps = createSpatialOperator("overlaps", "OVERLAPS");

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
export const crosses = createSpatialOperator("crosses", "CROSSES");

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
export const spatialEquals = createSpatialOperator("eq", "EQUALS");
