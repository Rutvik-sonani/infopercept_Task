import React, { useEffect, useState } from 'react';
import UploadProduct from '../components/UploadProduct';
import ImportProduct from '../components/ImportProduct';
import SummaryApi from '../common';
import AdminProductCard from '../components/AdminProductCard';

const AllProducts = () => {
  const [openUploadProduct, setOpenUploadProduct] = useState(false);
  const [openImportProduct, setOpenImportProduct] = useState(false);
  const [allProduct, setAllProduct] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [bulkProductDropdown, setBulkProductDropdown] = useState(false);

  const fetchAllProduct = async () => {
    const response = await fetch(SummaryApi.alladminProduct.url);
    const dataResponse = await response.json();
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

  // const handleBulkProductStatus = async (status) => {
  //   const selectedProductIds = allProduct.filter(product => product.isSelected).map(product => product._id);
  //   try {

  //     console.log("selectedProductIds",selectedProducts);

  //       const response = await fetch(SummaryApi.bulkProduct.url, {
  //           method: SummaryApi.bulkProduct.method,
  //           credentials : 'include',
  //           headers: {
  //               'Content-Type': 'application/json',
  //           },
  //           body: JSON.stringify({
  //               productIds: selectedProductIds,
  //               status
  //           }),
  //       });

  //       const result = await response.json();
  //       console.log(result.message);
  //       fetchAllProduct();
  //   } catch (error) {
  //       console.error('Bulk update error:', error);
  //   }
  // };

  const handleBulkProductStatus = async (status) => {
    if (selectedProducts.length === 0) {
      console.error('No products selected');
      return;
    }
  
    const selectedProductIds = selectedProducts.map(product => product._id);
    
    try {
      const response = await fetch(SummaryApi.bulkProduct.url, {
        method: SummaryApi.bulkProduct.method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productIds: selectedProductIds,
          status
        }),
      });
  
      const result = await response.json();
      console.log(result.message);
      fetchAllProduct();
    } catch (error) {
      console.error('Bulk update error:', error);
    }finally {
      setBulkProductDropdown(false); // Close the dropdown after the status is updated
    }  
  };
  

  const handleProductSelection = (product) => {
    setSelectedProducts((prevSelected) => {
      const isSelected = prevSelected.find(p => p._id === product._id);
      if (isSelected) {
        return prevSelected.filter(p => p._id !== product._id);
      } else {
        return [...prevSelected, product];
      }
    });
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

          <div className="relative">
            <button
              className='border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white transition-all py-1 px-3 rounded-full'
              onClick={() => setBulkProductDropdown(!bulkProductDropdown)}
            >
              Bulk Product
            </button>

            {bulkProductDropdown && (
              <div className="absolute right-0 mt-2 py-2 w-48 bg-white border rounded shadow-xl">
                <button
                  className='block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-200'
                  onClick={() => handleBulkProductStatus('Active')}
                >
                  Active
                </button>
                <button
                  className='block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-200'
                  onClick={() => handleBulkProductStatus('Inactive')}
                >
                  Inactive
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className='flex items-center flex-wrap gap-5 py-4 h-[calc(100vh-190px)] overflow-y-scroll'>
        {allProduct.map((product, index) => (
          <AdminProductCard
            data={product}
            key={index + "allProduct"}
            fetchdata={fetchAllProduct}
            onProductSelect={handleProductSelection}
            isSelected={selectedProducts.some(p => p._id === product._id)}
          />
        ))}
      </div>

      {openUploadProduct && (
        <UploadProduct onClose={() => setOpenUploadProduct(false)} fetchData={fetchAllProduct} />
      )}

      {openImportProduct && (
        <ImportProduct onClose={() => setOpenImportProduct(false)} fetchData={fetchAllProduct} />
      )}
    </div>
  );
};

export default AllProducts;


// import React, { useEffect, useState } from 'react';
// import UploadProduct from '../components/UploadProduct';
// import ImportProduct from '../components/ImportProduct';
// import SummaryApi from '../common';
// import AdminProductCard from '../components/AdminProductCard';

// const AllProducts = () => {
//   const [openUploadProduct, setOpenUploadProduct] = useState(false);
//   const [openImportProduct, setOpenImportProduct] = useState(false); // State for import modal
//   const [allProduct, setAllProduct] = useState([]);
//   const [bulkProductDropdown, setBulkProductDropdown] = useState(false); // State for Bulk Product dropdown

//   const fetchAllProduct = async () => {
//     const response = await fetch(SummaryApi.allProduct.url);
//     const dataResponse = await response.json();

//     console.log("product data", dataResponse);

//     setAllProduct(dataResponse?.data || []);
//   };

//   useEffect(() => {
//     fetchAllProduct();
//   }, []);

//   const handleExportProduct = async () => {
//     try {
//       const response = await fetch(SummaryApi.exportProduct.url, {
//         method: SummaryApi.exportProduct.method,
//       });

//       if (!response.ok) {
//         throw new Error('Failed to export products');
//       }

//       const url = response.url;
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute('download', 'products.csv');
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//     } catch (error) {
//       console.error('Error exporting products:', error);
//     }
//   };

//   const handleBulkProductStatus = (status) => {
//     console.log(`Bulk product status set to: ${status}`);
//     // Add your logic to handle bulk product status change here.
//     setBulkProductDropdown(false);
//   };

//   return (
//     <div>
//       <div className='bg-white py-2 px-4 flex justify-between items-center'>
//         <h2 className='font-bold text-lg'>All Products</h2>
//         <div className='flex gap-2'>
//           <button
//             className='border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-all py-1 px-3 rounded-full'
//             onClick={() => setOpenUploadProduct(true)}
//           >
//             Upload Product
//           </button>
//           <button
//             className='border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition-all py-1 px-3 rounded-full'
//             onClick={() => setOpenImportProduct(true)}
//           >
//             Import Product
//           </button>
//           <button
//             className='border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all py-1 px-3 rounded-full'
//             onClick={handleExportProduct}
//           >
//             Export Product
//           </button>

//           {/* Bulk Product Dropdown Button */}
//           <div className="relative">
//             <button
//               className='border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white transition-all py-1 px-3 rounded-full'
//               onClick={() => setBulkProductDropdown(!bulkProductDropdown)}
//             >
//               Bulk Product
//             </button>

//             {bulkProductDropdown && (
//               <div className="absolute right-0 mt-2 py-2 w-48 bg-white border rounded shadow-xl">
//                 <button
//                   className='block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-200'
//                   onClick={() => handleBulkProductStatus('Active')}
//                 >
//                   Active
//                 </button>
//                 <button
//                   className='block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-200'
//                   onClick={() => handleBulkProductStatus('Inactive')}
//                 >
//                   Inactive
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Display all products */}
//       <div className='flex items-center flex-wrap gap-5 py-4 h-[calc(100vh-190px)] overflow-y-scroll'>
//         {allProduct.map((product, index) => (
//           <AdminProductCard
//             data={product}
//             key={index + "allProduct"}
//             fetchdata={fetchAllProduct}
//           />
//         ))}
//       </div>

//       {/* Upload product component */}
//       {openUploadProduct && (
//         <UploadProduct onClose={() => setOpenUploadProduct(false)} fetchData={fetchAllProduct} />
//       )}

//       {/* Import product component */}
//       {openImportProduct && (
//         <ImportProduct onClose={() => setOpenImportProduct(false)} fetchData={fetchAllProduct} />
//       )}
//     </div>
//   );
// };

// export default AllProducts;
