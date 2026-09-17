export interface EmailPreset {
  id: string;
  name: string;
  category: string;
  displayFrom: string;
  sender: string;
  replyTo?: string;
  subject: string;
  body: string;
  attackVector: string;
  expectedRisk: number;
}

export const EMAIL_PRESETS: EmailPreset[] = [
  {
    id: "eml-preset-1",
    name: "M365 Critical Session Expiry (AiTM Spearphish)",
    category: "Credential Harvester / Reverse Proxy",
    displayFrom: "Microsoft Security Team <no-reply@corp-notifications-m365.online>",
    sender: "no-reply@corp-notifications-m365.online",
    replyTo: "session-audit@corp-auth-verify.xyz",
    subject: "URGENT: Microsoft 365 Password & MFA Token Expires in 2 Hours",
    body: `Attention Employee,

Your Microsoft 365 Corporate Single Sign-On (SSO) certificate and Multi-Factor Authentication (MFA) session are scheduled to expire today at 18:00 UTC due to mandatory enterprise security rotation.

Failure to renew your credentials immediately will result in complete revocation of Outlook, Teams, SharePoint, and VPN access.

Please retain your session and authenticate through the authorized enterprise security gateway:
https://login.microsoftonline.corp-auth-verify.xyz/auth?session=m365_rotation_991

Do not share this link with unauthorized personnel.

IT & Corporate Infrastructure Security
Microsoft Global Enterprise Support`,
    attackVector: "Reverse-proxy AiTM Evilginx2 harvesting login credentials and session tokens to bypass 2FA",
    expectedRisk: 99,
  },
  {
    id: "eml-preset-2",
    name: "Urgent CEO Wire Transfer Request (Executive BEC)",
    category: "Business Email Compromise (BEC)",
    displayFrom: "Chief Executive Officer <ceo-direct-office@apple-executives-confidential.cloud>",
    sender: "ceo-direct-office@apple-executives-confidential.cloud",
    replyTo: "tim-cook-private-sec@protonmail.com",
    subject: "CONFIDENTIAL / TIME-SENSITIVE: Urgent Strategic Acquisition Wire Transfer",
    body: `Hi,

Are you currently at your desk and available to process a critical, time-sensitive transaction?

We are closing an off-market international IP acquisition today before market close. I need you to execute an immediate confidential wire transfer of $142,500 to our escrow attorney's designated account.

Due to confidential non-disclosure agreements with SEC regulators, please do not discuss this with anyone in the office or call my phone as I am in an executive board meeting. 

Reply directly to this email so I can forward the wire routing details immediately.

Best regards,
Office of the Chief Executive Officer`,
    attackVector: "Asymmetric executive impersonation leveraging psychological pressure and social engineering without embedded malware links",
    expectedRisk: 94,
  },
  {
    id: "eml-preset-3",
    name: "DocuSign Overdue Payment Invoice (Malware Dropper)",
    category: "Malware Dropper & Fraud",
    displayFrom: "DocuSign Security Notification <service@docusign-verification-portal.top>",
    sender: "service@docusign-verification-portal.top",
    replyTo: "invoicing-dispute@accounting-portal.top",
    subject: "Review Document: Final Notice - Outstanding Vendor Invoice #INV-884920",
    body: `DocuSign Electronic Signature Notification

You have received an encrypted document from Global Accounts Payable:
"Final Notice - Unpaid Services Invoice #INV-884920.pdf"

Amount Due: $24,850.00 USD
Payment Status: Overdue (Legal Escrow Pending)

Please review and countersign the attached verification release immediately:
https://docusign-view-encrypted-invoice.top/review?doc_id=98412894102

This link is secured with 256-bit encryption and will expire in 24 hours.

Powered by DocuSign Digital Trust Services`,
    attackVector: "Spoofed signature notification with high-risk TLD directing victim to credential harvesting dropper",
    expectedRisk: 96,
  },
  {
    id: "eml-preset-4",
    name: "Legitimate Corporate Benefits Enrollment (Safe Baseline)",
    category: "Clean / Legitimate",
    displayFrom: "People & HR Operations <hr@company.com>",
    sender: "hr@company.com",
    replyTo: "hr@company.com",
    subject: "Annual Open Enrollment: 2026 Health & Dental Benefits Guide",
    body: `Hello Team,

Open enrollment for your 2026 healthcare, dental, and vision coverage begins next Monday, October 1st, and will run through October 31st.

Please take a few moments to review our updated summary of benefits on the internal employee intranet portal:
https://google.com

If you have questions regarding FSA deductions or dependents coverage, feel free to drop by the HR lounge on the 4th floor or reply directly to this email.

Warm regards,
People Operations Team`,
    attackVector: "Clean internal corporate announcement with valid domain reputation and zero deceptive markers",
    expectedRisk: 2,
  },
];
