import type { Geometry } from "geojson";
import { describe, expect, it } from "vitest";
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
} from "../operators/comparison-operators";
import { and, not, or } from "../operators/logical-operators";
import {
  disjoint,
  intersects,
  spatialContains,
  within,
} from "../operators/spatial-operators";
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
} from "../operators/temporal-operators";
import { contains, like } from "../operators/text-operators";
import { QueryBuilder, queryBuilder } from "../query-builder";

describe("QueryBuilder", () => {
  describe("filter method", () => {
    it("should set a filter condition", () => {
      const qb = new QueryBuilder();
      const condition = eq("status", "ACTIVE");

      qb.filter(condition);

      expect(qb._getOptions().filter).toBe(condition);
    });
  });

  describe("clone method", () => {
    it("should create a new QueryBuilder with the same configuration", () => {
      const qb = new QueryBuilder();
      qb.filter(eq("status", "ACTIVE"));

      const clone = qb.clone();

      expect(clone).not.toBe(qb); // Different instance
      expect(clone.toCQL()).toEqual(qb.toCQL()); // Same filter
    });

    it("should not affect the original when clone is modified", () => {
      const qb = new QueryBuilder();
      qb.filter(eq("status", "ACTIVE"));

      const clone = qb.clone();
      clone.filter(eq("status", "PENDING"));

      expect(qb.toCQL()).toBe("status = 'ACTIVE'");
      expect(clone.toCQL()).toBe("status = 'PENDING'");
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
        "deletedAt IS NULL",
      );

      expect(new QueryBuilder().filter(isNotNull("email")).toCQL()).toEqual(
        "email IS NOT NULL",
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
      ).toEqual("INTERSECTS(geometry, POINT (0 0))");

      expect(
        new QueryBuilder().filter(disjoint("geometry", point)).toCQL(),
      ).toEqual("DISJOINT(geometry, POINT (0 0))");

      expect(
        new QueryBuilder().filter(spatialContains("geometry", point)).toCQL(),
      ).toEqual("CONTAINS(geometry, POINT (0 0))");

      expect(
        new QueryBuilder().filter(within("geometry", polygon)).toCQL(),
      ).toEqual("WITHIN(geometry, POLYGON ((0 0, 1 0, 1 1, 0 1, 0 0)))");
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

    it("should convert temporal operators to CQL with timestamp strings", () => {
      expect(
        new QueryBuilder()
          .filter(anyinteracts("eventDate", "2023-01-01T00:00:00Z"))
          .toCQL(),
      ).toEqual("ANYINTERACTS(eventDate, TIMESTAMP('2023-01-01T00:00:00Z'))");

      expect(
        new QueryBuilder()
          .filter(after("eventDate", "2023-01-01T00:00:00Z"))
          .toCQL(),
      ).toEqual("AFTER(eventDate, TIMESTAMP('2023-01-01T00:00:00Z'))");

      expect(
        new QueryBuilder()
          .filter(before("eventDate", "2023-12-31T23:59:59Z"))
          .toCQL(),
      ).toEqual("BEFORE(eventDate, TIMESTAMP('2023-12-31T23:59:59Z'))");

      expect(
        new QueryBuilder()
          .filter(tequals("eventDate", "2023-06-15T12:00:00Z"))
          .toCQL(),
      ).toEqual("TEQUALS(eventDate, TIMESTAMP('2023-06-15T12:00:00Z'))");
    });

    it("should convert temporal operators to CQL with Date objects", () => {
      const date = new Date("2023-06-15T12:00:00.000Z");
      expect(
        new QueryBuilder().filter(after("eventDate", date)).toCQL(),
      ).toEqual("AFTER(eventDate, TIMESTAMP('2023-06-15T12:00:00.000Z'))");

      expect(
        new QueryBuilder().filter(before("eventDate", date)).toCQL(),
      ).toEqual("BEFORE(eventDate, TIMESTAMP('2023-06-15T12:00:00.000Z'))");

      expect(
        new QueryBuilder().filter(tequals("eventDate", date)).toCQL(),
      ).toEqual("TEQUALS(eventDate, TIMESTAMP('2023-06-15T12:00:00.000Z'))");
    });

    it("should convert temporal operators to CQL with intervals", () => {
      const interval = {
        start: "2023-01-01T00:00:00Z",
        end: "2023-12-31T23:59:59Z",
      };

      expect(
        new QueryBuilder().filter(during("eventDate", interval)).toCQL(),
      ).toEqual(
        "DURING(eventDate, INTERVAL('2023-01-01T00:00:00Z', '2023-12-31T23:59:59Z'))",
      );

      expect(
        new QueryBuilder().filter(anyinteracts("eventDate", interval)).toCQL(),
      ).toEqual(
        "ANYINTERACTS(eventDate, INTERVAL('2023-01-01T00:00:00Z', '2023-12-31T23:59:59Z'))",
      );

      expect(
        new QueryBuilder().filter(toverlaps("eventPeriod", interval)).toCQL(),
      ).toEqual(
        "TOVERLAPS(eventPeriod, INTERVAL('2023-01-01T00:00:00Z', '2023-12-31T23:59:59Z'))",
      );

      expect(
        new QueryBuilder()
          .filter(overlappedby("eventPeriod", interval))
          .toCQL(),
      ).toEqual(
        "OVERLAPPEDBY(eventPeriod, INTERVAL('2023-01-01T00:00:00Z', '2023-12-31T23:59:59Z'))",
      );
    });

    it("should convert temporal operators to CQL with Date objects in intervals", () => {
      const interval = {
        start: new Date("2023-01-01T00:00:00.000Z"),
        end: new Date("2023-12-31T23:59:59.000Z"),
      };

      expect(
        new QueryBuilder().filter(during("eventDate", interval)).toCQL(),
      ).toEqual(
        "DURING(eventDate, INTERVAL('2023-01-01T00:00:00.000Z', '2023-12-31T23:59:59.000Z'))",
      );
    });

    it("should convert all temporal interval operators to CQL", () => {
      const timestamp = "2023-06-15T12:00:00Z";
      const interval = { start: "2023-01-01", end: "2023-12-31" };

      expect(
        new QueryBuilder().filter(begins("eventPeriod", timestamp)).toCQL(),
      ).toEqual("BEGINS(eventPeriod, TIMESTAMP('2023-06-15T12:00:00Z'))");

      expect(
        new QueryBuilder().filter(begunby("eventPeriod", timestamp)).toCQL(),
      ).toEqual("BEGUNBY(eventPeriod, TIMESTAMP('2023-06-15T12:00:00Z'))");

      expect(
        new QueryBuilder().filter(tcontains("eventPeriod", timestamp)).toCQL(),
      ).toEqual("TCONTAINS(eventPeriod, TIMESTAMP('2023-06-15T12:00:00Z'))");

      expect(
        new QueryBuilder().filter(endedby("eventPeriod", timestamp)).toCQL(),
      ).toEqual("ENDEDBY(eventPeriod, TIMESTAMP('2023-06-15T12:00:00Z'))");

      expect(
        new QueryBuilder().filter(ends("eventPeriod", timestamp)).toCQL(),
      ).toEqual("ENDS(eventPeriod, TIMESTAMP('2023-06-15T12:00:00Z'))");

      expect(
        new QueryBuilder().filter(meets("eventPeriod", interval)).toCQL(),
      ).toEqual("MEETS(eventPeriod, INTERVAL('2023-01-01', '2023-12-31'))");

      expect(
        new QueryBuilder().filter(metby("eventPeriod", interval)).toCQL(),
      ).toEqual("METBY(eventPeriod, INTERVAL('2023-01-01', '2023-12-31'))");

      expect(
        new QueryBuilder().filter(tintersects("eventDate", timestamp)).toCQL(),
      ).toEqual("TINTERSECTS(eventDate, TIMESTAMP('2023-06-15T12:00:00Z'))");
    });

    it("should handle complex conditions with temporal operators", () => {
      const condition = and(
        after("startDate", "2023-01-01T00:00:00Z"),
        before("endDate", "2023-12-31T23:59:59Z"),
        eq("status", "ACTIVE"),
      );

      const cql = new QueryBuilder().filter(condition).toCQL();

      expect(cql).toContain(
        "AFTER(startDate, TIMESTAMP('2023-01-01T00:00:00Z'))",
      );
      expect(cql).toContain(
        "BEFORE(endDate, TIMESTAMP('2023-12-31T23:59:59Z'))",
      );
      expect(cql).toContain("status = 'ACTIVE'");
      expect(cql).toContain(" AND ");
    });
  });

  describe("queryBuilder factory function", () => {
    it("should create a QueryBuilder instance without new keyword", () => {
      const qb = queryBuilder();
      expect(qb).toBeInstanceOf(QueryBuilder);
    });

    it("should create a functional QueryBuilder that can build queries", () => {
      const cql = queryBuilder().filter(eq("status", "ACTIVE")).toCQL();

      expect(cql).toEqual("status = 'ACTIVE'");
    });

    it("should support method chaining", () => {
      const cql = queryBuilder()
        .filter(and(eq("status", "ACTIVE"), gt("age", 18)))
        .toCQL();

      expect(cql).toEqual("(status = 'ACTIVE' AND age > 18)");
    });

    it("should work the same as using new QueryBuilder()", () => {
      const condition = and(eq("status", "ACTIVE"), like("name", "John%"));

      const cqlWithNew = new QueryBuilder().filter(condition).toCQL();
      const cqlWithFactory = queryBuilder().filter(condition).toCQL();

      expect(cqlWithFactory).toEqual(cqlWithNew);
    });

    it("should support cloning", () => {
      const base = queryBuilder().filter(eq("type", "product"));
      const clone = base
        .clone()
        .filter(and(eq("type", "product"), eq("status", "ACTIVE")));

      expect(base.toCQL()).toEqual("type = 'product'");
      expect(clone.toCQL()).toEqual("(type = 'product' AND status = 'ACTIVE')");
    });
  });
});
