import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import "github-markdown-css/github-markdown-light.css";
import { cn } from "@/lib/cn";

const schema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    div: [...(defaultSchema.attributes?.div ?? []), "align"],
    img: [
      ...(defaultSchema.attributes?.img ?? []),
      "width",
      "height",
      "style",
    ],
  },
};

type Props = {
  markdown: string;
  id?: string;
  className?: string;
};

export function MarkdownRenderedView({ markdown, id, className }: Props) {
  return (
    <div id={id} className={cn("markdown-body", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, [rehypeSanitize, schema]]}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
