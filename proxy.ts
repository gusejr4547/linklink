import { updateSession } from "@/lib/supabase/proxy";
import { type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * - manifest.webmanifest, icon, icons/*, apple-icon, opengraph-image
     *   (public metadata routes fetched without credentials by the browser —
     *   must stay reachable regardless of auth state, or manifest/icon
     *   parsing fails and PWA installability breaks)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|manifest\\.webmanifest$|icon$|icons/|apple-icon$|opengraph-image$|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
