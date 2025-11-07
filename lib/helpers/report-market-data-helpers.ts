export async function fetchCoingeckoOhlc(slug: string) {
  const url = `https://api.coingecko.com/api/v3/coins/${encodeURIComponent(
    slug
  )}/ohlc?vs_currency=usd&days=7`;

  const headers: Record<string, string> = {
    Accept: "application/json",
    "User-Agent": "token-social-analyzer/1.0",
  };

  const apiKey = process.env.COINGECKO_API_KEY;
  if (apiKey) {
    headers["x-cg-api-key"] = apiKey;
    headers["x-cg-pro-api-key"] = apiKey;
  }
  const res = await fetch(url, { headers, next: { revalidate: 60 } });
  const text = await res.text().catch(() => "");

  if (!res.ok) {
    throw Object.assign(
      new Error(
        `Coingecko OHLC failedL: ${res.status} ${res.statusText} ${
          (text?.slice(0, 300), { status: res.status })
        }`
      )
    );
  }

  try {
    const arr = JSON.parse(text) as Array<
      [number, number, number, number, number]
    >;
    return arr;
  } catch (error) {
    console.error(error);
    throw Object.assign(
      new Error(`Coingecko OHLC JSON parse failed: ${text?.slice(0, 300)}`),
      { status: 502 }
    );
  }
}

export async function fetchCoingeckoMarketChart(slug: string) {
  const url = `https://api.coingecko.com/api/v3/coins/${encodeURIComponent(
    slug
  )}/market_chart?vs_currency=usd&days=7&interval=hourly`;
  const headers: Record<string, string> = {
    Accept: "application/json",
    "User-Agent": "token-social-analyzer/1.0",
  };
  const apiKey = process.env.COINGECKO_API_KEY;
  if (apiKey) {
    headers["x-cg-api-key"] = apiKey; // new header (docs)
    headers["x-cg-pro-api-key"] = apiKey; // legacy/pro header (compat)
  }

  const res = await fetch(url, {
    headers,
    next: { revalidate: 60 },
  });
  const text = await res.text().catch(() => "");

  try {
    if (!res.ok) {
      throw Object.assign(
        new Error(
          `Coingecko fetch failed: ${res.status} ${
            res.statusText
          } ${text?.slice(0, 300)}`
        ),
        { status: res.status }
      );
    }

    return JSON.parse(text);
  } catch (error) {
    console.log(error);
    throw Object.assign(
      new Error(`Coingecko JSON parse failed: ${text?.slice(0, 300)}`),
      { status: 502 }
    );
  }
}
