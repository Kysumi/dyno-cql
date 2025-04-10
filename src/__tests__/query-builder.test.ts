import { describe, it, expect } from "vitest";
import {
  eq,
  ne,
  lt,
  lte,
  gt,
  gte,
  between,
  isNull,
  isNotNull,
} from "../operators/comparison-operators";
import { like, contains } from "../operators/text-operators";
import { and, or, not } from "../operators/logical-operators";
import {
  intersects,
  disjoint,
  spatialContains,
  within,
} from "../operators/spatial-operators";
import type { Geometry } from "../operators/base-types";
import { QueryBuilder } from "../query-builder";

describe("QueryBuilder", () => {
  describe("filter method", () => {
    it("should set a filter condition", () => {
      const qb = new QueryBuilder();
      const condition = eq("status", "ACTIVE");

      qb.filter(condition);

      expect(qb["options"].filter).toBe(condition);
    });
  });

  describe("clone method", () => {
    it("should create a new QueryBuilder with the same configuration", () => {
      const qb = new QueryBuilder();
      qb.filter(eq("status", "ACTIVE"));

      const clone = qb.clone();

      expect(clone).not.toBe(qb); // Different instance

      expect(clone["options"].filter).toEqual(qb["options"].filter); // Same filter
    });

    it("should not affect the original when clone is modified", () => {
      const qb = new QueryBuilder();
      qb.filter(eq("status", "ACTIVE"));

      const clone = qb.clone();
      clone.filter(eq("status", "PENDING"));

      expect(qb["options"].filter).toEqual(eq("status", "ACTIVE"));
      expect(clone["options"].filter).toEqual(eq("status", "PENDING"));
    });
  });

  describe("toCQLUrlSafe method", () => {
    it("should convert the query to a URL-safe CQL string", () => {
      // Test with a query containing characters that need URL encoding
      const qb = new QueryBuilder().filter(
        and(
          eq("name", "John & Jane"),
          contains("description", "100% satisfaction"),
        ),
      );

      const cqlString = qb.toCQL();
      const urlSafeCQL = qb.toCQLUrlSafe();

      // Verify the URL-safe version is properly encoded
      expect(urlSafeCQL).toEqual(encodeURIComponent(cqlString));

      // Decode and verify it matches the original CQL
      expect(decodeURIComponent(urlSafeCQL)).toEqual(cqlString);
    });
  });

  describe("toCQL method", () => {
    it("should convert comparison operators to CQL", () => {
      expect(new QueryBuilder().filter(eq("status", "ACTIVE")).toCQL()).toEqual(
        "status = 'ACTIVE'",
      );

      expect(
        new QueryBuilder().filter(ne("status", "DELETED")).toCQL(),
      ).toEqual("status <> 'DELETED'");

      expect(new QueryBuilder().filter(lt("age", 18)).toCQL()).toEqual(
        "age < 18",
      );

      expect(new QueryBuilder().filter(lte("age", 18)).toCQL()).toEqual(
        "age <= 18",
      );

      expect(new QueryBuilder().filter(gt("price", 100)).toCQL()).toEqual(
        "price > 100",
      );

      expect(new QueryBuilder().filter(gte("price", 100)).toCQL()).toEqual(
        "price >= 100",
      );

      expect(new QueryBuilder().filter(between("age", 18, 65)).toCQL()).toEqual(
        "age BETWEEN 18 AND 65",
      );

      expect(new QueryBuilder().filter(isNull("deletedAt")).toCQL()).toEqual(
        "deletedAt = NULL",
      );

      expect(new QueryBuilder().filter(isNotNull("email")).toCQL()).toEqual(
        "email <> NULL",
      );
    });

    it("should convert text operators to CQL", () => {
      expect(new QueryBuilder().filter(like("name", "A%")).toCQL()).toEqual(
        "name LIKE 'A%'",
      );

      expect(
        new QueryBuilder().filter(contains("description", "important")).toCQL(),
      ).toEqual("description LIKE '%important%'");
    });

    it("should convert logical operators to CQL", () => {
      expect(
        new QueryBuilder()
          .filter(and(eq("status", "ACTIVE"), gt("age", 18)))
          .toCQL(),
      ).toEqual("(status = 'ACTIVE' AND age > 18)");

      expect(
        new QueryBuilder()
          .filter(or(eq("status", "PENDING"), eq("status", "PROCESSING")))
          .toCQL(),
      ).toEqual("(status = 'PENDING' OR status = 'PROCESSING')");

      expect(
        new QueryBuilder().filter(not(eq("status", "DELETED"))).toCQL(),
      ).toEqual("NOT (status = 'DELETED')");
    });

    it("should convert spatial operators to CQL", () => {
      const point: Geometry = { type: "Point", coordinates: [0, 0] };
      const polygon: Geometry = {
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

      expect(
        new QueryBuilder().filter(intersects("geometry", point)).toCQL(),
      ).toEqual(`INTERSECTS(geometry, ${JSON.stringify(point)})`);

      expect(
        new QueryBuilder().filter(disjoint("geometry", point)).toCQL(),
      ).toEqual(`DISJOINT(geometry, ${JSON.stringify(point)})`);

      expect(
        new QueryBuilder().filter(spatialContains("geometry", point)).toCQL(),
      ).toEqual(`CONTAINS(geometry, ${JSON.stringify(point)})`);

      expect(
        new QueryBuilder().filter(within("geometry", polygon)).toCQL(),
      ).toEqual(`WITHIN(geometry, ${JSON.stringify(polygon)})`);
    });

    it("should handle complex nested conditions", () => {
      const condition = and(
        or(eq("status", "PENDING"), eq("status", "PROCESSING")),
        not(eq("deleted", true)),
        gt("createdAt", new Date("2023-01-01")),
      );

      const cql = new QueryBuilder().filter(condition).toCQL();

      // Check parts of the CQL string since the exact date formatting might vary
      expect(cql).toContain("(status = 'PENDING' OR status = 'PROCESSING')");
      expect(cql).toContain("NOT (deleted = TRUE)");
      expect(cql).toContain("createdAt > TIMESTAMP('");
    });
  });
});
