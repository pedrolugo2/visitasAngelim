/**
 * Standalone test script for SMTP2GO email sending.
 *
 * Usage:
 *   SMTP2GO_API_KEY="your-key" SENDER_EMAIL="noreply@escolaangelim.com.br" npx tsx scripts/test-email.ts
 *
 * Optional env vars:
 *   TEST_RECIPIENT  — email address to send to (defaults to SENDER_EMAIL)
 */

const SMTP2GO_API_URL = "https://api.smtp2go.com/v3/email/send";
const SMTP2GO_API_KEY = process.env.SMTP2GO_API_KEY || "";
const SENDER_EMAIL =
  process.env.SENDER_EMAIL || "noreply@escolaangelim.com.br";
const TEST_RECIPIENT = process.env.TEST_RECIPIENT || SENDER_EMAIL;

// ── Preflight checks ──────────────────────────────────────────────────
function preflightChecks(): boolean {
  let ok = true;

  if (!SMTP2GO_API_KEY) {
    console.error("❌ SMTP2GO_API_KEY is empty — set it as an env var.");
    ok = false;
  } else {
    console.log(
      `✅ SMTP2GO_API_KEY is set (starts with "${SMTP2GO_API_KEY.slice(0, 8)}…")`
    );
  }

  if (!SENDER_EMAIL) {
    console.error("❌ SENDER_EMAIL is empty.");
    ok = false;
  } else {
    console.log(`✅ SENDER_EMAIL = ${SENDER_EMAIL}`);
  }

  console.log(`📬 TEST_RECIPIENT = ${TEST_RECIPIENT}`);

  return ok;
}

// ── Test 1: API key validation ────────────────────────────────────────
async function testApiKeyValid(): Promise<boolean> {
  console.log("\n── Test 1: Validate API key ──");
  try {
    // SMTP2GO doesn't have a dedicated "validate key" endpoint,
    // so we send a minimal request and inspect the response.
    const res = await fetch(SMTP2GO_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({
        api_key: SMTP2GO_API_KEY,
        sender: `Test <${SENDER_EMAIL}>`,
        to: [TEST_RECIPIENT],
        subject: "[TEST] API key validation — ignore",
        html_body: "<p>API key validation test</p>",
      }),
    });

    console.log(`   HTTP status: ${res.status} ${res.statusText}`);
    const body = await res.json();
    console.log("   Response body:", JSON.stringify(body, null, 2));

    if (!res.ok) {
      console.error(`❌ API returned non-OK status ${res.status}`);
      return false;
    }

    if (body.data?.failed > 0) {
      console.error(`❌ Delivery failures: ${body.data.failures.join(", ")}`);
      return false;
    }

    console.log("✅ API accepted the request — email queued.");
    return true;
  } catch (err) {
    console.error("❌ Network / fetch error:", err);
    return false;
  }
}

// ── Test 2: Sender domain verification ────────────────────────────────
async function testSenderDomain(): Promise<boolean> {
  console.log("\n── Test 2: Check sender domain ──");

  const domain = SENDER_EMAIL.split("@")[1];
  console.log(`   Sender domain: ${domain}`);

  // Check if domain can be resolved (basic DNS check)
  try {
    const res = await fetch(`https://dns.google/resolve?name=${domain}&type=MX`);
    const data = (await res.json()) as { Answer?: Array<{ data: string }> };
    if (data.Answer && data.Answer.length > 0) {
      console.log(
        `✅ MX records found for ${domain}:`,
        data.Answer.map((r: { data: string }) => r.data)
      );
    } else {
      console.warn(
        `⚠️  No MX records found for ${domain}. SMTP2GO may reject emails from this domain.`
      );
    }
  } catch {
    console.warn("⚠️  Could not check DNS — skipping MX validation.");
  }

  // Check SMTP2GO sender verification via their API
  try {
    const res = await fetch("https://api.smtp2go.com/v3/domain/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({ api_key: SMTP2GO_API_KEY }),
    });
    const body = await res.json();
    console.log(
      "   SMTP2GO domain/verify response:",
      JSON.stringify(body, null, 2)
    );
    return true;
  } catch {
    console.warn("⚠️  Could not query SMTP2GO domain/verify endpoint.");
    return true; // non-fatal
  }
}

// ── Test 3: Send a real test email ────────────────────────────────────
async function testSendRealEmail(): Promise<boolean> {
  console.log("\n── Test 3: Send a real confirmation-style email ──");

  const now = new Date();
  const payload = {
    api_key: SMTP2GO_API_KEY,
    sender: `Escola Angelim <${SENDER_EMAIL}>`,
    to: [TEST_RECIPIENT],
    subject: `[TESTE] Confirmação de Visita — ${now.toISOString()}`,
    html_body: `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"></head>
      <body style="font-family: Arial, sans-serif; color: #3E2723;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #5B8C5A; color: #FDF8F0; padding: 20px; text-align: center;">
            <h1>Escola Angelim</h1>
          </div>
          <div style="padding: 30px;">
            <h2>Email de Teste</h2>
            <p>Este é um email de teste enviado em <strong>${now.toLocaleString("pt-BR")}</strong>.</p>
            <p>Se você recebeu este email, a integração com SMTP2GO está funcionando.</p>
            <ul>
              <li><strong>API Key:</strong> ${SMTP2GO_API_KEY.slice(0, 8)}…</li>
              <li><strong>Sender:</strong> ${SENDER_EMAIL}</li>
              <li><strong>Recipient:</strong> ${TEST_RECIPIENT}</li>
            </ul>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  console.log("   Sending to:", TEST_RECIPIENT);
  console.log("   Payload size:", JSON.stringify(payload).length, "bytes");

  try {
    const res = await fetch(SMTP2GO_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    console.log(`   HTTP status: ${res.status} ${res.statusText}`);
    const body = await res.json();
    console.log("   Full response:", JSON.stringify(body, null, 2));

    if (!res.ok) {
      console.error(`❌ HTTP error ${res.status}`);
      return false;
    }

    if (body.data?.succeeded > 0) {
      console.log(
        `✅ Email sent successfully! email_id=${body.data.email_id}`
      );
      console.log("   Check your inbox (and spam folder) for the test email.");
      return true;
    }

    if (body.data?.failed > 0) {
      console.error(`❌ Failures: ${body.data.failures.join(", ")}`);
      return false;
    }

    console.warn("⚠️  Unexpected response shape — check manually.");
    return false;
  } catch (err) {
    console.error("❌ Fetch error:", err);
    return false;
  }
}

// ── Main ──────────────────────────────────────────────────────────────
async function main() {
  console.log("═══════════════════════════════════════════════");
  console.log("  SMTP2GO Email Integration Test");
  console.log("═══════════════════════════════════════════════\n");

  if (!preflightChecks()) {
    console.error(
      "\n🛑 Preflight checks failed. Fix the issues above and retry."
    );
    process.exit(1);
  }

  const results: Record<string, boolean> = {};

  results["API key validation"] = await testApiKeyValid();
  results["Sender domain check"] = await testSenderDomain();
  results["Send real email"] = await testSendRealEmail();

  console.log("\n═══════════════════════════════════════════════");
  console.log("  Summary");
  console.log("═══════════════════════════════════════════════");
  for (const [name, passed] of Object.entries(results)) {
    console.log(`  ${passed ? "✅" : "❌"} ${name}`);
  }

  const allPassed = Object.values(results).every(Boolean);
  if (!allPassed) {
    console.log("\n🔍 Common issues:");
    console.log("  1. API key is invalid or expired — check SMTP2GO dashboard");
    console.log(
      "  2. Sender domain not verified — add SPF/DKIM records in SMTP2GO"
    );
    console.log(
      "  3. Sender email not added as allowed sender in SMTP2GO settings"
    );
    console.log(
      "  4. Free tier limits exceeded — check SMTP2GO usage/billing"
    );
    console.log(
      "  5. Emails landing in spam — check recipient's spam/junk folder"
    );
  }

  process.exit(allPassed ? 0 : 1);
}

main();
