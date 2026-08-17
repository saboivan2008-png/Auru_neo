export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === '/api/status') {
      return new Response(JSON.stringify({
        platform: "AETHER Edge Agent",
        status: "OPERATIONAL",
        skills: 1300,
        connectors: 30,
        node: request.cf.colo // Označenie dátového centra Cloudflare
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response("AETHER Edge Worker is running.", { status: 200 });
  }
};
