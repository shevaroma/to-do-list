"use client";
import { use, useEffect, useState } from "react";
import Header from "@/app/(main)/header";

const ListPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);
  const [title, setTitle] = useState<string | undefined>(undefined);

  useEffect(() => {
    fetch(`/api/to-do-lists/${id}`)
      .then((res) => res.json())
      .then((data) => setTitle(data.title))
      .catch(() => setTitle(undefined));
  }, [id]);

  return (
    <div className="w-full">
      <Header title={title} />
    </div>
  );
};

export default ListPage;
