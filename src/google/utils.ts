import { Base64 } from "js-base64";
import { gmail_v1, google, people_v1 } from "googleapis";
import keys from "../config/keys";
import People = people_v1.People;
import Gmail = gmail_v1.Gmail;
import Schema$Person = people_v1.Schema$Person;
import { MessageInput } from "../graphql/graphql-root";

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

export function peopleService(): People {
  const auth = new google.auth.OAuth2(keys.googleClientId, keys.googleClientSecret, keys.googleAppCallback);
  auth.setCredentials(JSON.parse(keys.tempToken));
  try {
    return google.people({ version: "v1", auth })
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export async function allUsers(service: People, filter?: (person: Schema$Person) => boolean): Promise<{ email: string }[]> {
  const { data: { connections } } = await service.people.connections.list({
    resourceName: "people/me",
    personFields: "names,emailAddresses"
  });
  if (connections) {
    return connections
      .filter(person => person.emailAddresses && person.names && (filter ? filter(person) : true))
      .map(person => {
        return {
          email: person.emailAddresses?.[0].value!!
        }
      });
  } else {
    return [];
  }
}

export function gmailService(): Gmail {
  try {
    const auth = new google.auth.OAuth2(keys.googleClientId, keys.googleClientSecret, keys.googleAppCallback);
    auth.setCredentials(JSON.parse(keys.tempToken));
    return google.gmail({ version: 'v1', auth });
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export async function sendGmail(gmail: Gmail, emailAddress: string, messageInput: MessageInput) {
  return await gmail.users.messages.send({
    userId: "me",
    requestBody: {
      raw: createEmail(emailAddress, "me", messageInput.title, messageInput.body)
    }
  });
}
