#!/usr/bin/env node
// Run once: node scripts/generate-vapid.mjs
// Copy the output into .env.local and .env.prod

import { createRequire } from "module";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(join(__dirname, "../apps/web/package.json"));
const webpush = require("web-push");

const keys = webpush.generateVAPIDKeys();
console.log("Add these to your .env files:\n");
console.log(`VAPID_PUBLIC_KEY=${keys.publicKey}`);
console.log(`VAPID_PRIVATE_KEY=${keys.privateKey}`);
console.log(`NEXT_PUBLIC_VAPID_PUBLIC_KEY=${keys.publicKey}`);
