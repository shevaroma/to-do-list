import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

const Header = ({ title }: { title: string | undefined }) => (
  <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 sticky top-0 bg-background z-50">
    <SidebarTrigger className="-ml-1" />
    <Separator
      orientation="vertical"
      className="mr-2 data-[orientation=vertical]:h-4"
    />
    <h1 className="font-medium">{title}</h1>
  </header>
);

export default Header;
