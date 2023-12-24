interface TagType {
  id: number;
  tag_name: string;
}

interface PostType {
  id: string;
  title: string;
  post: string;
  updateTime: number;
  imagePath: string;
  tags: TagType[];
}

interface PostTypePayload {
  title: string;
  imagePath: any; //! payload should have exact name (for upload.single("imagePath"))
  post: string;
  shortPost: string;
  tags: TagType[];
  authorId: number;
}

export type { PostType, TagType, PostTypePayload };
