import { describe, expect, it } from "vitest";
import { resolveLegacyUrl } from "./legacy-urls";

describe("oude WordPress-adressen", () => {
  it.each([
    ["/nieuwbouw/", "/projecten/nieuwbouw-zutphen/"],
    ["/nieuwbouw", "/projecten/nieuwbouw-zutphen/"],
    ["/nieuwbouw-schuytgraaf/", "/projecten/nieuwbouw-schuytgraaf-arnhem/"],
    ["/renovatie-elst/", "/projecten/dakrenovatie-elst/"],
    ["/Renovatie-Elst/", "/projecten/dakrenovatie-elst/"],
    ["/home/", "/"],
    ["/home-two/", "/"],
    ["/home-four/", "/"],
    ["/sample-page/", "/"],
    ["/services-details/", "/diensten/"],
    ["/project-details/", "/projecten/"],
    ["/team/", "/over-ons/"],
    ["/team-details/", "/over-ons/"],
    ["/wp-sitemap.xml", "/sitemap.xml"],
    ["/wp-sitemap-posts-post-1.xml", "/sitemap.xml"],
  ])("stuurt %s door naar %s", (from, to) => {
    expect(resolveLegacyUrl(from)).toEqual({ type: "redirect", to });
  });

  it.each([
    "/hello-world/",
    "/twin-cities-commercial-roofing-services/",
    "/rated-hail-and-storm-damage-repair-in-colorado/",
    "/blog/",
    "/category/house-roof-work/",
    "/tag/roofing/",
    "/author/adminjvh/",
    "/elementor-hf/footer/",
    "/feed/",
    "/comments/feed/",
    "/over-ons/feed/",
    "/wp-admin/",
    "/wp-admin/admin-ajax.php",
    "/wp-login.php",
    "/xmlrpc.php",
    "/wp-json/wp/v2/posts",
    "/wp-content/uploads/2024/01/foto.jpg",
    "/wp-includes/js/jquery/jquery.min.js",
  ])("meldt %s als verdwenen", (path) => {
    expect(resolveLegacyUrl(path)).toEqual({ type: "gone" });
  });

  it.each([
    "/",
    "/over-ons/",
    "/diensten/",
    "/diensten/dakrenovatie/",
    "/projecten/",
    "/projecten/nieuwbouw-zutphen/",
    "/contact/",
    "/prijzen/",
    "/dakdekker-elst/",
    "/sitemap.xml",
    "/nieuwbouw-iets-anders/",
    "/teamwork/",
    "/tagliatelle/",
    "/blogger/",
  ])("laat %s met rust", (path) => {
    expect(resolveLegacyUrl(path)).toBeNull();
  });
});
