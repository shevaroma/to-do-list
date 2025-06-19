import ListPageContent from "@/app/(main)/list-page-content";

const ListPage = async ({ params }: { params: Promise<{ id: string }> }) => (
  <ListPageContent listID={(await params).id} />
);

export default ListPage;
