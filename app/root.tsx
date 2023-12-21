/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Ian Lucas. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation
} from "@remix-run/react";

import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { ClientOnly } from "remix-utils/client-only";
import { findRequestUser } from "./auth.server";
import { getBackground } from "./preferences/background.server";
import { Background } from "./components/background";
import { Footer } from "./components/footer";
import { Header } from "./components/header";
import { Inventory } from "./components/inventory";
import { RootProvider } from "./components/root-context";
import { SyncWarn } from "./components/sync-warn";
import { MAX_INVENTORY_ITEMS, NAMETAG_DEFAULT_ALLOWED } from "./env.server";
import { getSession } from "./session.server";
import styles from "./tailwind.css";
import { getLanguage } from "./preferences/language.server";

const bodyFontUrl =
  "https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,400;0,800;1,700&display=swap";

const displayFontUrl =
  "https://fonts.googleapis.com/css2?family=Exo+2:wght@300;400;600&display=swap";

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  { rel: "preconnect", href: "https://fonts.gstatic.com" },
  { rel: "stylesheet", href: bodyFontUrl },
  { rel: "stylesheet", href: displayFontUrl },
  { rel: "stylesheet", href: styles }
];

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const ipCountry = request.headers.get("CF-IPCountry");
  return typedjson({
    maxInventoryItems: MAX_INVENTORY_ITEMS,
    nametagDefaultAllowed: NAMETAG_DEFAULT_ALLOWED,
    user: await findRequestUser(request),
    ...(await getBackground(session)),
    ...(await getLanguage(session, ipCountry))
  });
}

export default function App() {
  const location = useLocation();
  const providerProps = useTypedLoaderData<typeof loader>();
  const showInventory = location.pathname !== "/api";

  return (
    <RootProvider {...providerProps}>
      <html lang="en" onContextMenu={(event) => event.preventDefault()}>
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <Meta />
          <Links />
        </head>
        <body className="overflow-y-scroll bg-stone-800">
          <div
            className="fixed left-0 top-0 -z-10 h-full w-full overflow-hidden lg:blur-sm"
            id="background"
          />
          <Background />
          {showInventory && <ClientOnly children={() => <SyncWarn />} />}
          <Header />
          {showInventory && <ClientOnly children={() => <Inventory />} />}
          <Outlet />
          <Footer />
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </body>
      </html>
    </RootProvider>
  );
}
