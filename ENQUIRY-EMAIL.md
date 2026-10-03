# Project Enquiry Email

## Vercel setup

Deploy this project root, including `api/send-enquiry.js`, to Vercel using its Node.js Functions runtime. No framework, build dependency, database, or Resend SDK is required. The route calls Resend's HTTPS REST API (`POST https://api.resend.com/emails`) using native server-side fetch.

Required server environment variables:
- `RESEND_API_KEY`
- `ENQUIRY_RECEIVER_EMAIL` (one recipient address)

Default sender: `Mohammed Aaris Portfolio <onboarding@resend.dev>`.
This testing sender can only send to the email address associated with the Resend account. If the receiver differs, verify a domain in Resend and set optional server-only `ENQUIRY_SENDER_EMAIL` to a real address on that verified domain. No custom address is assumed. Sender restrictions return `SENDER_VERIFICATION_REQUIRED`; provider error details and credentials are never returned.

Redeploy after changing production environment variables. A static file preview cannot execute `/api/send-enquiry`; use Vercel or `vercel dev` with development env variables for live integration testing. Nothing in this change deploys automatically or changes your production settings.

## Flow and limits

Send Enquiry validates, uses the existing PDF generator, then posts the current enquiry and base64 PDF to the same-origin endpoint without downloading it. No WhatsApp tab, mail client, or redirect is opened. A successful response displays the confirmation for five seconds, then hides it. Resend acceptance means queued for delivery, not guaranteed inbox delivery; inspect Resend's delivery/bounce status for confirmation.

PDFs are limited to 2 MiB, with a 3 MiB JSON body limit below Vercel's 4.5 MB request limit. The endpoint checks method, origin, JSON, required customer fields, summary fields, filename, base64 encoding, PDF MIME type, signature and end marker. These file checks are not antivirus scanning. Recipient and sender are server-controlled; clients cannot choose a destination.

Sending disables the actions to prevent concurrent submissions. Failure restores Send Enquiry for retry and preserves draft/session data. Each submission generates a PDF from the current enquiry; identical Resend payloads use a deterministic idempotency key (Resend retains keys for 24 hours). The separate Download PDF action generates and downloads a PDF without sending email.

No customer data, PDF contents, or credentials are logged. The endpoint is public, not authenticated: origin checks are browser safeguards, not bot protection. Configure Vercel Firewall rate limiting for `/api/send-enquiry` before public promotion to mitigate automated spam without adding a database.

## Verification

- `node enquiry-email-check.cjs`: mocked Resend route tests; never sends real mail.
- `node enquiry-pdf-check.cjs`: browser flow, PDF, retry and responsive tests with mocked email responses.
- Live acceptance checklist: submit a test enquiry, confirm the email and PDF attachment in the owner inbox, confirm the five-second success message and absence of automatic downloads or navigation, then check Resend delivery status. The deployed environment and verified-domain/account restrictions cannot be confirmed by mocked local tests.

References: https://resend.com/docs/api-reference/emails/send-email, https://resend.com/docs/knowledge-base/403-error-resend-dev-domain, https://resend.com/docs/dashboard/emails/idempotency-keys, https://vercel.com/docs/functions/limitations.
