/**
 * Balance parser unit tests.
 * Run: node --test test/
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { parseBalanceResponse } from "../lib/balance.js";

test("parses the official CNY payload", () => {
  const view = parseBalanceResponse({
    is_available: true,
    balance_infos: [
      { currency: "CNY", total_balance: "110.00", granted_balance: "10.00", topped_up_balance: "100.00" }
    ]
  });
  assert.deepEqual(view, {
    isAvailable: true,
    currency: "CNY",
    total: 110,
    granted: 10,
    toppedUp: 100
  });
});

test("prefers CNY over USD", () => {
  const view = parseBalanceResponse({
    is_available: true,
    balance_infos: [
      { currency: "USD", total_balance: "5.00", granted_balance: "0.00", topped_up_balance: "5.00" },
      { currency: "CNY", total_balance: "88.50", granted_balance: "8.50", topped_up_balance: "80.00" }
    ]
  });
  assert.equal(view.currency, "CNY");
  assert.equal(view.total, 88.5);
});

test("falls back to the first entry when no preferred currency", () => {
  const view = parseBalanceResponse({
    is_available: false,
    balance_infos: [{ currency: "USD", total_balance: "1.25", granted_balance: "0", topped_up_balance: "1.25" }]
  });
  assert.equal(view.currency, "USD");
  assert.equal(view.total, 1.25);
  assert.equal(view.isAvailable, false);
});

test("rejects malformed payloads", () => {
  assert.equal(parseBalanceResponse(null), null);
  assert.equal(parseBalanceResponse({}), null);
  assert.equal(parseBalanceResponse({ balance_infos: [] }), null);
  assert.equal(parseBalanceResponse({ balance_infos: [{ currency: 42 }] }), null);
  assert.equal(parseBalanceResponse("nope"), null);
});

test("tolerates missing/garbage balance fields as zero", () => {
  const view = parseBalanceResponse({
    is_available: true,
    balance_infos: [{ currency: "CNY" }]
  });
  assert.equal(view.total, 0);
  assert.equal(view.granted, 0);
  assert.equal(view.toppedUp, 0);
  const weird = parseBalanceResponse({
    is_available: true,
    balance_infos: [{ currency: "CNY", total_balance: "abc", granted_balance: "-3", topped_up_balance: "1e5" }]
  });
  assert.equal(weird.total, 0);
  assert.equal(weird.granted, 0);
  assert.equal(weird.toppedUp, 100000);
});
