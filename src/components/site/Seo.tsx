import { useEffect } from "react";

export const SITE_URL = "https://novatoolsv1.freebuff.app";
export const SITE_NAME = "NovaTools";

function setMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(
    `meta[${attr}="${key}"]`,
  );
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

export type SeoProps = {
  title: string;
  description: string;
  /** Route path, e.g. "/maths" */
  path: string;
};

/**
 * Keeps the document title, meta description, canonical link and social tags in
 * sync with the active route. The app is a client-rendered SPA, so this is how
 * per-subject metadata stays clean without a server.
 */
export function Seo({ title, description, path }: SeoProps) {
  useEffect(() => {
    const url = `${SITE_URL}${path}`;
    document.title = title;

    setMeta("name", "description", description);
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:url", url);
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);

    let canonical = document.head.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]',
    );
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", url);
  }, [title, description, path]);

  return null;
}
