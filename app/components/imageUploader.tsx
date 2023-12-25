import React, {
  useState,
  useEffect,
  useCallback,
  useImperativeHandle,
  forwardRef,
} from "react";
import { api_endpoint } from "../common/constants";
import Image from "next/image";

interface Props {
  value: any;
  readonly?: boolean;
}

export interface ImageUploaderHandle {
  get: () => any;
}

export const ImageUploader = forwardRef(
  ({ value, readonly = false }: Props, ref) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState<string | null>("");

    useEffect(() => {
      if (value) {
        setPreview(`${api_endpoint}/${value}`);
      } else {
        setPreview(null);
      }
    }, [value]);

    useEffect(() => {
      if (!selectedFile) {
        return;
      }

      const objectUrl = URL.createObjectURL(selectedFile);
      setPreview(objectUrl);

      // free memory when ever this component is unmounted
      return () => URL.revokeObjectURL(objectUrl);
    }, [selectedFile]);

    useImperativeHandle(ref, () => ({
      get: () => {
        if (!selectedFile) {
          return value;
        }
        return selectedFile;
      },
    }));

    const onFileChange = useCallback((event: any) => {
      setSelectedFile(event.target.files[0]);
    }, []);

    function onGetImageFromClipboard(evt: any) {
      console.log(evt);
      // Get the data of clipboard
      const clipboardItems = evt.clipboardData.items;
      const items = [].slice.call(clipboardItems).filter(function (item: any) {
        // Filter the image items only
        return item.type.indexOf("image") !== -1;
      });
      if (items.length === 0) {
        return;
      }

      const item = items[0] as any;
      // Get the blob of image
      const blob = item.getAsFile();
      console.log(blob);
      setSelectedFile(blob);
    }

    return (
      <div className="relative">
        <label
          className="cursor-pointer"
          htmlFor={readonly ? "." : "file-upload"}
        >
          {/* pick up image from local */}
          {selectedFile === null &&
            (preview === null || preview === undefined || preview === "") && (
              <div className="flex justify-center items-center relative overflow-hidden rounded-lg h-60 border">
                <span>Add an image (optional)</span>
              </div>
            )}

          {/* preview image */}
          {(selectedFile || preview) && (
            <div>
              {
                <div className="flex justify-center align-middle relative overflow-hidden rounded-lg">
                  <div className="absolute z-1 blur-lg scale-150">
                    <Image
                      src={preview ?? ""}
                      className="w-full object-cover"
                      alt="preview image"
                    />
                  </div>
                  <div className="z-10">
                    <Image
                      src={preview ?? ""}
                      className="h-60 object-contain"
                      alt="preview image"
                    />
                  </div>
                </div>
              }
            </div>
          )}
        </label>
        <input
          className="hidden"
          id="file-upload"
          type="file"
          onChange={onFileChange}
        />

        {/* get image from clipboard */}
        {readonly ? null : (
          <div className="absolute z-10 bottom-1 right-1 bg-white p-1 rounded-md cursor-copy shadow-inner opacity-90">
            <div onPaste={onGetImageFromClipboard}>
              Click here then <b>Ctrl+V</b> to insert image from clipboard
            </div>
          </div>
        )}
      </div>
    );
  }
);

ImageUploader.displayName = "ImageUploader";
