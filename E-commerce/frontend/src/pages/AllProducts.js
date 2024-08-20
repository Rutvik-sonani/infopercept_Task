import React, { useEffect, useState } from 'react';
import UploadProduct from '../components/UploadProduct';
import ImportProduct from '../components/ImportProduct';
import SummaryApi from '../common';
import AdminProductCard from '../components/AdminProductCard';

const AllProducts = () => {
  const [openUploadProduct, setOpenUploadProduct] = useState(false);
  const [openImportProduct, setOpenImportProduct] = useState(false); // State for import modal
  const [allProduct, setAllProduct] = useState([]);

  const fetchAllProduct = async () => {
    const response = await fetch(SummaryApi.allProduct.url);
    const dataResponse = await response.json();

    console.log("product data", dataResponse);

    setAllProduct(dataResponse?.data || []);
  };

  useEffect(() => {
    fetchAllProduct();
  }, []);

  const handleExportProduct = async () => {
    try {
        const response = await fetch(SummaryApi.exportProduct.url, {
            method: SummaryApi.exportProduct.method,
        });

        if (!response.ok) {
            throw new Error('Failed to export products');
        }

        const url = response.url;
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'products.csv');
        document.body.appendChild(link);
        link.click();
        link.remove();
    } catch (error) {
        console.error('Error exporting products:', error);
    }
};




  return (
    <div>
      <div className='bg-white py-2 px-4 flex justify-between items-center'>
        <h2 className='font-bold text-lg'>All Products</h2>
        <div className='flex gap-2'>
          <button
            className='border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-all py-1 px-3 rounded-full'
            onClick={() => setOpenUploadProduct(true)}
          >
            Upload Product
          </button>
          <button
            className='border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition-all py-1 px-3 rounded-full'
            onClick={() => setOpenImportProduct(true)}
          >
            Import Product
          </button>
          <button
            className='border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all py-1 px-3 rounded-full'
            onClick={handleExportProduct}  
          >
            Export Product
          </button>
        </div>
      </div>

      {/* Display all products */}
      <div className='flex items-center flex-wrap gap-5 py-4 h-[calc(100vh-190px)] overflow-y-scroll'>
        {allProduct.map((product, index) => (
          <AdminProductCard
            data={product}
            key={index + "allProduct"}
            fetchdata={fetchAllProduct}
          />
        ))}
      </div>

      {/* Upload product component */}
      {openUploadProduct && (
        <UploadProduct onClose={() => setOpenUploadProduct(false)} fetchData={fetchAllProduct} />
      )}

      {/* Import product component */}
      {openImportProduct && (
        <ImportProduct onClose={() => setOpenImportProduct(false)} fetchData={fetchAllProduct} />
      )}
    </div>
  );
};

export default AllProducts;
