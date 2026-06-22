/* eslint-disable react-hooks/static-components */
"use client";

import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { use } from "react";
import { animations } from "@/data/components";

// Cache dynamic components at module level so the same reference is reused per slug
const dynamicComponentCache = new Map<string, ReturnType<typeof dynamic>>();

function getDynamicComponent(slug: string) {
  if (!dynamicComponentCache.has(slug)) {
    dynamicComponentCache.set(
      slug,
      dynamic(() => import(`@/app/(main)/components/${slug}/page`), {
        ssr: false,
      })
    );
  }
  return dynamicComponentCache.get(slug)!;
}

function DynamicRenderer({ slug }: { slug: string }) {
  const Component = getDynamicComponent(slug);
  return <Component />;
}

export default function PreviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);

  if (!animations.find((a) => a.componentName === slug)) {
    notFound();
  }

  return <DynamicRenderer slug={slug} />;
}
