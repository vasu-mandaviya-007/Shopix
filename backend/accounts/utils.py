from django.core.mail import send_mail,EmailMultiAlternatives
from django.conf import settings
from django.template.loader import render_to_string

def send_otp_email(email, otp):
    subject = "Your Login OTP"
    message = f"Your OTP is {otp}. It is valid for 5 minutes." 
    from_email = settings.EMAIL_HOST_USER

    html_content = render_to_string("email/otp_send_email.html",{
        'otp' : otp,
        'project_name' : "Shopix"
    })

    email_to_send = EmailMultiAlternatives(subject,'',from_email,[email])

    email_to_send.attach_alternative(html_content, "text/html")

    # Send email
    email_to_send.send()

    
