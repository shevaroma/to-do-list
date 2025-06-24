import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { ReactNode } from "react";

const Header = ({
  title,
  children,
}: {
  title?: string;
  children?: ReactNode;
}) => (
  <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 sticky top-0 bg-background z-50">
    <SidebarTrigger className="-ml-1" />
    {title !== undefined && (
      <>
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="font-medium">{title}</h1>
      </>
    )}
    <div className="ml-auto">{children}</div>
  </header>
);

export default Header;
