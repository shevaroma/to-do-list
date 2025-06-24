"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
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
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import SidebarMenuListItem from "./sidebar-menu-list-item";
import List from "@/lib/list";
import DeleteListDialog from "./delete-list-dialog";
import useLists from "@/hooks/use-lists";
import SidebarUserItem from "@/app/(main)/sidebar-user-item";
import ToDoListError from "@/lib/to-do-list-error";
import { UserProvider, useUserContextSafe } from "@/app/contexts/user-context";

const MainLayoutContent = ({ children }: { children: ReactNode }) => {
  const pathName = usePathname();
  const { lists, listError, createList, renameList, deleteList } = useLists();
  const userContext = useUserContextSafe();
  const [newListDialogOpen, setNewListDialogOpen] = useState(false);
  const [renamedList, setRenamedList] = useState<List>();
  const [deletedListID, setDeletedListID] = useState<string>();
  const user = userContext?.user;
  const userError = userContext?.userError;
  const router = useRouter();

  return (
    <SidebarProvider>
      <Sidebar>
        {listError === undefined && userError === undefined ? (
          <>
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
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
            {user !== undefined && (
              <SidebarFooter>
                <SidebarUserItem user={user} />
              </SidebarFooter>
            )}
          </>
        ) : (
          <div className="text-muted-foreground text-center p-4 text-sm grow flex items-center justify-center">
            {listError === ToDoListError.NoConnection &&
            userError === ToDoListError.NoConnection
              ? "No connection."
              : "Something went wrong."}
          </div>
        )}
      </Sidebar>
      {children}
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
        onDelete={async () => {
          if (deletedListID !== undefined) {
            await deleteList(deletedListID);
            setDeletedListID(undefined);
            router.push("/");
          }
        }}
      />
    </SidebarProvider>
  );
};

const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <UserProvider>
      <MainLayoutContent>{children}</MainLayoutContent>
    </UserProvider>
  );
};

export default MainLayout;
