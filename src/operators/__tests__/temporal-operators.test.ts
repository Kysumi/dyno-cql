import { describe, expect, it } from "vitest";
import { createCQLContext } from "../../cql-context";
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
} from "../temporal-operators";

describe("Temporal Operators", () => {
  const ctx = createCQLContext();

  describe("anyinteracts operator", () => {
    it("should generate correct CQL for anyinteracts with timestamp string", () => {
      const condition = anyinteracts("eventDate", "2023-01-01T00:00:00Z");
      expect(condition.toCQL(ctx)).toBe(
        "ANYINTERACTS(eventDate, TIMESTAMP('2023-01-01T00:00:00Z'))",
      );
    });

    it("should generate correct CQL for anyinteracts with Date object", () => {
      const date = new Date("2023-01-01T00:00:00Z");
      const condition = anyinteracts("eventDate", date);
      expect(condition.toCQL(ctx)).toBe(
        "ANYINTERACTS(eventDate, TIMESTAMP('2023-01-01T00:00:00.000Z'))",
      );
    });

    it("should generate correct CQL for anyinteracts with interval", () => {
      const condition = anyinteracts("eventDate", {
        start: "2023-01-01T00:00:00Z",
        end: "2023-12-31T23:59:59Z",
      });
      expect(condition.toCQL(ctx)).toBe(
        "ANYINTERACTS(eventDate, INTERVAL('2023-01-01T00:00:00Z', '2023-12-31T23:59:59Z'))",
      );
    });
  });

  describe("after operator", () => {
    it("should generate correct CQL for after with timestamp string", () => {
      const condition = after("eventDate", "2023-01-01T00:00:00Z");
      expect(condition.toCQL(ctx)).toBe(
        "AFTER(eventDate, TIMESTAMP('2023-01-01T00:00:00Z'))",
      );
    });

    it("should generate correct CQL for after with Date object", () => {
      const date = new Date("2023-06-15T12:00:00Z");
      const condition = after("eventDate", date);
      expect(condition.toCQL(ctx)).toBe(
        "AFTER(eventDate, TIMESTAMP('2023-06-15T12:00:00.000Z'))",
      );
    });

    it("should generate correct CQL for after with interval", () => {
      const condition = after("eventDate", {
        start: "2023-01-01",
        end: "2023-12-31",
      });
      expect(condition.toCQL(ctx)).toBe(
        "AFTER(eventDate, INTERVAL('2023-01-01', '2023-12-31'))",
      );
    });
  });

  describe("before operator", () => {
    it("should generate correct CQL for before with timestamp string", () => {
      const condition = before("eventDate", "2023-12-31T23:59:59Z");
      expect(condition.toCQL(ctx)).toBe(
        "BEFORE(eventDate, TIMESTAMP('2023-12-31T23:59:59Z'))",
      );
    });

    it("should generate correct CQL for before with Date object", () => {
      const date = new Date("2023-12-31T23:59:59Z");
      const condition = before("eventDate", date);
      expect(condition.toCQL(ctx)).toBe(
        "BEFORE(eventDate, TIMESTAMP('2023-12-31T23:59:59.000Z'))",
      );
    });
  });

  describe("begins operator", () => {
    it("should generate correct CQL for begins condition", () => {
      const condition = begins("eventPeriod", "2023-01-01T00:00:00Z");
      expect(condition.toCQL(ctx)).toBe(
        "BEGINS(eventPeriod, TIMESTAMP('2023-01-01T00:00:00Z'))",
      );
    });

    it("should work with interval", () => {
      const condition = begins("eventPeriod", {
        start: "2023-01-01",
        end: "2023-06-30",
      });
      expect(condition.toCQL(ctx)).toBe(
        "BEGINS(eventPeriod, INTERVAL('2023-01-01', '2023-06-30'))",
      );
    });
  });

  describe("begunby operator", () => {
    it("should generate correct CQL for a begunby condition", () => {
      const condition = begunby("eventPeriod", "2023-01-01T00:00:00Z");
      expect(condition.toCQL(ctx)).toBe(
        "BEGUNBY(eventPeriod, TIMESTAMP('2023-01-01T00:00:00Z'))",
      );
    });
  });

  describe("tcontains operator", () => {
    it("should generate correct CQL for a tcontains condition", () => {
      const condition = tcontains("eventPeriod", "2023-06-15T12:00:00Z");
      expect(condition.toCQL(ctx)).toBe(
        "TCONTAINS(eventPeriod, TIMESTAMP('2023-06-15T12:00:00Z'))",
      );
    });

    it("should work with interval", () => {
      const condition = tcontains("eventPeriod", {
        start: "2023-03-01",
        end: "2023-09-30",
      });
      expect(condition.toCQL(ctx)).toBe(
        "TCONTAINS(eventPeriod, INTERVAL('2023-03-01', '2023-09-30'))",
      );
    });
  });

  describe("during operator", () => {
    it("should generate correct CQL for a during condition", () => {
      const condition = during("eventDate", {
        start: "2023-01-01T00:00:00Z",
        end: "2023-12-31T23:59:59Z",
      });
      expect(condition.toCQL(ctx)).toBe(
        "DURING(eventDate, INTERVAL('2023-01-01T00:00:00Z', '2023-12-31T23:59:59Z'))",
      );
    });

    it("should work with Date objects in interval", () => {
      const start = new Date("2023-01-01");
      const end = new Date("2023-12-31");
      const condition = during("eventDate", { start, end });
      expect(condition.toCQL(ctx)).toBe(
        "DURING(eventDate, INTERVAL('2023-01-01T00:00:00.000Z', '2023-12-31T00:00:00.000Z'))",
      );
    });
  });

  describe("endedby operator", () => {
    it("should generate correct CQL for an endedby condition", () => {
      const condition = endedby("eventPeriod", "2023-12-31T23:59:59Z");
      expect(condition.toCQL(ctx)).toBe(
        "ENDEDBY(eventPeriod, TIMESTAMP('2023-12-31T23:59:59Z'))",
      );
    });
  });

  describe("ends operator", () => {
    it("should generate correct CQL for an ends condition", () => {
      const condition = ends("eventPeriod", "2023-12-31T23:59:59Z");
      expect(condition.toCQL(ctx)).toBe(
        "ENDS(eventPeriod, TIMESTAMP('2023-12-31T23:59:59Z'))",
      );
    });

    it("should work with interval", () => {
      const condition = ends("eventPeriod", {
        start: "2023-07-01",
        end: "2023-12-31",
      });
      expect(condition.toCQL(ctx)).toBe(
        "ENDS(eventPeriod, INTERVAL('2023-07-01', '2023-12-31'))",
      );
    });
  });

  describe("tequals operator", () => {
    it("should generate correct CQL for tequals with timestamp string", () => {
      const condition = tequals("eventDate", "2023-01-01T00:00:00Z");
      expect(condition.toCQL(ctx)).toBe(
        "TEQUALS(eventDate, TIMESTAMP('2023-01-01T00:00:00Z'))",
      );
    });

    it("should generate correct CQL for tequals with Date object", () => {
      const date = new Date("2023-01-01T00:00:00Z");
      const condition = tequals("eventDate", date);
      expect(condition.toCQL(ctx)).toBe(
        "TEQUALS(eventDate, TIMESTAMP('2023-01-01T00:00:00.000Z'))",
      );
    });

    it("should work with interval", () => {
      const condition = tequals("eventPeriod", {
        start: "2023-01-01",
        end: "2023-12-31",
      });
      expect(condition.toCQL(ctx)).toBe(
        "TEQUALS(eventPeriod, INTERVAL('2023-01-01', '2023-12-31'))",
      );
    });
  });

  describe("meets operator", () => {
    it("should generate correct CQL for a meets condition", () => {
      const condition = meets("eventPeriod", {
        start: "2023-07-01T00:00:00Z",
        end: "2023-12-31T23:59:59Z",
      });
      expect(condition.toCQL(ctx)).toBe(
        "MEETS(eventPeriod, INTERVAL('2023-07-01T00:00:00Z', '2023-12-31T23:59:59Z'))",
      );
    });
  });

  describe("metby operator", () => {
    it("should generate correct CQL for a metby condition", () => {
      const condition = metby("eventPeriod", {
        start: "2022-07-01T00:00:00Z",
        end: "2023-01-01T00:00:00Z",
      });
      expect(condition.toCQL(ctx)).toBe(
        "METBY(eventPeriod, INTERVAL('2022-07-01T00:00:00Z', '2023-01-01T00:00:00Z'))",
      );
    });
  });

  describe("toverlaps operator", () => {
    it("should generate correct CQL for a toverlaps condition", () => {
      const condition = toverlaps("eventPeriod", {
        start: "2023-06-01T00:00:00Z",
        end: "2023-12-31T23:59:59Z",
      });
      expect(condition.toCQL(ctx)).toBe(
        "TOVERLAPS(eventPeriod, INTERVAL('2023-06-01T00:00:00Z', '2023-12-31T23:59:59Z'))",
      );
    });

    it("should work with Date objects", () => {
      const start = new Date("2023-06-01");
      const end = new Date("2023-12-31");
      const condition = toverlaps("eventPeriod", { start, end });
      expect(condition.toCQL(ctx)).toBe(
        "TOVERLAPS(eventPeriod, INTERVAL('2023-06-01T00:00:00.000Z', '2023-12-31T00:00:00.000Z'))",
      );
    });
  });

  describe("overlappedby operator", () => {
    it("should generate correct CQL for an overlappedby condition", () => {
      const condition = overlappedby("eventPeriod", {
        start: "2022-06-01T00:00:00Z",
        end: "2023-06-30T23:59:59Z",
      });
      expect(condition.toCQL(ctx)).toBe(
        "OVERLAPPEDBY(eventPeriod, INTERVAL('2022-06-01T00:00:00Z', '2023-06-30T23:59:59Z'))",
      );
    });
  });

  describe("tintersects operator", () => {
    it("should generate correct CQL for tintersects with timestamp", () => {
      const condition = tintersects("eventDate", "2023-06-15T12:00:00Z");
      expect(condition.toCQL(ctx)).toBe(
        "TINTERSECTS(eventDate, TIMESTAMP('2023-06-15T12:00:00Z'))",
      );
    });

    it("should generate correct CQL for tintersects with interval", () => {
      const condition = tintersects("eventDate", {
        start: "2023-01-01T00:00:00Z",
        end: "2023-12-31T23:59:59Z",
      });
      expect(condition.toCQL(ctx)).toBe(
        "TINTERSECTS(eventDate, INTERVAL('2023-01-01T00:00:00Z', '2023-12-31T23:59:59Z'))",
      );
    });

    it("should work with Date object", () => {
      const date = new Date("2023-06-15T12:00:00Z");
      const condition = tintersects("eventDate", date);
      expect(condition.toCQL(ctx)).toBe(
        "TINTERSECTS(eventDate, TIMESTAMP('2023-06-15T12:00:00.000Z'))",
      );
    });
  });
});
