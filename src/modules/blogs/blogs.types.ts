export interface BlogRecord {
  id: string;
  title: string;
  content: string;
  authorName: string;
  blogCategoryId: string | null;
  mediaId: string | null;
  createdAt: Date;
  updatedAt: Date;
}
