import Header from "@/app/(main)/header";

const ListPage = ({ params }: { params: { id: string } }) => (
  <div className="w-full">
    <Header title={`List ${params.id}`} />
  </div>
);

export default ListPage;
