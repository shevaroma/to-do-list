const HOP_BY_HOP_HEADERS = [
  "connection",
  "content-encoding",
  "content-length",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
];

export const toClientResponse = async (
  upstream: Response,
): Promise<Response> => {
  const headers = new Headers(upstream.headers);
  for (const header of HOP_BY_HOP_HEADERS) headers.delete(header);

  if (upstream.status === 204 || upstream.status === 304) {
    return new Response(null, {
      status: upstream.status,
      statusText: upstream.statusText,
      headers,
    });
  }

  return new Response(await upstream.arrayBuffer(), {
    status: upstream.status,
    statusText: upstream.statusText,
    headers,
  });
};
