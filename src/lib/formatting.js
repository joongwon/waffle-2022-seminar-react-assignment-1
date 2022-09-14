export function formatPrice(price) {
  const priceStr = price.toString();
  const slices = [];
  slices.push(priceStr.slice(0, priceStr.length % 3));
  for (let i = priceStr.length % 3; i < priceStr.length; i += 3)
    slices.push(priceStr.slice(i, i + 3));
  return slices.join(",");
}
