const { createHash } = require('node:crypto');

const MAX_PDF_BYTES = 2 * 1024 * 1024;
const MAX_BODY_BYTES = 3 * 1024 * 1024;
const emailPattern = /^[^\s<>@,;]+@[^\s<>@,;]+\.[^\s<>@,;]+$/;
const field = value => typeof value === 'string' && value.length <= 1000 && !/[\r\n\x00]/.test(value);

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  const fail = (status, code) => res.status(status).json({ ok: false, code });
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return fail(405, 'METHOD_NOT_ALLOWED');
  }
  if (!/^application\/json(?:;|$)/i.test(req.headers['content-type'] || '')) return fail(415, 'JSON_REQUIRED');
  if (req.headers['sec-fetch-site'] === 'cross-site') return fail(403, 'ORIGIN_NOT_ALLOWED');
  if (req.headers.origin) {
    try {
      if (new URL(req.headers.origin).host !== req.headers.host) return fail(403, 'ORIGIN_NOT_ALLOWED');
    } catch { return fail(403, 'ORIGIN_NOT_ALLOWED'); }
  }
  if (Number(req.headers['content-length']) > MAX_BODY_BYTES) return fail(413, 'PAYLOAD_TOO_LARGE');
  let body;
  try {
    const raw = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    if (!raw || Buffer.byteLength(raw) > MAX_BODY_BYTES) return fail(413, 'PAYLOAD_TOO_LARGE');
    body = JSON.parse(raw);
  } catch { return fail(400, 'INVALID_JSON'); }
  const { enquiry, pdf } = body || {};
  const customer = enquiry?.customer;
  const appointment = enquiry?.appointment;
  if (!customer || !field(customer.name) || !customer.name.trim() || customer.name.length > 200 ||
      !field(customer.email) || customer.email.length > 254 || !emailPattern.test(customer.email)) return fail(400, 'INVALID_CUSTOMER');
  const summaryValues = [customer.phone, customer.company, customer.location, enquiry.projectType,
    enquiry.websiteType, enquiry.designStyle, appointment?.date, appointment?.time, appointment?.mode];
  if (summaryValues.some(value => value != null && !field(value))) return fail(400, 'INVALID_ENQUIRY');
  if (!pdf || pdf.contentType !== 'application/pdf' || typeof pdf.base64 !== 'string' ||
      !/^Mohammed-Aaris-Project-Enquiry-[A-Za-z0-9-]+-\d{4}-\d{2}-\d{2}\.pdf$/.test(pdf.filename || '') ||
      pdf.filename.length > 160) return fail(400, 'INVALID_PDF');
  if (pdf.base64.length > Math.ceil(MAX_PDF_BYTES / 3) * 4) return fail(413, 'PDF_TOO_LARGE');
  if (!pdf.base64.length || pdf.base64.length % 4 || !/^[A-Za-z0-9+/]+={0,2}$/.test(pdf.base64)) return fail(400, 'INVALID_PDF');
  const bytes = Buffer.from(pdf.base64, 'base64');
  if (bytes.length > MAX_PDF_BYTES) return fail(413, 'PDF_TOO_LARGE');
  if (bytes.toString('base64') !== pdf.base64 || bytes.subarray(0, 5).toString() !== '%PDF-' ||
      !bytes.subarray(-1024).includes(Buffer.from('%%EOF'))) return fail(400, 'INVALID_PDF');

  const key = process.env.RESEND_API_KEY;
  const receiver = process.env.ENQUIRY_RECEIVER_EMAIL;
  const sender = process.env.ENQUIRY_SENDER_EMAIL || 'onboarding@resend.dev';
  if (!key || !receiver || !emailPattern.test(receiver) || !emailPattern.test(sender)) return fail(503, 'EMAIL_NOT_CONFIGURED');
  const value = input => input?.trim() || 'Not specified';
  const text = ['CUSTOMER', `Name: ${customer.name.trim()}`, `Email: ${customer.email}`,
    `Phone: ${value(customer.phone)}`, `Business: ${value(customer.company)}`, `Location: ${value(customer.location)}`,
    '', 'PROJECT', `Project Type: ${value(enquiry.projectType)}`, `Website Type: ${value(enquiry.websiteType)}`,
    `Design Style: ${value(enquiry.designStyle)}`, '', 'CONSULTATION', `Date: ${value(appointment?.date)}`,
    `Time: ${value(appointment?.time)}`, `Mode: ${value(appointment?.mode)}`,
    '', 'The complete Project Enquiry Report is attached as a PDF.'].join('\n');
  const email = {
    from: `Mohammed Aaris Portfolio <${sender}>`, to: [receiver], reply_to: customer.email,
    subject: `New Website Project Enquiry \u2014 ${customer.name.trim()}`, text,
    attachments: [{ filename: pdf.filename, content: pdf.base64, content_type: 'application/pdf' }]
  };
  // Identical retries reuse Resend's idempotency protection, without storing customer data.
  const idempotencyKey = 'enquiry-' + createHash('sha256').update(JSON.stringify(email)).digest('hex');
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST', headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', 'Idempotency-Key': idempotencyKey },
      body: JSON.stringify(email), signal: AbortSignal.timeout(15000)
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      const restriction = /verify|verified|domain|testing emails|own email/i.test(String(result.message || ''));
      if (restriction) return fail(503, 'SENDER_VERIFICATION_REQUIRED');
      if (response.status === 429) return fail(429, 'EMAIL_RATE_LIMITED');
      return fail(502, 'EMAIL_SEND_FAILED');
    }
    if (!result.id) return fail(502, 'EMAIL_SEND_FAILED');
    return res.status(200).json({ ok: true });
  } catch { return fail(502, 'EMAIL_SEND_FAILED'); }
};
