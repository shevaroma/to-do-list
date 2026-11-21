import { notFound } from "next/navigation";
import ListPageContent from "@/app/(main)/list-page-content";

const ListPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();
  return <ListPageContent listID={id} />;
};

export default ListPage;
