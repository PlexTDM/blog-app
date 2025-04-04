"use client";
import { Editor } from "@tinymce/tinymce-react";

const TinyMCEeditor = ({ initialValue, editorRef }) => {

  const imagePicker = (cb, value, meta) => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');

    input.addEventListener('change', (e) => {
      const file = e.target.files[0];

      const reader = new FileReader();
      reader.addEventListener('load', () => {
        const id = 'blobid' + (new Date()).getTime();
        const blobCache = tinymce.activeEditor.editorUpload.blobCache;
        const base64 = reader.result.split(',')[1];
        const blobInfo = blobCache.create(id, file, base64);
        blobCache.add(blobInfo);

        cb(blobInfo.blobUri(), { title: file.name });
      });
      reader.readAsDataURL(file);
    });

    input.click();
  }

  const imageUploadHandler = (blobInfo, progress) => new Promise((resolve, reject) => {
    const formData = new FormData()
    formData.append('image', blobInfo.blob())
    formData.append('extension', blobInfo.filename().split(".")[1])
    fetch("/api/blog/image", {
      method: "POST",
      body: formData,
    }).then(res => res.json()).then((data) => {
      resolve(data.url);
    }).catch((err) => {
      reject(err);
    });
  })

  return (
    <Editor
      apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
      onInit={(_evt, editor) => (editorRef.current = editor)}
      initialValue={initialValue}
      disabled={false}
      init={{
        // selector: "textarea",
        skin: "oxide-dark",
        content_css: "dark",
        height: 500,
        menubar: false,
        images_file_types: "png,jpg,jpeg,svg",
        automatic_uploads: false,
        file_picker_types: "image",
        images_reuse_filename: true,
        image_advtab: true,
        // images_upload_url: '/api/blog/image',
        images_upload_handler: imageUploadHandler,
        file_picker_callback: imagePicker,
        plugins: [
          "advlist",
          "autolink",
          "lists",
          "link",
          "image",
          "charmap",
          "preview",
          "anchor",
          "searchreplace",
          "visualblocks",
          "code",
          "fullscreen",
          "insertdatetime",
          "media",
          "table",
          "code",
          "help",
          "wordcount",
        ],
        toolbar:
          "undo redo | blocks | " +
          "bold italic forecolor | alignleft aligncenter " +
          "alignright alignjustify | image | bullist numlist outdent indent | " +
          "removeformat | preview help",
        content_style:
          "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
        image_class_list: [
          { title: 'Left Align', value: 'image-left' },
          { title: 'Right Align', value: 'image-right' },
          { title: 'Center Align', value: 'image-center' }
        ],
        content_style: `
          body { 
            font-family:Helvetica,Arial,sans-serif; 
            font-size:14px 
          }
          .image-left { 
            float: left; 
            margin: 0 1rem 1rem 0; 
          }
          .image-right { 
            float: right; 
            margin: 0 0 1rem 1rem; 
          }
          .image-center { 
            display: block; 
            margin: 0 auto; 
          }
        `,
      }}
    />
  );
};

export default TinyMCEeditor;
