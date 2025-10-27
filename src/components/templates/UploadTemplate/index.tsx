import { FormUploadDocuments } from "@components/organisms/FormUploadDocuments";

export default function UploadTemplate() {
  return (
    <div className="flex flex-col items-center justify-center gap-10">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-font-primary text-center text-[64px] font-medium">
          Scan and Sort
        </h1>
        <p className="text-font-secondary w-3/5 text-center text-xl">
          Drag and drop your invoices. Our agent uses powerful technology to
          read, scan, and sort your documents automatically.
        </p>
      </div>

      <FormUploadDocuments />
    </div>
  );
}
