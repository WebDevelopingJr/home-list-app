
"use client";

import { useParams } from "next/navigation";

export default function ListDetail() {
  const params = useParams();
  return (
    <div>
      <h1>List Detail</h1>
      <p>ID: {params?.id}</p>
    </div>
  );
}