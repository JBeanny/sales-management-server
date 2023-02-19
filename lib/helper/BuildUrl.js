const buildUrl = (fullUrl, newQuery) => {
  const currentUrl = new URL(fullUrl);
  for (const key in newQuery) {
    currentUrl.searchParams.set(key, newQuery[key]);
  }
  const newUrl = currentUrl.toString();

  return newUrl;
};

module.exports = buildUrl;
