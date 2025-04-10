import { describe, it, expect } from "vitest";
import { and, or, not } from "../logical-operators";
import { eq, gt } from "../comparison-operators";

describe("Logical Operators", () => {
  describe("and operator", () => {
    it("should combine multiple conditions with AND", () => {
      const condition = and(eq("status", "ACTIVE"), gt("age", 18));

      expect(condition).toEqual({
        type: "and",
        conditions: [
          {
            type: "eq",
            attr: "status",
            value: "ACTIVE",
          },
          {
            type: "gt",
            attr: "age",
            value: 18,
          },
        ],
      });
    });

    it("should work with more than two conditions", () => {
      const condition = and(
        eq("status", "ACTIVE"),
        gt("age", 18),
        eq("verified", true),
      );

      expect(condition).toEqual({
        type: "and",
        conditions: [
          {
            type: "eq",
            attr: "status",
            value: "ACTIVE",
          },
          {
            type: "gt",
            attr: "age",
            value: 18,
          },
          {
            type: "eq",
            attr: "verified",
            value: true,
          },
        ],
      });
    });
  });

  describe("or operator", () => {
    it("should combine multiple conditions with OR", () => {
      const condition = or(eq("status", "PENDING"), eq("status", "PROCESSING"));

      expect(condition).toEqual({
        type: "or",
        conditions: [
          {
            type: "eq",
            attr: "status",
            value: "PENDING",
          },
          {
            type: "eq",
            attr: "status",
            value: "PROCESSING",
          },
        ],
      });
    });
  });

  describe("not operator", () => {
    it("should negate a condition", () => {
      const condition = not(eq("status", "DELETED"));

      expect(condition).toEqual({
        type: "not",
        condition: {
          type: "eq",
          attr: "status",
          value: "DELETED",
        },
      });
    });

    it("should work with complex conditions", () => {
      const condition = not(and(eq("status", "DELETED"), eq("archived", true)));

      expect(condition).toEqual({
        type: "not",
        condition: {
          type: "and",
          conditions: [
            {
              type: "eq",
              attr: "status",
              value: "DELETED",
            },
            {
              type: "eq",
              attr: "archived",
              value: true,
            },
          ],
        },
      });
    });
  });
});
