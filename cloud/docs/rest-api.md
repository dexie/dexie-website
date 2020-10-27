---
layout: docs-dexie-cloud
title: "Dexie Cloud REST API"
---

This doc page is under construction.

This page documents the REST API that every database in Dexie Cloud has.

## Endpoints

| [/authorize](#authorize) | Authorize endpoint |
| [/token](#token) | Token endpoint |

### /token

| Method | POST |
| Parameters | `{endpointId?: string, name?: string, email?: string, otp?: string}`|
| Authentication | Either Basic or none (see explanation below) |

Request a token for the calling endpoint. This method can be called directly from web clients or from a server. When called from a web client, authorization must always be done using a email verification flow (see below). When called from another server, authentication can be done using an Authorization header with basic authentication from ClientID and ClientSecret.

#### Email Verification Flow

1. Web client:
   ```http
   POST /token
   Content-Type: application/json

   {"endpointId": null}
   ```
2. Dexie Cloud responds:

   ```http
   HTTP/1.1 200 OK
   Content-Type: application/json

   {
     "endpointId": "xyz",
     "type": "email",
     "title": "Login",
     "fields": [{
       "name": "email",
       "type": "text",
       "title": "Enter email address"
     }]
   }
   ```

3. Web Client stores the endpointId given to it and
   prompts user for requested email address and then sends:

   ```http
   POST /token
   Content-Type: application/json

   {
     "endpointId": "xyz",
     "email": "foo@bar.com"
   }
   ```

4. Dexie Cloud optionally requires a captcha challenge:

   ```http
   HTTP/1.1 200 OK
   Content-Type: application/json

   {
     "endpointId": "xyz",
     "type": "captcha",
     "title": "Captcha",
     "fields": [{
       "name": "captcha",
       "type": "captcha",
       "title": "Please repeat the characters on image"
       "value": "data:image/svg;base64,R0lGODlhEAAQAMQAAORHHOVSKudfOulrSOp3WOyDZu6QdvCchPGolfO0o..."
     }]
   }
   ```

4. Web Client shows captcha image to user and asks for the plain text, then sends:

   ```http
   POST /token
   Content-Type: application/json

   {
     "endpointId": "xyz",
     "email": "foo@bar.com"
   }
   ```
4. Dexie Cloud generates an OTP "ABC123" and sends it via email.
   The HTTP response becomes:

   ```http
   HTTP/1.1 200 OK
   Content-Type: application/json

   {
     "endpointId": "xyz",
     "type": "otp",
     "title": "OTP",
     "fields": [{
       "name": "otp",
       "type": "text",
       "title": "Enter OTP"
     }]
   }
   ```

5. Web Client:

   ```http
   POST /token
   Content-Type: application/json

   {
     "endpointId": "xyz",
     "email": "foo@bar.com",
     "otp": "ABC123"
   }
   ```

6. Dexie Cloud verifies the OTP.
   On successful verification:

   ```http
   HTTP/1.1 200 OK
   Content-Type: application/json

   {
     "endpointId": "xyz",
     "type": "otp",
     "title": "OTP",
     "fields": [{
       "name": "otp",
       "type": "text",
       "title": "Enter OTP"
     }]
   }

   ```

See [Tokens](authentication#tokens)
