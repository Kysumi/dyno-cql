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
} from "../comparison-operators";

describe("Comparison Operators", () => {
  describe("eq operator", () => {
    it("should create a correct equals condition", () => {
      const condition = eq("status", "ACTIVE");

      expect(condition).toEqual({
        type: "eq",
        attr: "status",
        value: "ACTIVE",
      });
    });

    it("should work with numeric values", () => {
      const condition = eq("age", 30);

      expect(condition).toEqual({
        type: "eq",
        attr: "age",
        value: 30,
      });
    });

    it("should work with boolean values", () => {
      const condition = eq("active", true);

      expect(condition).toEqual({
        type: "eq",
        attr: "active",
        value: true,
      });
    });
  });

  describe("ne operator", () => {
    it("should create a correct not equals condition", () => {
      const condition = ne("status", "DELETED");

      expect(condition).toEqual({
        type: "ne",
        attr: "status",
        value: "DELETED",
      });
    });
  });

  describe("lt operator", () => {
    it("should create a correct less than condition", () => {
      const condition = lt("age", 18);

      expect(condition).toEqual({
        type: "lt",
        attr: "age",
        value: 18,
      });
    });
  });

  describe("lte operator", () => {
    it("should create a correct less than or equal condition", () => {
      const condition = lte("score", 100);

      expect(condition).toEqual({
        type: "lte",
        attr: "score",
        value: 100,
      });
    });
  });

  describe("gt operator", () => {
    it("should create a correct greater than condition", () => {
      const condition = gt("price", 50);

      expect(condition).toEqual({
        type: "gt",
        attr: "price",
        value: 50,
      });
    });
  });

  describe("gte operator", () => {
    it("should create a correct greater than or equal condition", () => {
      const condition = gte("quantity", 5);

      expect(condition).toEqual({
        type: "gte",
        attr: "quantity",
        value: 5,
      });
    });
  });

  describe("between operator", () => {
    it("should create a correct between condition", () => {
      const condition = between("age", 18, 65);

      expect(condition).toEqual({
        type: "between",
        attr: "age",
        value: [18, 65],
      });
    });
  });

  describe("isNull operator", () => {
    it("should create a correct is null condition", () => {
      const condition = isNull("deletedAt");

      expect(condition).toEqual({
        type: "eq",
        attr: "deletedAt",
        value: null,
      });
    });
  });

  describe("isNotNull operator", () => {
    it("should create a correct is not null condition", () => {
      const condition = isNotNull("email");

      expect(condition).toEqual({
        type: "ne",
        attr: "email",
        value: null,
      });
    });
  });
});
