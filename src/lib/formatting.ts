export function formatPrice(price: number): string {
  if (isNaN(price)) return "";
  const priceStr = price.toString().replaceAll(",", "");
  const slices = [];
  if (priceStr.length % 3 !== 0)
    slices.push(priceStr.slice(0, priceStr.length % 3));
  for (let i = priceStr.length % 3; i < priceStr.length; i += 3)
    slices.push(priceStr.slice(i, i + 3));
  return slices.join(",");
}

export function priceToNum(price: string): number {
  console.log(price, "=>", Number(price.replaceAll(",", "")));
  return Number(price.replaceAll(",", ""));
}

export function nanToNull(n: number): number | null {
  return isNaN(n) ? null : n;
}
