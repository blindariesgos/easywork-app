// components/PdfToImage.js
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
const Global = require('pdfjs-dist/build/pdf');

const Converter = () => {
  const { t } = useTranslation();
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageData, setImageData] = useState(null);

  const handleFileUpload = (e) => {
    const fileInput = e.target;
    const file = fileInput.files[0];

    if (file) {
      setSelectedFile(file);
    }
  };

  const convertPdfToImages = async (file) => {
    const images = [];
    const data = await readFileData(file);
  
    try {
      const pdf = await Global.getDocument(data).promise;
      const canvas = document.createElement("canvas");
  
      for (let i = 0; i < pdf.numPages; i++) {
        const page = await pdf.getPage(i + 1);
        const viewport = page.getViewport({ scale: 1 });
        const context = canvas.getContext("2d");
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        await page.render({ canvasContext: context, viewport: viewport }).promise;
        images.push(canvas.toDataURL());
      }
  
      canvas.remove();
      return images;
    } catch (error) {
      console.error("Error converting PDF to images:", error);
      throw error; // Propaga el error para manejarlo en el componente principal si es necesario
    }
  };

  const readFileData = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        resolve(event.target.result);
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsArrayBuffer(file);
    });
  };

  return (
    <div>
      <label>
        {t('common:file:attach')}:
        <input type="file" accept=".pdf" onChange={handleFileUpload} />
      </label>
      {selectedFile && (
        <div>
          <p>Selected PDF: {selectedFile.name}</p>
          <button onClick={() => convertPdfToImages(selectedFile)}>{t('common:file:convert')}</button>
        </div>
      )}
      {imageData && (
        <div>
          <p>{t('common:file:generated')}:</p>
          <img src={imageData} alt="Generated Image" style={{ maxWidth: '100%' }} />
        </div>
      )}
    </div>
  );
};

export default Converter;
