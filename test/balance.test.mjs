/**
 * Balance parser unit tests.
 * Run: node --test test/
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { BalanceFetcher, parseBalanceResponse } from "../lib/balance.js";

test("parses the official CNY payload", () => {
  const view = parseBalanceResponse({
    is_available: true,
    balance_infos: [
      { currency: "CNY", total_balance: "110.00", granted_balance: "10.00", topped_up_balance: "100.00" }
    ]
  });
  assert.deepEqual(view.cny, {
    isAvailable: true,
    currency: "CNY",
    total: 110,
    granted: 10,
    toppedUp: 100
  });
  assert.equal(view.usd, null);
});

test("parses both CNY and USD when both are present", () => {
  const view = parseBalanceResponse({
    is_available: true,
    balance_infos: [
      { currency: "CNY", total_balance: "88.50", granted_balance: "8.50", topped_up_balance: "80.00" },
      { currency: "USD", total_balance: "12.34", granted_balance: "1.00", topped_up_balance: "11.34" }
    ]
  });
  assert.equal(view.cny.total, 88.5);
  assert.equal(view.usd.total, 12.34);
  assert.equal(view.usd.currency, "USD");
  assert.equal(view.usd.granted, 1);
});

test("handles is_available false", () => {
  const view = parseBalanceResponse({
    is_available: false,
    balance_infos: [{ currency: "CNY", total_balance: "1.25", granted_balance: "0", topped_up_balance: "1.25" }]
  });
  assert.equal(view.cny.isAvailable, false);
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
  assert.equal(view.cny.total, 0);
  assert.equal(view.cny.granted, 0);
  assert.equal(view.cny.toppedUp, 0);
  const weird = parseBalanceResponse({
    is_available: true,
    balance_infos: [{ currency: "CNY", total_balance: "abc", granted_balance: "-3", topped_up_balance: "1e5" }]
  });
  assert.equal(weird.cny.total, 0);
  assert.equal(weird.cny.granted, 0);
  assert.equal(weird.cny.toppedUp, 100000);
});

test("keeps the last proven balance when a later refresh fails", async () => {
  const fetcher = new BalanceFetcher({
    resolveKey: async () => "unused",
    endpoint: "https://example.invalid/user/balance"
  });
  const proven = {
    cny: { isAvailable: true, currency: "CNY", total: 246.67, granted: 0, toppedUp: 246.67 },
    usd: null
  };
  let attempt = 0;
  fetcher.fetchOnce = async () => {
    attempt += 1;
    if (attempt === 1) return proven;
    throw new Error("temporary-timeout");
  };

  await fetcher.refresh();
  assert.equal(fetcher.getSnapshot().status, "ready");
  assert.deepEqual(fetcher.getSnapshot().balance, proven);

  await fetcher.refresh();
  assert.equal(fetcher.getSnapshot().status, "error");
  assert.equal(fetcher.getSnapshot().error, "temporary-timeout");
  assert.deepEqual(fetcher.getSnapshot().balance, proven);
});
