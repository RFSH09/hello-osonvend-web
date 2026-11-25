import { describe, expect, it } from "vitest";
import { formatPrice } from "./format";

describe("formatPrice", () => {
  it("groups thousands with spaces", () => {
    expect(formatPrice(18500)).toBe("18 500 so'm");
    expect(formatPrice(5000)).toBe("5 000 so'm");
    expect(formatPrice(1234567)).toBe("1 234 567 so'm");
  });
  it("handles small and zero", () => {
    expect(formatPrice(0)).toBe("0 so'm");
    expect(formatPrice(999)).toBe("999 so'm");
  });
  it("rounds and supports a custom unit", () => {
    expect(formatPrice(14000.4, "сўм")).toBe("14 000 сўм");
  });
});
