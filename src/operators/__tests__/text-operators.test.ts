import { describe, expect, it } from "vitest";
import { createCQLContext } from "../../cql-context";
import { contains, like } from "../text-operators";

describe("Text Operators", () => {
  const ctx = createCQLContext();

  describe("like operator", () => {
    it("should generate correct CQL for a LIKE condition", () => {
      const condition = like("name", "A%");
      expect(condition.toCQL(ctx)).toBe("name LIKE 'A%'");
    });

    it("should generate correct CQL for more complex patterns", () => {
      const condition = like("email", "%.com");
      expect(condition.toCQL(ctx)).toBe("email LIKE '%.com'");
    });
  });

  describe("contains operator", () => {
    it("should generate correct CQL for a contains condition", () => {
      const condition = contains("description", "important");
      expect(condition.toCQL(ctx)).toBe("description LIKE '%important%'");
    });
  });
});
