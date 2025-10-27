import { cn } from "@utils";
import { StaticImageData } from "next/image";

type BGProps = {
  src: StaticImageData | string;
  children?: React.ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>;

export default function BackgroundImage({
  src,
  children,
  className,
}: Readonly<BGProps>) {
  const imageUrl = typeof src === "string" ? src : src.src;
  return (
    <section
      className={cn(
        "bg-background relative flex h-full flex-1 overflow-hidden",
        className
      )}
      style={{
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {children}
    </section>
  );
}
