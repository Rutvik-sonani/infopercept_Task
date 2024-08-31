import React, { useEffect, useState } from 'react';
import UploadProduct from '../components/UploadProduct';
import ImportProduct from '../components/ImportProduct';
import SummaryApi from '../common';
import AdminProductCard from '../components/AdminProductCard';
import { toast } from 'react-toastify';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { Circles } from 'react-loader-spinner';
import ResponsivePagination from 'react-responsive-pagination';
import 'react-responsive-pagination/themes/classic.css';

const AllProducts = () => {
  const [openUploadProduct, setOpenUploadProduct] = useState(false);
  const [openImportProduct, setOpenImportProduct] = useState(false);
  const [paginationPages] = useState(4);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [checkNewData, setCheckNewData] = useState(false);
  const [allProduct, setAllProduct] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [bulkProductDropdown, setBulkProductDropdown] = useState(false);
  const [sortProductDropdown, setSortProductDropdown] = useState(false);
  const [sortField, setSortField] = useState('productName');
  const [sortOrder, setSortOrder] = useState('asc');

  const fetchAllProduct = async (page = 1) => {
    // const response = await fetch(`${SummaryApi.alladminProduct.url}?page=${page}&limit=${paginationPages}`);
    const response = await fetch(`${SummaryApi.alladminProduct.url}?page=${page}&limit=${paginationPages}&sortField=${sortField}&sortOrder=${sortOrder}`);
    const dataResponse = await response.json();
    setAllProduct(dataResponse?.data || []);
    setTotalPages(dataResponse?.totalPages || 1);
  };

  // useEffect(() => {
  //   fetchAllProduct(currentPage);
  // }, [currentPage, checkNewData]);

  useEffect(() => {
    fetchAllProduct(currentPage);
  }, [currentPage, checkNewData, sortField, sortOrder]);

  // const handlePageChange = (newPage) => {
  //   if (newPage >= 1 && newPage <= totalPages) {
  //     setCurrentPage(newPage);
  //   }
  // };

  const handleExportProduct = async () => {
    try {
      NProgress.start();
      setCheckNewData(true);
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
      setCheckNewData(false);
      NProgress.done();
    } catch (error) {
      NProgress.done();
      console.error('Error exporting products:', error);
    }
  };

  const HandleFackDataProduct = async () => {
    try {
      setCheckNewData(true);
      NProgress.start();
      const response = await fetch(SummaryApi.FackProduct.url, {
        method: SummaryApi.FackProduct.method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      console.log(result.message);
      NProgress.done();
      setCheckNewData(false);
      toast.success('Fack Data Inserted, please refresh it...');
    } catch (error) {
      NProgress.done();
      console.error('Error exporting products:', error);
    }
  };

  const handleBulkProductStatus = async (status) => {
    if (selectedProducts.length === 0) {
      console.error('No products selected');
      return;
    }

    const selectedProductIds = selectedProducts.map((product) => product._id);

    try {
      NProgress.start();
      setCheckNewData(true);
      const response = await fetch(SummaryApi.bulkProduct.url, {
        method: SummaryApi.bulkProduct.method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productIds: selectedProductIds,
          status,
        }),
      });

      const result = await response.json();
      console.log(result.message);
      fetchAllProduct(currentPage);
    } catch (error) {
      console.error('Bulk update error:', error);
    } finally {
      setCheckNewData(false);
      NProgress.done();
      setBulkProductDropdown(false);
    }
  };

  const handleSortChange = (field, order) => {
    setSortField(field);
    setSortOrder(order);
    // fetchAllProduct(currentPage);
    setSortProductDropdown(false);
  };

  const handleProductSelection = (product) => {
    setSelectedProducts((prevSelected) => {
      const isSelected = prevSelected.find((p) => p._id === product._id);
      if (isSelected) {
        return prevSelected.filter((p) => p._id !== product._id);
      } else {
        return [...prevSelected, product];
      }
    });
  };

  return (
    <div>
      <div className="bg-white py-2 px-4 flex justify-between items-center">
        <h2 className="font-bold text-lg">All Products</h2>
        <div className="flex gap-2">
          <button
            className="border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-all py-1 px-3 rounded-full"
            onClick={() => setOpenUploadProduct(true)}
          >
            Upload Product
          </button>
          <button
            className="border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition-all py-1 px-3 rounded-full"
            onClick={() => setOpenImportProduct(true)}
          >
            Import Product
          </button>
          <button
            className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all py-1 px-3 rounded-full"
            onClick={handleExportProduct}
          >
            Export Product
          </button>
          <button
            className="border-2 border-pink-600 text-pink-600 hover:bg-pink-600 hover:text-white transition-all py-1 px-3 rounded-full"
            onClick={HandleFackDataProduct}
          >
            Fack Product
          </button>

          <div className="relative z-10">
            <button
              className="border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white transition-all py-1 px-3 rounded-full"
              onClick={() => setBulkProductDropdown(!bulkProductDropdown)}
            >
              Bulk Product
            </button>

            {bulkProductDropdown && (
              <div className="absolute right-0 mt-2 py-2 w-48 bg-white border rounded shadow-xl">
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                  onClick={() => handleBulkProductStatus('Active')}
                >
                  Active
                </button>
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                  onClick={() => handleBulkProductStatus('Inactive')}
                >
                  Inactive
                </button>
              </div>
            )}


          </div>


          <div className="relative z-10">
            <button
              className="border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white transition-all py-1 px-3 rounded-full"
              onClick={() => setSortProductDropdown(!sortProductDropdown)}
            >
              Sort
            </button>

            {sortProductDropdown && (
              <div className="absolute right-0 mt-2 py-2 w-48 bg-white border rounded shadow-xl">
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                  onClick={() => handleSortChange('productName', 'asc')}
                >
                  Product Name Asc
                </button>
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                  onClick={() => handleSortChange('productName', 'desc')}
                >
                  Product Name Desc
                </button>
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                  onClick={() => handleSortChange('createdAt', 'asc')}
                >
                  Created At Asc
                </button>
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                  onClick={() => handleSortChange('createdAt', 'desc')}
                >
                  Created At Desc
                </button>
              </div>
            )}
          </div>


        </div>
      </div>

      {checkNewData ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '50vh',
          }}
        >
          <Circles
            height="40"
            width="40"
            color="#4fa94d"
            ariaLabel="circles-loading"
            wrapperStyle={{
              width: '100px',
              margin: 'auto',
            }}
            wrapperClass=""
            visible={checkNewData}
          />
        </div>
      ) : (
        <>
          <div className="flex items-center flex-wrap gap-5 py-4 h-[calc(100vh-190px)] overflow-y-scroll">
            {allProduct.map((product, index) => (
              <AdminProductCard
                data={product}
                key={index + 'allProduct'}
                fetchdata={fetchAllProduct}
                onProductSelect={handleProductSelection}
                isSelected={selectedProducts.some((p) => p._id === product._id)}
              />
            ))}
          </div>



          {/* <div className="flex justify-between items-center py-4">
            <button
              className="px-4 py-2 border rounded"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="px-4 py-2 border rounded"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div> */}
          <ResponsivePagination
            current={currentPage}
            total={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}

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

