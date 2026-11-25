import { describe, expect, it } from "vitest";
import { formatNational, isCompletePhone, nationalDigits, toDisplayPhone } from "./phone";

describe("phone", () => {
  it("strips the country code and non-digits", () => {
    expect(nationalDigits("+998 94 403 16 11")).toBe("944031611");
    expect(nationalDigits("944031611")).toBe("944031611");
  });
  it("caps at 9 digits", () => {
    expect(nationalDigits("99894403161199")).toBe("944031611");
  });
  it("formats progressively", () => {
    expect(formatNational("9")).toBe("9");
    expect(formatNational("94403")).toBe("94 403");
    expect(formatNational("944031611")).toBe("94 403 16 11");
    expect(toDisplayPhone("944031611")).toBe("+998 94 403 16 11");
  });
  it("validates length", () => {
    expect(isCompletePhone("94403161")).toBe(false);
    expect(isCompletePhone("944031611")).toBe(true);
  });
});
