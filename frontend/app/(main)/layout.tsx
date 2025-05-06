"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { ReactNode, useState } from "react";
import NewListDialog from "./new-list-dialog";
import { Plus } from "lucide-react";
import RenameListDialog from "./rename-list-dialog";
import { usePathname } from "next/navigation";
import Link from "next/link";
import SidebarMenuListItem from "./sidebar-menu-list-item";
import List from "./list";
import DeleteListDialog from "./delete-list-dialog";
import useLists from "@/hooks/use-lists";

const MainLayout = ({ children }: { children: ReactNode }) => {
  const pathName = usePathname();
  const { lists, listError, deleteList, createList, renameList } = useLists();
  const [newListDialogOpen, setNewListDialogOpen] = useState(false);
  const [renamedList, setRenamedList] = useState<List>();
  const [deletedListID, setDeletedListID] = useState<string>();
  return (
    <>
      <SidebarProvider>
        <Sidebar>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={pathName === "/"} asChild>
                      <Link href="/">Inbox</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup>
              <SidebarGroupLabel className="flex justify-between">
                Lists
                <SidebarMenuAction
                  className="relative top-0 -mr-2"
                  onClick={() => {
                    setNewListDialogOpen(true);
                  }}
                >
                  <Plus />
                </SidebarMenuAction>
              </SidebarGroupLabel>
              <SidebarGroupContent>
                {listError !== undefined ? (
                  <div className="text-muted-foreground text-center p-2 text-sm">
                    {listError}
                  </div>
                ) : (
                  <SidebarMenu>
                    {lists?.map((list) => (
                      <SidebarMenuListItem
                        key={list.id}
                        list={list}
                        active={pathName === `/list/${list.id}`}
                        onRename={() => {
                          setRenamedList(list);
                        }}
                        onDelete={() => {
                          setDeletedListID(list.id);
                        }}
                      />
                    ))}
                  </SidebarMenu>
                )}
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        {children}
      </SidebarProvider>
      <NewListDialog
        open={newListDialogOpen}
        onClose={() => {
          setNewListDialogOpen(false);
        }}
        onCreate={(name) => {
          void createList(name);
        }}
      />
      <RenameListDialog
        list={renamedList}
        onClose={() => {
          setRenamedList(undefined);
        }}
        onSave={(newName) => {
          if (renamedList !== undefined) {
            void renameList(renamedList.id, newName);
          }
        }}
      />
      <DeleteListDialog
        open={deletedListID !== undefined}
        onClose={() => {
          setDeletedListID(undefined);
        }}
        onDelete={() => {
          if (deletedListID !== undefined) void deleteList(deletedListID);
        }}
      />
    </>
  );
};

export default MainLayout;
