from app.models.mailer import MailerJob
from app.models.umami import Umami
from app.models.sender import Sender
from app.models.template import MailTemplate
from app.models.webhooks import WebhookRecipient
from app.core.send_email import send_email
from app.core.send_webhook import send_webhook
from app.core.umami import fetch_website_summary
from app.core.mail_template import render_mail_template
from sqlalchemy.orm import Session

def send_report(db: Session, job: MailerJob):
    """Creates and sends a report for a MailerJob via email and/or webhook."""

    # Load Umami instance
    instance: Umami = db.query(Umami).filter_by(id=job.host_id).first()
    if not instance:
        raise Exception(f"No Umami instance with ID {job.host_id} found.")

    # Fetch analytics summary
    summary = fetch_website_summary(instance, job.website_id)
    if not summary:
        raise Exception("No summary available.")

    # Load template
    template: MailTemplate = db.query(MailTemplate).filter_by(type=job.template_type, sender_type='email').first()
    if not template:
        raise Exception("No matching mail template found.")

    # Generate email body
    text_body = "No Plain Text Version available."
    html_body = render_mail_template(template.html, {
        "summary": summary,
        "job": job,
    })

    # --- Email report ---
    if job.sender_id and job.email_recipients:
        sender: Sender = db.query(Sender).filter_by(id=job.sender_id).first()
        if not sender:
            raise Exception(f"No sender with ID {job.sender_id} found.")
        send_email(
            sender=sender,
            to=job.email_recipients,
            subject=f"Umami Report for {instance.name} - {job.name}",
            body=text_body,
            html=html_body
        )

    # --- Webhook report ---
    if job.webhook_recipients:
        # Load all webhook recipients by ID
        webhook_ids = job.webhook_recipients  # List[int]
        recipients = db.query(WebhookRecipient).filter(WebhookRecipient.id.in_(webhook_ids)).all()
        if not recipients:
            raise Exception("No valid webhook recipients found.")
        for webhook in recipients:
            send_webhook(webhook, summary=summary, job=job)