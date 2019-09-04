import React, { useState, useRef } from "react";
import { render } from "react-dom";
import ReactQuill, { Mixin, Toolbar, Quill } from "react-quill";
import Dropzone, { ImageFile } from "react-dropzone";
import "react-quill/dist/quill.snow.css";
import "./style.css";

const __ISMSIE__ = navigator.userAgent.match(/Trident/i) ? true : false;
const __ISIOS__ = navigator.userAgent.match(/iPad|iPhone|iPod/i) ? true : false;

let onKeyEvent = false;

const QuillWysiwyg = props => {
  const [subject, setSubject] = useState("");
  const [contents, setContents] = useState(__ISMSIE__ ? "<p>&nbsp;</p>" : "");
  const [workings, setWorkings] = useState({});
  const [fileIds, setFileIds] = useState([]);

  let quillRef = useRef(null);
  let dropzone = useRef(null);

  const saveFile = file => {
    console.log("file", file);

    const nowDate = new Date().getTime();
    setWorkings({ ...workings, [nowDate]: true });

    return uploadFile([file]).then(
      results => {
        const { sizeLargeUrl, objectId } = results[0];

        setWorkings({ ...workings, [nowDate]: false });
        setFileIds([...fileIds, objectId]);
        return Promise.resolve({ url: sizeLargeUrl });
      },
      error => {
        console.error("saveFile error:", error);
        workings[nowDate] = false;
        setWorkings(workings);
        return Promise.reject(error);
      }
    );
  };

  const onDrop = async acceptedFiles => {
    try {
      await acceptedFiles.reduce((pacc, _file, i) => {
        return pacc.then(async () => {
          const { url } = await saveFile(_file);

          const quill = quillRef.current.getEditor();
          const range = quill.getSelection();
          quill.insertEmbed(range.index, "image", url);
          quill.setSelection(range.index + 1);
          quill.focus();
        });
      }, Promise.resolve());
    } catch (error) {}
  };

  const imageHandler = () => {
    if (dropzone) {
      dropzone.current.open();
    }
  };

  const modules = {
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
      ],
      handlers: { image: imageHandler }
    },
    clipboard: { matchVisual: false }
  };

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

  const onKeyUp = event => {
    console.log("onKeyEvent", onKeyEvent);
    console.log("quillRef", quillRef);
    if (!__ISIOS__) return;
    // enter
    if (event.keyCode === 13) {
      onKeyEvent = true;
      quillRef.current.blur();
      quillRef.current.focus();
      if (document.documentElement.className.indexOf("edit-focus") === -1) {
        console.log("onKeyUp invoked");
        document.documentElement.classList.toggle("edit-focus");
      }
      onKeyEvent = false;
    }
  };

  const onFocus = () => {
    if (
      !onKeyEvent &&
      document.documentElement.className.indexOf("edit-focus") === -1
    ) {
      console.log("onFocus invoked");
      document.documentElement.classList.toggle("edit-focus");
      window.scrollTo(0, 0);
    }
  };

  const onBlur = () => {
    if (
      !onKeyEvent &&
      document.documentElement.className.indexOf("edit-focus") !== -1
    ) {
      console.log("onBlur invoked");
      document.documentElement.classList.toggle("edit-focus");
    }
  };

  const doBlur = () => {
    onKeyEvent = false;
    quillRef.current.blur();
    // force clean
    if (document.documentElement.className.indexOf("edit-focus") !== -1) {
      document.documentElement.classList.toggle("edit-focus");
    }
  };

  const onChangeContents = (_, delta, source, editor) => {
    let contents = editor.getContents();
    let _contents = null;
    if (__ISMSIE__) {
      if (contents.indexOf("<p><br></p>") > -1) {
        _contents = contents.replace(/<p><br><\/p>/gi, "<p>&nbsp;</p>");
      }
    }
    console.log("_contents", _contents || contents);
    setContents(_contents || contents);
  };

  return (
    <div className="main-panel">
      <div className="main-content">
        <ReactQuill
          ref={quillRef}
          value={contents}
          defaultValue={{ ops: [] }}
          onChange={onChangeContents}
          onKeyUp={onKeyUp}
          onFocus={onFocus}
          onBlur={onBlur}
          theme="snow"
          modules={modules}
          formats={formats}
        />
        {/* <Dropzone
          ref={dropzone}
          style={{ width: 0, height: 0 }}
          onDrop={onDrop}
          accept="image/*"
        /> */}
      </div>
    </div>
  );
};

export default QuillWysiwyg;

// render(<App />, document.getElementById("root"));
