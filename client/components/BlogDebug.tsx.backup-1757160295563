import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BlogDebugProps {
  post: any;
}

export function BlogDebug({ post }: BlogDebugProps) {
  return (
    <Card className="bg-slate-800 border border-black">
      <CardHeader>
        <CardTitle className="text-white">Blog Post Debug Info</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm text-slate-300">
          <p><strong>Post exists:</strong> {post ? "Yes" : "No"}</p>
          {post && (
            <>
              <p><strong>Title:</strong> {post.title}</p>
              <p><strong>Slug:</strong> {post.slug}</p>
              <p><strong>Excerpt:</strong> {post.excerpt?.substring(0, 100)}...</p>
              <p><strong>Author:</strong> {post.author}</p>
              <p><strong>Category:</strong> {post.category}</p>
              <p><strong>Views:</strong> {post.views}</p>
              <p><strong>Likes:</strong> {post.likes}</p>
            </>
          )}
          <p><strong>Current URL:</strong> {window.location.href}</p>
          <p><strong>Origin:</strong> {window.location.origin}</p>
        </div>
      </CardContent>
    </Card>
  );
} 