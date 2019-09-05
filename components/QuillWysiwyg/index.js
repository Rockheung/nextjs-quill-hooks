import React, { useState, useRef, useMemo, useCallback } from "react";
import { render } from "react-dom";
import ReactQuill, { Mixin, Toolbar, Quill } from "react-quill";
import Dropzone, { ImageFile } from "react-dropzone";
import "react-quill/dist/quill.snow.css";
import "./style.css";

const __ISMSIE__ = navigator.userAgent.match(/Trident/i) ? true : false;
const __ISIOS__ = navigator.userAgent.match(/iPad|iPhone|iPod/i) ? true : false;

let onKeyEvent = false;

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "size",
  "color",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "video",
  "align"
];

const QuillWysiwyg = props => {
  const [subject, setSubject] = useState("");
  const [contents, setContents] = useState(__ISMSIE__ ? "<p>&nbsp;</p>" : "");
  const [workings, setWorkings] = useState({});
  const [fileIds, setFileIds] = useState([]);

  const quillRef = useRef(null);
  const dropzoneRef = useRef(null);

  // const uploadFile = useCallback(
  //   async (files, params) =>
  //     await axios.post("/file/upload", { files, params }),
  //   []
  // );

  // const saveFile = useCallback(file => {
  //   console.log("file", file);

  //   const nowDate = new Date().getTime();
  //   setWorkings({ ...workings, [nowDate]: true });

  //   return uploadFile([file]).then(
  //     results => {
  //       const { sizeLargeUrl, objectId } = results[0];

  //       setWorkings({ ...workings, [nowDate]: false });
  //       setFileIds([...fileIds, objectId]);
  //       return Promise.resolve({ url: sizeLargeUrl });
  //     },
  //     error => {
  //       console.error("saveFile error:", error);
  //       setWorkings({ ...workings, [nowDate]: false });
  //       return Promise.reject(error);
  //     }
  //   );
  // }, []);

  // const onDrop = useCallback(async acceptedFiles => {
  //   try {
  //     await acceptedFiles.reduce((pacc, _file, i) => {
  //       return pacc.then(async () => {
  //         const { url } = await saveFile(_file);

  //         const quill = quillRef.current.getEditor();
  //         const range = quill.getSelection();
  //         quill.insertEmbed(range.index, "image", url);
  //         quill.setSelection(range.index + 1);
  //         quill.focus();
  //       });
  //     }, Promise.resolve());
  //   } catch (error) {}
  // }, []);

  // const imageHandler = useCallback(() => {
  //   if (dropzoneRef) {
  //     dropzoneRef.current.open();
  //   }
  // }, []);

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          ["bold", "italic", "underline", "strike", "blockquote"],
          [{ size: ["small", false, "large", "huge"] }, { color: [] }],
          [
            { list: "ordered" },
            { list: "bullet" },
            { indent: "-1" },
            { indent: "+1" },
            { align: [] }
          ],
          ["link", "image", "video"],
          ["clean"]
        ]
        // handlers: { image: imageHandler }
      },
      clipboard: { matchVisual: false }
    }),
    []
  );

  const onKeyUp = useCallback(event => {
    if (!__ISIOS__) return;
    // enter
    if (event.keyCode === 13) {
      onKeyEvent = true;
      quillRef.current.blur();
      quillRef.current.focus();
      if (document.documentElement.className.indexOf("edit-focus") === -1) {
        document.documentElement.classList.toggle("edit-focus");
      }
      onKeyEvent = false;
    }
  }, []);

  const onFocus = useCallback(() => {
    if (
      !onKeyEvent &&
      document.documentElement.className.indexOf("edit-focus") === -1
    ) {
      document.documentElement.classList.toggle("edit-focus");
      window.scrollTo(0, 0);
    }
  }, []);

  const onBlur = useCallback(() => {
    if (
      !onKeyEvent &&
      document.documentElement.className.indexOf("edit-focus") !== -1
    ) {
      console.log("onBlur invoked");
      document.documentElement.classList.toggle("edit-focus");
    }
  }, []);

  const doBlur = () => {
    onKeyEvent = false;
    quillRef.current.blur();
    // force clean
    if (document.documentElement.className.indexOf("edit-focus") !== -1) {
      document.documentElement.classList.toggle("edit-focus");
    }
  };

  const onChangeContents = contents => {
    let _contents = null;
    if (__ISMSIE__) {
      if (contents.indexOf("<p><br></p>") > -1) {
        _contents = contents.replace(/<p><br><\/p>/gi, "<p>&nbsp;</p>");
      }
    }
    setContents(_contents || contents);
  };

  return (
    <div className="main-panel">
      {/* <Dropzone ref={dropzoneRef} onDrop={onDrop} accept="image/*">
        {({ getRootProps, getInputProps }) => ( */}
      <div className="main-content">
        <ReactQuill
          ref={quillRef}
          value={contents}
          onChange={onChangeContents}
          onKeyUp={onKeyUp}
          onFocus={onFocus}
          onBlur={onBlur}
          theme={"snow"}
          modules={modules}
          formats={formats}
        />
      </div>
      {/* )} */}
      {/* </Dropzone> */}
      {/* <div>{contents}</div> */}
    </div>
  );
};

export default QuillWysiwyg;

// render(<App />, document.getElementById("root"));
