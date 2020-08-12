import { Base64 } from "js-base64";

/**
 * Build an email as an RFC 5322 formatted, Base64 encoded string
 * https://gist.github.com/tobymurray/ba8c9beada31152e56ee02b3cb66a51e
 */
export function createEmail(to: string, from: string, subject: string, message: string) {
  let email = ["Content-Type: text/plain; charset=\"UTF-8\"\n",
    "MIME-Version: 1.0\n",
    "Content-Transfer-Encoding: 7bit\n",
    "to: ", to, "\n",
    "from: ", from, "\n",
    "subject: ", subject, "\n\n",
    message
  ].join('');

  return Base64.encodeURI(email);
}
