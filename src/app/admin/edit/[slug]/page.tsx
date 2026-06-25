import { getPostBySlug } from "@/lib/mdx";
import { notFound } from "next/navigation";
import EditForm from "./EditForm";

export default async function EditPostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);
  
  if (!post) {
    notFound();
  }

  return <EditForm post={post} />;
}
