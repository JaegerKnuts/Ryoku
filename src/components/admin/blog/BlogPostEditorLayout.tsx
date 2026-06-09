"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import BlogPostLivePreview from "./BlogPostLivePreview";

interface BlogPostEditorLayoutProps {
  title: string;
  backHref?: string;
  children: React.ReactNode;
  preview: {
    postTitle: string;
    excerpt: string;
    tag: string;
    content: string;
  };
}

export default function BlogPostEditorLayout({
  title,
  backHref = "/admin/blog",
  children,
  preview,
}: BlogPostEditorLayoutProps) {
  return (
    <div className="w-full">
      <div className="flex items-center gap-4 mb-6">
        <Link href={backHref} className="p-2 hover:bg-[var(--surface)] rounded-md transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1
          className="text-4xl uppercase tracking-tight"
          style={{ fontFamily: "var(--font-bebas), Impact, sans-serif" }}
        >
          {title}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_380px] gap-6 lg:gap-8 items-start">
        <div className="min-w-0">{children}</div>
        <aside className="lg:sticky lg:top-24 min-w-0">
          <BlogPostLivePreview
            title={preview.postTitle}
            excerpt={preview.excerpt}
            tag={preview.tag}
            content={preview.content}
          />
        </aside>
      </div>
    </div>
  );
}
