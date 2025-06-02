import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import List from "./types/list";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";

const SidebarMenuListItem = ({
  list,
  active,
  onRename,
  onDelete,
}: {
  list: List;
  active: boolean;
  onRename: () => void;
  onDelete: () => void;
}) => (
  <SidebarMenuItem key={list.id}>
    <SidebarMenuButton asChild isActive={active}>
      <Link href={`/list/${list.id}`}>{list.title}</Link>
    </SidebarMenuButton>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuAction>
          <MoreHorizontal />
        </SidebarMenuAction>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" align="start">
        <DropdownMenuItem onClick={onRename}>Rename</DropdownMenuItem>
        <DropdownMenuItem onClick={onDelete}>Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </SidebarMenuItem>
);

export default SidebarMenuListItem;
