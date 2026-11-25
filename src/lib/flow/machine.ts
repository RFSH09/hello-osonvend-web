import type { Order } from "@/lib/api/types";

export const UNLOCK_TIMEOUT_MS = 10_000;
export const DOOR_REMINDER_SEC = 60;

export type FlowState =
  | { name: "idle" }
  | { name: "unlocking" }
  | { name: "door_open" }
  | { name: "processing" }
  | { name: "receipt"; order: Order }
  | { name: "nothing_taken" }
  | { name: "error"; reason: "unlock_timeout" | "failed" };

export type FlowEvent =
  | { type: "START" }
  | { type: "UNLOCKED" }
  | { type: "UNLOCK_TIMEOUT" }
  | { type: "DOOR_CLOSED" }
  | { type: "PAID"; order: Order }
  | { type: "NOTHING_TAKEN" }
  | { type: "FAIL" }
  | { type: "RESET" }
  /** Dev panel only: jump straight to a state. */
  | { type: "FORCE"; state: FlowState };

export const initialFlow: FlowState = { name: "idle" };

/** idle -> unlocking -> door_open -> processing -> receipt | nothing_taken | error */
export function flowReducer(state: FlowState, event: FlowEvent): FlowState {
  if (event.type === "RESET") return initialFlow;
  if (event.type === "FORCE") return event.state;

  switch (state.name) {
    case "idle":
      return event.type === "START" ? { name: "unlocking" } : state;
    case "unlocking":
      if (event.type === "UNLOCKED") return { name: "door_open" };
      if (event.type === "UNLOCK_TIMEOUT") return { name: "error", reason: "unlock_timeout" };
      if (event.type === "FAIL") return { name: "error", reason: "failed" };
      return state;
    case "door_open":
      if (event.type === "DOOR_CLOSED") return { name: "processing" };
      if (event.type === "FAIL") return { name: "error", reason: "failed" };
      return state;
    case "processing":
      if (event.type === "PAID") return { name: "receipt", order: event.order };
      if (event.type === "NOTHING_TAKEN") return { name: "nothing_taken" };
      if (event.type === "FAIL") return { name: "error", reason: "failed" };
      return state;
    default:
      return state; // receipt / nothing_taken / error are terminal until RESET
  }
}
