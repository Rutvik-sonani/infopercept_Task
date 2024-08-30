import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { MdModeEditOutline } from 'react-icons/md';
import AdminEditProduct from './AdminEditProduct';
import displayINRCurrency from '../helpers/displayCurrency';

const AdminProductCard = ({ data, fetchdata, onProductSelect, isSelected }) => {
  const [editProduct, setEditProduct] = useState(false);

  // Monitor the status of the product and select it if it's inactive
  useEffect(() => {
    if (data.status === 'Inactive' && !isSelected) {
      handleCheckboxChange();
    }else if (data.status === 'Active' && isSelected) {
      // Automatically uncheck the checkbox if the status is 'Active'
      handleCheckboxChange(false);
    }

    

  }, [data.status]); // Effect runs whenever data.status changes

  const handleCheckboxChange = () => {
    if (typeof onProductSelect === 'function') {
      onProductSelect(data);
    } else {
      console.error('onProductSelect is not a function');
    }
  };

  return (
    <div className={`bg-white p-4 rounded relative ${isSelected ? 'border-2 border-blue-600' : ''}`}>
      <div className='w-40'>
        <div className='w-32 h-32 flex justify-center items-center'>
          <img src={data?.productImage[0]} className='mx-auto object-fill h-full' alt='Product' />
        </div>
        <h1 className='text-ellipsis line-clamp-2'>{data.productName}</h1>
        <p className='font-semibold'>
          {displayINRCurrency(data.sellingPrice)}
        </p>
        <p>
          {format(data.createdAt,'yyyy/MM/dd kk:mm:ss')}
        </p>
      </div>

      <div className='absolute bottom-2 right-2 flex items-center gap-2'>
        <input
          type='checkbox'
          checked={isSelected}
          onChange={handleCheckboxChange}
          className='mr-2'
        />
        <div
          className='p-2 bg-green-100 hover:bg-green-600 rounded-full hover:text-white cursor-pointer'
          onClick={() => setEditProduct(true)}
        >
          <MdModeEditOutline />
        </div>
      </div>

      {editProduct && (
        <AdminEditProduct
          productData={data}
          onClose={() => setEditProduct(false)}
          fetchdata={fetchdata}
        />
      )}
    </div>
  );
};

export default AdminProductCard;
