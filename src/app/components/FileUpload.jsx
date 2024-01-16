'use client';
import React from 'react';
const FileUpload = ({ onFileChange }) => {
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        onFileChange(file);
    }
  return (
    <div className='flex justify-center flex-col border-2' >
        <label htmlFor="file">Choose file to upload</label>
        <input type="file" name='file' onChange={(e) => handleFileChange(e)} />
    </div>
  )
}

export default FileUpload