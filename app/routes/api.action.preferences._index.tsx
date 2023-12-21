/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Ian Lucas. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect
} from "@remix-run/node";
import { z } from "zod";
import { authenticator } from "~/auth.server";
import { getAllowedBackgrounds } from "~/preferences/background.server";
import {
  getUserPreference,
  setUserPreference
} from "~/models/user-preferences.server";
import { assignToSession, commitSession, getSession } from "~/session.server";
import { getAllowedLanguages } from "~/preferences/language.server";

export const ApiActionPreferencesUrl = "/api/action/preferences";

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await authenticator.isAuthenticated(request);
  if (!userId) {
    return redirect("/");
  }
  const language = await getUserPreference(userId, "language");
  const background = await getUserPreference(userId, "background");
  const session = await getSession(request.headers.get("Cookie"));
  assignToSession(session, { background, language });
  return redirect("/", {
    headers: {
      "Set-Cookie": await commitSession(session)
    }
  });
}

export async function action({ request }: ActionFunctionArgs) {
  const userId = await authenticator.isAuthenticated(request);
  const { background, language } = z
    .object({
      background: z
        .string()
        .refine((background) => getAllowedBackgrounds().includes(background)),
      language: z
        .string()
        .refine((language) => getAllowedLanguages().includes(language))
    })
    .parse(Object.fromEntries(await request.formData()));
  if (userId) {
    await setUserPreference(userId, "language", language);
    await setUserPreference(userId, "background", background);
  }
  const session = await getSession(request.headers.get("Cookie"));
  assignToSession(session, { background, language });
  return new Response(null, {
    status: 204,
    headers: {
      "Set-Cookie": await commitSession(session)
    }
  });
}
