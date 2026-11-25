/**
 * Prefix for files in /public. Empty normally; "/hello-osonvend-web" in the GitHub Pages build
 * (NEXT_PUBLIC_BASE_PATH), because Pages serves the site from a sub-path.
 */
export const asset = (path: string) => `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;
