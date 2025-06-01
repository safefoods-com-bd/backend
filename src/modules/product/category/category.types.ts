export interface CategoryRecord {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  parentId: string | null;
  mediaId: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  levelId: string | null;
  levelTitle: string | null;
  levelSlug: string | null;
}

export interface CategoryWithChildren extends CategoryRecord {
  children: CategoryWithChildren[];
}
