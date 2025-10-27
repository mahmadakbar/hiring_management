import Header from "@components/organisms/Header";
import Provider from "../Provider";

export default function Container({ children }: Readonly<ChildrenProps>) {
  return (
    <Provider>
      <main className="bg-background flex h-screen flex-col gap-4">
        <Header />
        <div className="flex-1 overflow-auto">{children}</div>
      </main>
    </Provider>
  );
}
