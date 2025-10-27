import { loginSchema } from "@lib/schema/authSchema";
import { invoiceSchema } from "@lib/schema/invoiceSchema";

type FormLoginData = z.infer<typeof loginSchema>;
type FormRegisterData = z.infer<typeof registerSchema>;
type FormInvoiceData = z.infer<typeof invoiceSchema>;

export { FormLoginData, FormRegisterData, FormInvoiceData };
