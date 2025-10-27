import { bg_card } from "@assets/images";
import BackgroundImage from "@components/atoms/background-image";
import { Button } from "@components/atoms/button";
import { Card } from "@components/atoms/card";
import { cn } from "@utils";

type CardBackgroundProps = Readonly<{
  isEnabled?: boolean;
  href?: string;
  title?: string;
  subtitle?: string;
  onClickButton?: () => void;
}>;

export default function CardBackground({
  isEnabled = true,
  href,
  title = "Recruit the best candidates",
  subtitle = "Create jobs, invite, and hire with ease",
  onClickButton,
}: CardBackgroundProps) {
  const baseProps = {
    disabled: !isEnabled,
    className: cn(
      "flex flex-col items-center border-none rounded-xl shadow-lg overflow-hidden w-[320px] h-[170px]"
    ),
  };

  return (
    <Card {...(href ? { ...baseProps, href } : baseProps)}>
      <BackgroundImage src={bg_card} className="w-full rounded-xl">
        <div className="flex h-full w-full flex-col items-center justify-between gap-4 bg-black/70 p-6">
          <div className="flex flex-col justify-start gap-2 text-left">
            <h1 className="text-border text-lg font-bold">{title}</h1>
            <p className="text-sm font-bold text-white">{subtitle}</p>
          </div>

          <Button
            onClick={onClickButton}
            className="bg-secondary hover:bg-secondary/90 disabled:bg-border-grey disabled:text-font-primary w-full font-bold text-white disabled:cursor-not-allowed"
          >
            Create New Job
          </Button>
        </div>
      </BackgroundImage>
    </Card>
  );
}
