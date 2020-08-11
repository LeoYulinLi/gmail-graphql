import { google } from "googleapis";

const SCOPES = [
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/contacts.readonly'
];

function getAuthUrl() {
  const oauth2Client = new google.auth.OAuth2(
    process.env["GOOGLE_CLIENT_ID"],
    process.env["GOOGLE_CLIENT_SECRET"],
    process.env["APP_REDIRECT_URL"]
  );
  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES
  });
}




