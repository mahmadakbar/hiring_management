import Background from "@components/atoms/background";
import DashboardTemplate from "@components/templates/DahboardTemplate";

export default function Home() {
  return (
    <Background>
      <div className="flex h-full w-full">
        <DashboardTemplate />
      </div>
    </Background>
  );
}
