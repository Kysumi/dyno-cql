import { describe, expect, it } from "vitest";
import { createCQLContext } from "../../cql-context";
import {
  between,
  eq,
  gt,
  gte,
  in as inOp,
  isNotNull,
  isNull,
  lt,
  lte,
  ne,
  notIn,
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

  describe("in operator", () => {
    it("should generate correct CQL for string list", () => {
      const condition = inOp("investigation_type", ["CPT", "OTHER"]);
      expect(condition.toCQL(ctx)).toBe(
        "investigation_type IN ('CPT', 'OTHER')",
      );
    });

    it("should generate correct CQL for numeric list", () => {
      const condition = inOp("code", [1, 2, 3]);
      expect(condition.toCQL(ctx)).toBe("code IN (1, 2, 3)");
    });

    it("should throw InvalidConditionError when attr is empty", () => {
      expect(() => inOp("", ["CPT"])).toThrowError(
        "Condition of type 'in' is missing required attribute: attr.",
      );
    });

    it("should throw InvalidConditionError when values list is empty or not an array", () => {
      expect(() => inOp("type", [])).toThrowError(
        "Condition of type 'in' is missing required attribute: values.",
      );
    });
  });

  describe("notIn operator", () => {
    it("should generate correct CQL for string list", () => {
      const condition = notIn("status", ["DELETED", "ARCHIVED"]);
      expect(condition.toCQL(ctx)).toBe(
        "status NOT IN ('DELETED', 'ARCHIVED')",
      );
    });

    it("should generate correct CQL for numeric list", () => {
      const condition = notIn("level", [4, 5]);
      expect(condition.toCQL(ctx)).toBe("level NOT IN (4, 5)");
    });

    it("should throw InvalidConditionError when attr is empty", () => {
      expect(() => notIn("", ["DELETED"])).toThrowError(
        "Condition of type 'notIn' is missing required attribute: attr.",
      );
    });

    it("should throw InvalidConditionError when values list is empty", () => {
      expect(() => notIn("status", [])).toThrowError(
        "Condition of type 'notIn' is missing required attribute: values.",
      );
    });
  });
});
