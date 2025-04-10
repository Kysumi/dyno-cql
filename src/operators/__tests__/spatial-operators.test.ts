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
import type { Geometry } from "../base-types";

describe("Spatial Operators", () => {
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
    it("should create a correct intersects condition", () => {
      const condition = intersects("geometry", pointGeometry);

      expect(condition).toEqual({
        type: "intersects",
        attr: "geometry",
        geometry: pointGeometry,
      });
    });
  });

  describe("disjoint operator", () => {
    it("should create a correct disjoint condition", () => {
      const condition = disjoint("geometry", pointGeometry);

      expect(condition).toEqual({
        type: "disjoint",
        attr: "geometry",
        geometry: pointGeometry,
      });
    });
  });

  describe("spatialContains operator", () => {
    it("should create a correct contains condition", () => {
      const condition = spatialContains("geometry", pointGeometry);

      expect(condition).toEqual({
        type: "contains",
        attr: "geometry",
        geometry: pointGeometry,
      });
    });
  });

  describe("within operator", () => {
    it("should create a correct within condition", () => {
      const condition = within("geometry", polygonGeometry);

      expect(condition).toEqual({
        type: "within",
        attr: "geometry",
        geometry: polygonGeometry,
      });
    });
  });

  describe("touches operator", () => {
    it("should create a correct touches condition", () => {
      const condition = touches("geometry", lineStringGeometry);

      expect(condition).toEqual({
        type: "touches",
        attr: "geometry",
        geometry: lineStringGeometry,
      });
    });
  });

  describe("overlaps operator", () => {
    it("should create a correct overlaps condition", () => {
      const condition = overlaps("geometry", polygonGeometry);

      expect(condition).toEqual({
        type: "overlaps",
        attr: "geometry",
        geometry: polygonGeometry,
      });
    });
  });

  describe("crosses operator", () => {
    it("should create a correct crosses condition", () => {
      const condition = crosses("geometry", lineStringGeometry);

      expect(condition).toEqual({
        type: "crosses",
        attr: "geometry",
        geometry: lineStringGeometry,
      });
    });
  });

  describe("spatialEquals operator", () => {
    it("should create a correct equals condition", () => {
      const condition = spatialEquals("geometry", pointGeometry);

      expect(condition).toEqual({
        type: "equals",
        attr: "geometry",
        geometry: pointGeometry,
      });
    });
  });
});
