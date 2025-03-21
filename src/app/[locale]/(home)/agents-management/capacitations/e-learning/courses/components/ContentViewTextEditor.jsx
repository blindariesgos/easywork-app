'use client';

import 'react-quill-new/dist/quill.snow.css';

import React, { useState, useRef, forwardRef, useImperativeHandle, useCallback, useEffect } from 'react';
import { toast } from 'react-toastify';
import ReactQuill, { Quill } from 'react-quill-new';
import ImageResize from '@botom/quill-resize-module';

import { useCourses } from '../../hooks/useCourses';

Quill.register('modules/resize', ImageResize);

const formats = [
  'header',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'list',
  // 'bullet',
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

async function base64ToFile(base64String) {
  try {
    const base64Parts = base64String.split(',');
    const base64Data = base64Parts[1];
    const mimeType = base64Parts[0].split(';')[0].split(':')[1];

    if (!mimeType) {
      throw new Error('Mime type inválido en la cadena base64.');
    }

    const res = await fetch(`data:${mimeType};base64,${base64Data}`);
    const blob = await res.blob();

    // Crear el objeto File
    const fileName = `image.${mimeType.split('/')[1] || 'png'}`;
    const file = new File([blob], fileName, { type: mimeType });
    return file;
  } catch (error) {
    console.error('Error al convertir base64 a File:', error);
    return null; // O lanzar el error, dependiendo de cómo quieras manejarlo
  }
}

const ContentViewTextEditor = forwardRef(({ value, onChange, className, onChangeSelection, setValue, disabled = false, handleKeyDown, onDeleteImage }, ref) => {
  const localQuillRef = useRef(null);
  const [internalImages, setInternalImages] = useState([]);

  const { uploadCourseImage } = useCourses();

  useImperativeHandle(ref, () => ({
    getEditor: () => localQuillRef.current?.getEditor(),
  }));

  const handleChange = newValue => {
    setValue(newValue);
  };

  function replaceBase64Images(htmlString, newImageUrls) {
    try {
      const quill = localQuillRef.current;
      if (!quill) return;

      const editor = quill.getEditor();

      if (editor) {
        const images = editor.container.querySelectorAll('img[src^="data:image/"]');
        images.forEach((img, i) => {
          const src = img.getAttribute('src');
          if (newImageUrls[i] && src.startsWith('data:image/')) img.setAttribute('src', newImageUrls[i]);
        });
      }
    } catch (error) {
      console.error('Error al parsear o modificar el HTML:', error);
      return htmlString;
    }
  }

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

    const imagesWithUrls = imageUrls.filter(imageUrl => !imageUrl.startsWith('data:image/'));
    const base64Images = imageUrls.filter(imageUrl => imageUrl.startsWith('data:image/'));

    return { imagesWithUrls, base64Images };
  };

  const uploadImage = useCallback(
    async image => {
      try {
        const formData = new FormData();
        formData.append('image', image);
        return await uploadCourseImage(formData);
      } catch (error) {
        toast.error('Tenemos problemas para guardar la imagen insertada');
      }
    },
    [uploadCourseImage]
  );

  const processImage = useCallback(
    async ({ file, base64preview = true }) => {
      const quill = localQuillRef.current;
      if (!quill) return;

      const embedImage = imageUrl => {
        const range = quill.getEditorSelection();
        range && quill.getEditor().insertEmbed(range.index, 'image', imageUrl);
      };

      try {
        if (base64preview) {
          const reader = new FileReader();
          reader.onloadend = () => {
            embedImage(reader.result);
          };
          reader.readAsDataURL(file);
        }

        // Add image to content view state
        const editor = quill.getEditor();

        if (editor) {
          const fileUrl = await uploadImage(file);

          if (base64preview) {
            const images = editor.container.querySelectorAll('img');
            images.forEach(img => {
              const src = img.getAttribute('src');
              if (src.startsWith('data:image/')) img.setAttribute('src', fileUrl);
            });
          } else {
            embedImage(fileUrl);
          }
        }
      } catch (error) {
        console.log(error);
        toast.error('Tenemos problemas para guardar la imagen insertada');
      }
    },
    [uploadImage]
  );

  const imageHandler = useCallback(() => {
    const input = document.createElement('input');

    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      if (input !== null && input.files !== null) {
        const file = input.files[0];

        if (file) processImage({ file });
      }
    };
  }, [processImage]);

  const handleInternalChange = async newContent => {
    if (!newContent.includes('data:image/jpeg;base64,')) {
      if (onChange) {
        onChange(newContent);
      } else if (handleChange) {
        handleChange(newContent);
      }
    }

    const { imagesWithUrls, base64Images } = extractImageUrls(newContent);

    if (base64Images.length > 0) {
      const files = await Promise.all(base64Images.map(base64ToFile));
      const uploadedFiles = await Promise.all(files.map(file => uploadImage(file)));

      replaceBase64Images(newContent, uploadedFiles);

      const newInternalImages = [...imagesWithUrls, ...uploadedFiles];

      const removedImages = internalImages.filter(img => !newInternalImages.includes(img));
      if (removedImages.length > 0) onDeleteImage(removedImages);

      setInternalImages(newInternalImages);
      return;
    }

    const removedImages = internalImages.filter(img => !imagesWithUrls.includes(img));
    if (removedImages.length > 0) onDeleteImage(removedImages);

    setInternalImages(imagesWithUrls);
  };

  return (
    <div className="relative">
      <ReactQuill
        ref={localQuillRef}
        value={value}
        onChange={handleInternalChange}
        modules={{
          toolbar: {
            container,
            // handlers: {
            //   image: imageHandler,
            // },
          },
          resize: {
            locale: {
              altTip: 'Hold down the alt key to zoom',
              floatLeft: 'Izquierda',
              floatRight: 'Derecha',
              center: 'Centrar',
              restore: 'Reiniciar',
            },
          },
        }}
        formats={formats}
        theme="snow"
        className={className}
        onChangeSelection={onChangeSelection}
        readOnly={disabled}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
});

ContentViewTextEditor.displayName = 'ContentViewTextEditor';

export default ContentViewTextEditor;
