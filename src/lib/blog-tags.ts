import prisma from "@/lib/prisma";
import { sortBlogTags } from "./blog-tag-constants";

export { START_HERE_TAG, EDITORIAL_TAGS, sortBlogTags } from "./blog-tag-constants";

export async function getBlogTags(options: { publishedOnly: boolean }) {
  const posts = await prisma.blogPost.findMany({
    where: {
      ...(options.publishedOnly ? { status: "PUBLISHED" } : {}),
      tag: { not: null },
      NOT: { tag: "" },
    },
    select: { tag: true },
    distinct: ["tag"],
  });

  const tags = posts
    .map((post) => post.tag)
    .filter((tag): tag is string => Boolean(tag));

  return sortBlogTags(tags);
}
