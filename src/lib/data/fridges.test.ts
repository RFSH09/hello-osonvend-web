import { afterEach, describe, expect, it, vi } from "vitest";
import { FRIDGES, findFridge, hasCoords } from "./fridges";

describe("real fridges", () => {
  it("has the 25 real fridges keyed by their QR id", () => {
    expect(FRIDGES).toHaveLength(25);
    expect(new Set(FRIDGES.map((f) => f.id)).size).toBe(25);
    expect(findFridge("W0016188")?.name).toBe("MKB Amaliyot");
    expect(findFridge("w0016188")?.id).toBe("W0016188");
  });

  it("is staff-only and has no coordinates yet", () => {
    expect(FRIDGES.every((f) => f.access === "staff")).toBe(true);
    expect(FRIDGES.some(hasCoords)).toBe(false);
  });

  it("numbers repeated types in list order", () => {
    const banks = FRIDGES.filter((f) => f.type === "bank").map((f) => f.typeIndex);
    expect(banks).toEqual([1, 2, 3]);
    expect(FRIDGES.filter((f) => f.type === "university").map((f) => f.typeIndex)).toEqual([1, 2]);
  });
});

describe("unknown keys", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("return null in production", () => {
    vi.stubEnv("NODE_ENV", "production");
    expect(findFridge("W1234567")).toBeNull();
    expect(findFridge("nope")).toBeNull();
  });

  it("return a mock fridge in development only", () => {
    vi.stubEnv("NODE_ENV", "development");
    expect(findFridge("W1234567")?.id).toBe("W1234567");
    expect(findFridge("nope")).toBeNull();
  });
});
