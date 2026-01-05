import { describe, expect, it } from "vitest";
import { createCQLContext } from "../../cql-context";
import { eq, gt } from "../comparison-operators";
import { and, not, or } from "../logical-operators";

describe("Logical Operators", () => {
  const ctx = createCQLContext();
  describe("and operator", () => {
    it("should combine multiple conditions with AND", () => {
      const condition = and(eq("status", "ACTIVE"), gt("age", 18));
      expect(condition.toCQL(ctx)).toBe("(status = 'ACTIVE' AND age > 18)");
    });

    it("should work with more than two conditions", () => {
      const condition = and(
        eq("status", "ACTIVE"),
        gt("age", 18),
        eq("verified", true),
      );
      expect(condition.toCQL(ctx)).toBe(
        "(status = 'ACTIVE' AND age > 18 AND verified = TRUE)",
      );
    });
  });

  describe("or operator", () => {
    it("should combine multiple conditions with OR", () => {
      const condition = or(eq("status", "PENDING"), eq("status", "PROCESSING"));
      expect(condition.toCQL(ctx)).toBe(
        "(status = 'PENDING' OR status = 'PROCESSING')",
      );
    });
  });

  describe("not operator", () => {
    it("should negate a condition", () => {
      const condition = not(eq("status", "DELETED"));
      expect(condition.toCQL(ctx)).toBe("NOT (status = 'DELETED')");
    });

    it("should work with complex conditions", () => {
      const condition = not(and(eq("status", "DELETED"), eq("archived", true)));
      expect(condition.toCQL(ctx)).toBe(
        "NOT ((status = 'DELETED' AND archived = TRUE))",
      );
    });
  });
});
