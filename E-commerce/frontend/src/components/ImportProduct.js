import React, { useState } from 'react';
import { CgClose } from 'react-icons/cg';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import SummaryApi from '../common';
// import * as XLSX from 'xlsx';

const ImportProduct = ({ onClose, fetchData }) => {
  const [file, setFile] = useState(null);
//   const [openFullScreenImage, setOpenFullScreenImage] = useState(false);
//   const [fullScreenImage, setFullScreenImage] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file first.');
      return;
    }
  
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(SummaryApi.importProduct.url, {
        method: SummaryApi.importProduct.method,
        body: formData,
        credentials: 'include'
      });

      // console.log("resposnse1 : ",response);
  
      // Check if response is JSON
      if (response.headers.get('content-type')?.includes('application/json')) {
        const responseData = await response.json();
  
        if (responseData.success) {
          toast.success('Products imported successfully!');
          fetchData();
          onClose();
        } else {
          toast.error(responseData.message || 'Error importing products.');
        }
      } else {
        // Handle non-JSON response
        const text = await response.text();
        console.error('Unexpected response format:', text);
        toast.error('Unexpected server response.');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error importing products.');
    }
  };
  

  return (
    <div className='fixed w-full h-full bg-slate-200 bg-opacity-35 top-0 left-0 right-0 bottom-0 flex justify-center items-center'>
      <div className='bg-white p-4 rounded w-full max-w-2xl h-full max-h-[80%] overflow-hidden'>
        <div className='flex justify-between items-center pb-3'>
          <h2 className='font-bold text-lg'>Import Products</h2>
          <div
            className='w-fit ml-auto text-2xl hover:text-red-600 cursor-pointer'
            onClick={onClose}
          >
            <CgClose />
          </div>
        </div>

        <form
          className='grid p-4 gap-2 overflow-y-scroll h-full pb-5'
          onSubmit={(e) => {
            e.preventDefault();
            handleUpload();
          }}
        >
          <label htmlFor='fileUpload' className='mt-3'>
            Upload CSV File:
          </label>
          <label htmlFor='fileInput'>
            <div className='p-2 bg-slate-100 border rounded h-32 w-full flex justify-center items-center cursor-pointer'>
              <div className='text-slate-500 flex justify-center items-center flex-col gap-2'>
                <span className='text-4xl'>
                  <FaCloudUploadAlt />
                </span>
                <p className='text-sm'>Upload Excel File</p>
                <input
                  type='file'
                  id='fileInput'
                  className='hidden'
                  accept='.csv'
                  onChange={handleFileChange}
                />
              </div>
            </div>
          </label>
          
          <button
            type='submit'
            className='px-3 py-2 bg-red-600 text-white mb-10 hover:bg-red-700'>Upload File</button>
        </form>
      </div>
    </div>
  );
};

export default ImportProduct;
