export type MoneyBreakdown = {
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  codFee: number;
  giftWrapFee: number;
  grandTotal: number;
};

export function splitGst(amountInclusive: number, gstRate: number, intraState: boolean) {
  const gst = Math.round((amountInclusive * gstRate) / (100 + gstRate));
  if (intraState) {
    const half = Math.round(gst / 2);
    return { cgst: half, sgst: gst - half, igst: 0, gst };
  }
  return { cgst: 0, sgst: 0, igst: gst, gst };
}
