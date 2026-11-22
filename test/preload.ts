// Runs before every test file: point the hub at a throwaway home/data dir so no test can touch a real ~/.noop or ~/.agent-hub.
import { setDefaultTimeout } from "bun:test";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

// Self-update validates a release by running the whole suite on whatever load the host has; on a busy Mac that is
// load 100–280 with Spotlight and the owner's apps competing for the disk. A 5 s default then fails tests that do no
// work themselves: a beforeEach hook and sub-second secrets/guest tests timed out here while passing alone, and each
// such run rolled a valid release back. Give every test and hook room for a host stall; tests that need real
// wall-clock budget (fleet day, git spawns, login shells, worker subprocesses) still set their own.
setDefaultTimeout(60_000);

const W = mkdtempSync(join(tmpdir(), "hub-test-"));
process.env.NOOP_HOME = join(W, "home");
process.env.HUB_DATA = join(W, "data");
process.env.HUB_SYNC = "local";
