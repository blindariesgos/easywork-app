'use client';
import React, { useRef, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const TextEditor = ({ value, onChange, className, onChangeSelection, quillRef }) => {
  const modules = {
    toolbar: [
        ['bold', 'italic', 'underline', 'strike'],
        ['clean'],
        [{ 'color': [] }],
        [{ 'font': [] }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        ['code-block', 'blockquote',],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'indent': '-1' }, { 'indent': '+1' }],
        [{ 'align': [] }],
        ['link', 'image', 'video'],
    ],
  };


  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'link',
    'image',
    'video',
    'size',
    'font',
    'color',
    'background',
    'align',
    'script',
    'header',
    'direction',
  ];

  return (
    <div>
      <ReactQuill
        ref={quillRef}
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        theme="snow"
        className={className}
        onChangeSelection={onChangeSelection}
      />
    </div>
  );
};

export default TextEditor;