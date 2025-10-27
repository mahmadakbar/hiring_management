import { RakaminLogo } from "@assets/icon";
import FormLogin from "@components/organisms/FormLogin";

export default function LoginTemplate() {
  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center gap-8 p-4">
      <div className="flex w-full max-w-md flex-col gap-6">
        <RakaminLogo />

        <FormLogin />
      </div>
    </div>
  );
}
