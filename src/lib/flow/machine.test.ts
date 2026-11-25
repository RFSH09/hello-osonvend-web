import { describe, expect, it } from "vitest";
import type { Order } from "@/lib/api/types";
import { flowReducer, initialFlow, type FlowState } from "./machine";

const order: Order = {
  id: "o1",
  fridgeId: "W0016188",
  status: "paid",
  method: "payme",
  createdAt: "2026-11-25T07:00:00Z",
  items: [{ productId: "snickers", qty: 1, price: 14000 }],
  total: 14000,
};

describe("flow state machine", () => {
  it("walks the happy path to a receipt", () => {
    let s: FlowState = initialFlow;
    s = flowReducer(s, { type: "START" });
    expect(s.name).toBe("unlocking");
    s = flowReducer(s, { type: "UNLOCKED" });
    expect(s.name).toBe("door_open");
    s = flowReducer(s, { type: "DOOR_CLOSED" });
    expect(s.name).toBe("processing");
    s = flowReducer(s, { type: "PAID", order });
    expect(s).toEqual({ name: "receipt", order });
  });

  it("ends in nothing_taken when no items were removed", () => {
    let s: FlowState = { name: "processing" };
    s = flowReducer(s, { type: "NOTHING_TAKEN" });
    expect(s.name).toBe("nothing_taken");
  });

  it("errors when the door does not unlock in time", () => {
    const s = flowReducer({ name: "unlocking" }, { type: "UNLOCK_TIMEOUT" });
    expect(s).toEqual({ name: "error", reason: "unlock_timeout" });
  });

  it("ignores events that are invalid for the current state", () => {
    expect(flowReducer({ name: "idle" }, { type: "DOOR_CLOSED" })).toEqual({ name: "idle" });
    expect(flowReducer({ name: "door_open" }, { type: "UNLOCKED" })).toEqual({ name: "door_open" });
  });

  it("keeps terminal states until RESET", () => {
    const done: FlowState = { name: "nothing_taken" };
    expect(flowReducer(done, { type: "START" })).toBe(done);
    expect(flowReducer(done, { type: "RESET" })).toEqual({ name: "idle" });
  });
});
