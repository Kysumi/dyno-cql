import { describe, it, expect } from "vitest";
import {
  intersects,
  disjoint,
  spatialContains,
  within,
  touches,
  overlaps,
  crosses,
  spatialEquals,
} from "../spatial-operators";
import type { Geometry } from "geojson";
import { createCQLContext } from "../../cql-context";

describe("Spatial Operators", () => {
  const ctx = createCQLContext();
  // Sample geometries for testing
  const pointGeometry: Geometry = {
    type: "Point",
    coordinates: [0, 0],
  };

  const polygonGeometry: Geometry = {
    type: "Polygon",
    coordinates: [
      [
        [0, 0],
        [1, 0],
        [1, 1],
        [0, 1],
        [0, 0],
      ],
    ],
  };

  const lineStringGeometry: Geometry = {
    type: "LineString",
    coordinates: [
      [0, 0],
      [1, 1],
    ],
  };

  describe("intersects operator", () => {
    it("should generate correct CQL for an intersects condition", () => {
      const condition = intersects("geometry", pointGeometry);
      expect(condition.toCQL(ctx)).toBe("INTERSECTS(geometry, POINT (0 0))");
    });
  });

  describe("disjoint operator", () => {
    it("should generate correct CQL for a disjoint condition", () => {
      const condition = disjoint("geometry", pointGeometry);
      expect(condition.toCQL(ctx)).toBe("DISJOINT(geometry, POINT (0 0))");
    });
  });

  describe("spatialContains operator", () => {
    it("should generate correct CQL for a contains condition", () => {
      const condition = spatialContains("geometry", pointGeometry);
      expect(condition.toCQL(ctx)).toBe("CONTAINS(geometry, POINT (0 0))");
    });
  });

  describe("within operator", () => {
    it("should generate correct CQL for a within condition", () => {
      const condition = within("geometry", polygonGeometry);
      expect(condition.toCQL(ctx)).toBe(
        "WITHIN(geometry, POLYGON ((0 0, 1 0, 1 1, 0 1, 0 0)))",
      );
    });
  });

  describe("touches operator", () => {
    it("should generate correct CQL for a touches condition", () => {
      const condition = touches("geometry", lineStringGeometry);
      expect(condition.toCQL(ctx)).toBe(
        "TOUCHES(geometry, LINESTRING (0 0, 1 1))",
      );
    });
  });

  describe("overlaps operator", () => {
    it("should generate correct CQL for an overlaps condition", () => {
      const condition = overlaps("geometry", polygonGeometry);
      expect(condition.toCQL(ctx)).toBe(
        "OVERLAPS(geometry, POLYGON ((0 0, 1 0, 1 1, 0 1, 0 0)))",
      );
    });
  });

  describe("crosses operator", () => {
    it("should generate correct CQL for a crosses condition", () => {
      const condition = crosses("geometry", lineStringGeometry);
      expect(condition.toCQL(ctx)).toBe(
        "CROSSES(geometry, LINESTRING (0 0, 1 1))",
      );
    });
  });

  describe("spatialEquals operator", () => {
    it("should generate correct CQL for an equals condition", () => {
      const condition = spatialEquals("geometry", pointGeometry);
      expect(condition.toCQL(ctx)).toBe("EQUALS(geometry, POINT (0 0))");
    });
  });
});
