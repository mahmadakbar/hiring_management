import z from "zod";

const invoiceSchema = z.object({
  pelanggan: z.string().min(1, { message: "Pelanggan is required" }),
  no_faktur: z.number().min(1, { message: "No Faktur is required" }),
  tanggal_input: z.string().min(1, { message: "Tanggal Input is required" }),
  tanggal_pengiriman: z
    .string()
    .min(1, { message: "Tanggal Pengiriman is required" }),
  detail_items: z
    .array(
      z.object({
        range: z.string().min(1, { message: "Range is required" }),
        name: z.string().min(1, { message: "Name is required" }),
        price: z.number().min(1, { message: "Price is required" }),
      })
    )
    .min(1, { message: "At least one item is required" }),
  syarat_pembayaran: z
    .string()
    .min(1, { message: "Syarat Pembayaran is required" }),
  no_po: z.string().min(1, { message: "No PO is required" }),
  alamat: z.string().min(1, { message: "Alamat is required" }),
  branch: z.string().min(1, { message: "Branch is required" }),
  keterangan: z.string().min(1, { message: "Keterangan is required" }),
  tax: z.array(
    z.object({
      label: z.string(),
      value: z.boolean(),
    })
  ),
});

export { invoiceSchema };
