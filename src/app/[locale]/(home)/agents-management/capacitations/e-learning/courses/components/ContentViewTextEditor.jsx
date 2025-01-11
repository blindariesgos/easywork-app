'use client';

import React, { useEffect, useState, useRef, forwardRef, useImperativeHandle, useCallback } from 'react';
import useAppContext from '@/src/context/app';
import 'react-quill/dist/quill.snow.css';
import ReactQuill, { Quill } from 'react-quill';
import DropdownVisibleUsers from '@/src/components/DropdownVisibleUsers';
// const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

import ImageResize from 'quill-resize-image';
import { uploadCourseImage } from '../../../api/pages/e-learning/courses/courses';
import { toast } from 'react-toastify';

Quill.register('modules/resize', ImageResize);

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
  'header',
  'direction',
];

const ContentViewTextEditor = forwardRef(({ value, onChange, className, onChangeSelection, setValue, disabled = false, handleKeyDown, onDeleteImage }, ref) => {
  const container = [
    ['bold', 'italic', 'underline', 'strike'], // toggled buttons
    ['blockquote'],
    ['link', 'image', 'video'],
    [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
    [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
    [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
    [{ color: [] }, { background: [] }], // dropdown with defaults from theme
    [{ font: [] }],
    [{ align: [] }],
    ['clean'], // remove formatting button
  ];

  const { lists } = useAppContext();
  const localQuillRef = useRef(null); // Local ref to manage dynamic component ref
  const [arroba, setArroba] = useState(false);
  const [dataUsers, setDataUsers] = useState([]);
  const [userSelected, setUserSelected] = useState(null);
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });
  const [internalImages, setInternalImages] = useState([]);

  useImperativeHandle(ref, () => ({
    getEditor: () => localQuillRef.current?.getEditor(),
  }));

  const handleChange = (newValue, delta, source, editor) => {
    setArroba(false);
    const text = editor?.getText();
    if (delta?.ops && delta.ops.length > 0) {
      delta.ops.forEach(obj => {
        if (obj.insert === '@') {
          const atIndex = text?.indexOf('@');
          const range = editor?.getBounds(atIndex);
          setModalPosition({ x: range?.left, y: range?.bottom });
          setArroba(true);
        }
      });
    }
    setValue(newValue);
  };

  const extractImageUrls = html => {
    // Extrae URLs de imágenes del contenido HTML usando una expresión regular
    const imageUrls = [];
    const imgTags = html.match(/<img [^>]*src="[^"]*"[^>]*>/g) || [];
    imgTags.forEach(tag => {
      const srcMatch = tag.match(/src="([^"]*)"/);
      if (srcMatch && srcMatch[1]) {
        imageUrls.push(srcMatch[1]);
      }
    });
    return imageUrls.filter(imageUrl => !imageUrl.startsWith('data:image/'));
  };

  const embedImage = imageUrl => {
    const quill = localQuillRef.current;
    if (quill) {
      const range = quill.getEditorSelection();
      range && quill.getEditor().insertEmbed(range.index, 'image', imageUrl);
    }
  };

  const uploadImage = async image => {
    try {
      const formData = new FormData();
      formData.append('image', image);
      return await uploadCourseImage(formData);
    } catch (error) {
      toast.error('Tenemos problemas para guardar la imagen insertada');
    }
  };

  const imageHandler = useCallback(() => {
    const input = document.createElement('input');

    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      if (input !== null && input.files !== null) {
        const file = input.files[0];

        if (file) {
          // Insert base64 at text editor
          const reader = new FileReader();
          reader.onloadend = () => {
            embedImage(reader.result);
          };
          reader.readAsDataURL(file);

          // Add image to content view state
          const quill = localQuillRef.current.getEditor();

          if (quill) {
            const fileUrl = await uploadImage(file);
            const images = quill.container.querySelectorAll('img');
            images.forEach(img => {
              const src = img.getAttribute('src');
              if (src.startsWith('data:image/')) img.setAttribute('src', fileUrl);
            });
          }
        }
      }
    };
  }, []);

  const onChangeCustom = event => {
    const { value } = event.target;
    const filteredData = lists.users.filter(user => user.name.toLowerCase().includes(value.toLowerCase()));
    setDataUsers(filteredData);
  };

  useEffect(() => {
    if (lists?.users) {
      setDataUsers(lists.users);
    }
  }, [lists]);

  const addUserSelected = user => {
    const editor = localQuillRef.current?.getEditor();
    if (editor) {
      const quillEditor = editor;
      const currentContents = quillEditor.getContents();

      const newContent = currentContents.ops.map(op => ({
        insert: op.insert.replace(/\n$/, '').replace('@', ''),
        attributes: { ...op.attributes },
      }));

      quillEditor.setContents([
        ...newContent,
        {
          insert: user.name,
          attributes: {
            color: '#86BEDF',
            underline: true,
            // link: `/sales/crm/contacts/contact/${user.id}?show=true&page=1`,
          },
        },
        { insert: ' ' },
      ]);
      setUserSelected(null);
    }
  };

  const handleInternalChange = (newContent, delta, source, editor) => {
    // Actualizar el estado de imágenes

    const currentImages = extractImageUrls(newContent);

    // console.log('🚀 ~ handleInternalChange ~ currentImages:', currentImages);
    // console.log('🚀 ~ handleInternalChange ~ internalImages:', internalImages);

    const removedImages = internalImages.filter(img => !currentImages.includes(img));
    if (removedImages.length > 0) {
      console.log('🚀 ~ handleInternalChange ~ removedImages:', removedImages);
      onDeleteImage(removedImages);
    }

    setInternalImages(currentImages);

    if (onChange) {
      onChange(newContent, delta, source, editor);
    } else if (handleChange) {
      handleChange(newContent, delta, source, editor);
    }
  };

  useEffect(() => {
    if (userSelected) {
      addUserSelected(userSelected.username);
    }
  }, [userSelected]);

  // useEffect(() => {
  //   if (localQuillRef.current?.lastDeltaChangeSet?.ops[1]?.delete === 1) {
  //     const currentImages = extractImageUrls(value);

  //     // Detectar imágenes eliminadas
  //     const removedImages = internalImages.filter(img => !currentImages.includes(img));
  //     if (removedImages.length > 0) {
  //       console.log(removedImages);
  //       onDeleteImage(removedImages);
  //     }
  //   }
  // }, [localQuillRef.current?.lastDeltaChangeSet?.ops[1]?.delete]);

  // console.log(internalImages);

  return (
    <div className="w-full relative">
      <ReactQuill
        ref={localQuillRef}
        value={value}
        onChange={handleInternalChange}
        modules={{
          toolbar: {
            container,
            handlers: {
              image: imageHandler,
            },
          },
          resize: {
            locale: {},
          },
        }}
        formats={formats}
        theme="snow"
        className={className}
        onChangeSelection={onChangeSelection}
        readOnly={disabled}
        onKeyDown={handleKeyDown}
      />
      {arroba && (
        <DropdownVisibleUsers
          mentionButtonRef={null}
          prueba={ref}
          dataUsers={dataUsers}
          modalPosition={modalPosition}
          onChangeCustom={onChangeCustom}
          setUserSelected={addUserSelected}
          userSelected={userSelected}
          setDropdownVisible={setArroba}
        />
      )}
    </div>
  );
});

ContentViewTextEditor.displayName = 'ContentViewTextEditor';

export default ContentViewTextEditor;
