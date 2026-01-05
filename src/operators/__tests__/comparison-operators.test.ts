import { describe, expect, it } from "vitest";
import { createCQLContext } from "../../cql-context";
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
} from "../comparison-operators";

describe("Comparison Operators", () => {
  const ctx = createCQLContext();

  describe("eq operator", () => {
    it("should generate correct CQL for string values", () => {
      const condition = eq("status", "ACTIVE");
      expect(condition.toCQL(ctx)).toBe("status = 'ACTIVE'");
    });

    it("should generate correct CQL for numeric values", () => {
      const condition = eq("age", 30);
      expect(condition.toCQL(ctx)).toBe("age = 30");
    });

    it("should work with boolean values", () => {
      const condition = eq("active", true);
      expect(condition.toCQL(ctx)).toBe("active = TRUE");
    });
  });

  describe("ne operator", () => {
    it("should generate correct CQL for a not equals condition", () => {
      const condition = ne("status", "DELETED");
      expect(condition.toCQL(ctx)).toBe("status <> 'DELETED'");
    });
  });

  describe("lt operator", () => {
    it("should generate correct CQL for a less than condition", () => {
      const condition = lt("age", 18);
      expect(condition.toCQL(ctx)).toBe("age < 18");
    });
  });

  describe("lte operator", () => {
    it("should generate correct CQL for a less than or equal condition", () => {
      const condition = lte("score", 100);
      expect(condition.toCQL(ctx)).toBe("score <= 100");
    });
  });

  describe("gt operator", () => {
    it("should generate correct CQL for a greater than condition", () => {
      const condition = gt("price", 50);
      expect(condition.toCQL(ctx)).toBe("price > 50");
    });
  });

  describe("gte operator", () => {
    it("should generate correct CQL for a greater than or equal condition", () => {
      const condition = gte("quantity", 5);
      expect(condition.toCQL(ctx)).toBe("quantity >= 5");
    });
  });

  describe("between operator", () => {
    it("should generate correct CQL for a between condition", () => {
      const condition = between("age", 18, 65);
      expect(condition.toCQL(ctx)).toBe("age BETWEEN 18 AND 65");
    });
  });

  describe("isNull operator", () => {
    it("should generate correct CQL for an is null condition", () => {
      const condition = isNull("deletedAt");
      expect(condition.toCQL(ctx)).toBe("deletedAt IS NULL");
    });
  });

  describe("isNotNull operator", () => {
    it("should generate correct CQL for an is not null condition", () => {
      const condition = isNotNull("email");
      expect(condition.toCQL(ctx)).toBe("email IS NOT NULL");
    });
  });
});
