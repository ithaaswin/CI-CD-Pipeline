#!/usr/bin/python3
# sys.argv[1] - To Address
# sys.argv[2] - From Address
# sys.argv[3] - Email Token
# sys.argv[4] - Path of Repo
# sys.argv[5] - Path of Code Coverage File
# sys.argv[6] - True/False

import email, smtplib, ssl, sys
from email import encoders
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase

subject = "Code Coverage Results for the repository " + sys.argv[4]
if sys.argv[6]=="True":
    body = "The Code Coverage is ABOVE required threshold. Permitted to DEPLOY the Application."
else:
    body = "The Code Coverage is LESS than the required threshold. Permission DENIED to deploy."

fromEmail = sys.argv[2]
receiverEmail = sys.argv[1]
password = sys.argv[3]

# Create a multipart message and set headers
message = MIMEMultipart()
message["From"] = fromEmail
message["To"] = receiverEmail
message["Subject"] = subject

# Add body to email
message.attach(MIMEText(body, "plain"))

filename = sys.argv[4]+"/"+sys.argv[5]  # In same directory as script

# Open PDF file in binary mode
with open(filename, "rb") as attachment:
    # Add file as application/octet-stream
    # Email client can usually download this automatically as attachment
    part = MIMEBase("application", "octet-stream")
    part.set_payload(attachment.read())

# Encode file in ASCII characters to send by email    
encoders.encode_base64(part)

# Add header as key/value pair to attachment part
part.add_header(
    "Content-Disposition",
    f"attachment; filename= {filename}",
)

# Add attachment to message and convert message to string
message.attach(part)
text = message.as_string()

# Log in to server using secure context and send email
context = ssl.create_default_context()
with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as server:
    server.login(fromEmail, password)
    server.sendmail(fromEmail, receiverEmail, text)
