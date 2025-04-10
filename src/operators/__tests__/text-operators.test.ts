import { describe, it, expect } from "vitest";
import { like, contains } from "../text-operators";

describe("Text Operators", () => {
  describe("like operator", () => {
    it("should create a correct LIKE condition", () => {
      const condition = like("name", "A%");

      expect(condition).toEqual({
        type: "like",
        attr: "name",
        value: "A%",
      });
    });

    it("should work with more complex patterns", () => {
      const condition = like("email", "%.com");

      expect(condition).toEqual({
        type: "like",
        attr: "email",
        value: "%.com",
      });
    });
  });

  describe("contains operator", () => {
    it("should create a correct contains condition", () => {
      const condition = contains("description", "important");

      expect(condition).toEqual({
        type: "contains",
        attr: "description",
        value: "important",
      });
    });
  });
});
