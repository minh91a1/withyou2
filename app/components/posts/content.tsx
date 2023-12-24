"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  XMarkIcon,
  PencilIcon as PencilSolidIcon,
} from "@heroicons/react/24/solid";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { TextEditor, TextEditorHandle } from "../textEditor";
import { PostType, PostTypePayload, TagType } from "@/app/common/type/posts";
import { cn, jsonToFormData } from "@/lib/utils";
import { ContentEditable, ContentEditableHandle } from "../contentEditable";
import { ImageUploader, ImageUploaderHandle } from "../imageUploader";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { api_endpoint } from "@/app/common/constants";

/* api */
async function getAllTags() {
  const response = await fetch(`${api_endpoint}/tag`);
  const tags = await response.json();
  return tags as TagType[];
}

async function deletePost(id: number | string) {
  const response = await fetch(`${api_endpoint}/post/soft_delete/${id}`, {
    method: "POST",
  });
  return response;
}

async function savePost(
  id: number | string | undefined | null,
  payload: PostTypePayload
) {
  const url = `${api_endpoint}/post${id ? `/${id}` : ""}`;
  const response = await fetch(url, {
    method: "POST",
    body: jsonToFormData(payload),
  });
  return response;
}

interface Props {
  post?: PostType;
  addNew?: boolean;
}

export const PostContent = ({ post, addNew = false }: Props) => {
  const router = useRouter();

  const textEditorRef = useRef<TextEditorHandle | null>(null);
  const titleRef = useRef<ContentEditableHandle | null>(null);
  const imageRef = useRef<ImageUploaderHandle | null>(null);

  const [isClient, setIsClient] = useState(false);
  const [editMode, setEditMode] = useState(addNew);

  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [imagePath, setImagePath] = useState("");
  const [allTags, setallTags] = useState<TagType[]>([]);
  const [selectedTags, setSelectedTags] = useState<TagType[]>([]);
  const [tagFilter, setTagFilter] = useState("");

  const [uiKey, setUiKey] = useState(0);

  const updatedTime = (
    post?.updateTime ? new Date(post.updateTime) : new Date()
  ).toLocaleDateString("en-GB");

  const onClickClose = () => {
    if (editMode && post) {
      router.replace(`/posts/${post.id}`);
      toggleEditMode();
    } else {
      router.back();
    }
  };

  const onClickTrash = () => {
    if (post && post.id) {
      deletePost(post.id);
      router.replace(`/posts`);
    }
  };

  const onToggleEdit = async () => {
    if (editMode) {
      if (!textEditorRef.current) {
        return;
      }

      const title = titleRef.current?.getContent();
      const { content, shortContent } = textEditorRef.current.getContent();
      const img = imageRef.current?.get();
      const authorId = 1;
      const tags = selectedTags;

      if (
        !title ||
        !content ||
        title.trim().length === 0 ||
        content.trim().length === 0
      ) {
        return;
      }

      const payload = {
        title,
        imagePath: img, //! payload should have exact name (for upload.single("imagePath"))
        post: content,
        shortPost: shortContent,
        tags,
        authorId,
      };

      const response = await savePost(post?.id, payload);

      if (!response || response.status !== 200) {
        return;
      }

      const response_data = await response.json();

      if (response_data.insertId > 0) {
        router.replace(`/posts/${response_data.insertId}`);
      } else {
        const post_data = response_data[0] as PostType;
        setCurrentPost(post_data);
      }
    }

    toggleEditMode();
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
    setUiKey(new Date().getTime());
  };

  const addTag = (tag: TagType) => {
    if (selectedTags.find((t) => t.tag_name === tag.tag_name)) {
      removeTag(tag);
      return;
    }
    setSelectedTags([...selectedTags, tag]);
  };

  const removeTag = (tag: TagType) => {
    setSelectedTags(selectedTags.filter((t) => t.tag_name !== tag.tag_name));
  };

  const init = async () => {
    const tags = await getAllTags();
    setallTags(tags.sort());
  };

  const setCurrentPost = (post: PostType) => {
    setPostTitle(post?.title ?? "");
    setPostContent(post?.post ?? "");
    setImagePath(post?.imagePath ?? "");
    setSelectedTags(post?.tags ?? []);
  };

  useEffect(() => {
    setIsClient(true);
    init();
  }, []);

  useEffect(() => {
    if (post) {
      setCurrentPost(post);
      setUiKey(new Date().getTime());
    }
  }, [post]);

  if (!isClient) {
    return <>Loading...</>;
  }

  return (
    <div
      key={`key-${uiKey}`}
      className="border-zinc-100 border-2 rounded-2xl p-1 shadow-xl max-w-lg"
      style={{ minWidth: 650 }}
    >
      {/* top bar */}
      <div className="flex justify-between  mb-1">
        {/* post title */}
        <ContentEditable
          ref={titleRef}
          disabled={!editMode}
          className={cn(
            "text-xl ml-1 mt-1 mr-4 break-words",
            editMode ? "outline-1 outline-slate-400 outline rounded-sm" : ""
          )}
          value={postTitle}
        />
        {/* right bar buttons */}
        <div className="flex">
          {/* trash button */}
          <AlertDialog>
            <AlertDialogTrigger>
              <TrashIcon
                className="h-4 w-4 cursor-pointer hover:text-red-600 mr-2"
                style={{ marginTop: 10 }}
              />
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  Delete this post ?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    onClickTrash();
                  }}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* edit button */}
          {!editMode && (
            <PencilIcon
              className="h-4 w-4 cursor-pointer hover:text-blue-400 mr-2"
              style={{ marginTop: 10 }}
              onClick={() => {
                onToggleEdit();
              }}
            />
          )}
          {editMode && (
            <PencilSolidIcon
              className="h-4 w-4 cursor-pointer text-blue-400 mr-2"
              style={{ marginTop: 10 }}
              onClick={() => {
                onToggleEdit();
              }}
            />
          )}
          {/* close post button */}
          <XMarkIcon
            className="h-5 w-5 cursor-pointer hover:fill-orange-400 mr-2 mt-2"
            onClick={() => {
              onClickClose();
            }}
          />
        </div>
      </div>
      <div
        className="flex justify-between items-center"
        style={{ minHeight: 28 }}
      >
        {/* time */}
        <div className="ml-1 text-sm font-light">{updatedTime}</div>
        {/* post tags */}
        <div className="ml-1 mr-1 space-x-1 flex flex-wrap justify-end">
          {selectedTags.map((t) => (
            <span
              key={`tag-key-${t.tag_name}-${t.id}`}
              className={`bg-slate-200 rounded-lg text-sm pt-1 pb-1 pl-3 cursor-default relative ${
                editMode ? "pr-5" : "pr-3"
              }`}
            >
              {t.tag_name}
              {editMode && (
                <span className="absolute -translate-y-1/2 top-1/2 cursor-pointer ">
                  <XMarkIcon
                    className="h-3 w-3 mt-1 hover:fill-orange-400"
                    onClick={() => {
                      removeTag(t);
                    }}
                  />
                </span>
              )}
            </span>
          ))}
          {editMode && (
            <span className="bg-slate-200 rounded-lg text-sm pt-1 pb-1 pl-3 pr-3 cursor-default">
              <Popover
                modal
                onOpenChange={(open) => {
                  if (!open) {
                    setTimeout(() => {
                      setTagFilter("");
                    }, 100);
                  }
                }}
              >
                <PopoverTrigger>+ Tag</PopoverTrigger>
                <PopoverContent className="">
                  <input
                    className="w-full rounded-sm pl-1 pr-1 focus:outline-none"
                    placeholder="Find tag..."
                    onChange={(e) => setTagFilter(e.target.value)}
                  ></input>
                  <hr className="mt-1 mb-1" />
                  <ul className="overflow-auto max-h-96">
                    {allTags
                      .filter((tag) => tag.tag_name.includes(tagFilter))
                      .map((tag) => (
                        <li
                          key={`${tag.id}-${tag.tag_name}`}
                          className={`hover:bg-slate-100 cursor-pointer rounded-sm pt-1 pb-1 pl-1 ${
                            selectedTags.find(
                              (t) => t.tag_name === tag.tag_name
                            )
                              ? "font-bold"
                              : ""
                          }`}
                          onClick={() => {
                            addTag(tag);
                          }}
                        >
                          {tag.tag_name}
                        </li>
                      ))}
                    {allTags.filter((tag) => tag.tag_name === tagFilter)
                      .length === 0 && (
                      <>
                        {allTags.filter((tag) =>
                          tag.tag_name.includes(tagFilter)
                        ).length > 0 && <hr className="mt-1 mb-1" />}
                        <li
                          className="hover:bg-slate-100 cursor-pointer rounded-sm pt-1 pb-1 pl-1"
                          onClick={() => {
                            addTag({
                              id: -1,
                              tag_name: tagFilter,
                            });
                          }}
                        >
                          Add new tag &quot;{tagFilter}&quot;
                        </li>
                      </>
                    )}
                  </ul>
                </PopoverContent>
              </Popover>
            </span>
          )}
        </div>
      </div>

      {/* post image */}
      <div className="mt-2 m-1">
        {(post?.imagePath || addNew || editMode) && (
          <ImageUploader
            ref={imageRef}
            value={imagePath}
            readonly={!editMode}
          />
        )}
      </div>

      {/* post content */}
      <div className="mt-2"></div>
      <TextEditor ref={textEditorRef} text={postContent} disabled={!editMode} />
    </div>
  );
};
