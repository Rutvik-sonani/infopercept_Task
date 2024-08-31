import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { MdModeEditOutline,MdDownload } from 'react-icons/md';
import AdminEditProduct from './AdminEditProduct';
import displayINRCurrency from '../helpers/displayCurrency';
import jsPDF from 'jspdf';
import 'jspdf-autotable';


const AdminProductCard = ({ data, fetchdata, onProductSelect, isSelected }) => {
  const [editProduct, setEditProduct] = useState(false);

  useEffect(() => {
    if (data.status === 'Inactive' && !isSelected) {
      handleCheckboxChange();
    }else if (data.status === 'Active' && isSelected) {
      handleCheckboxChange(false);
    }
  }, [data.status]); 

  const handleCheckboxChange = () => {
    if (typeof onProductSelect === 'function') {
      onProductSelect(data);
    } else {
      console.error('onProductSelect is not a function');
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    const tableColumn = ["Field", "Value"];
    const tableRows = [
        ["Product Name", data.productName],
        ["Selling Price", displayINRCurrency(data.sellingPrice)],
        ["Brand Name",data.brandName],
        ["Category",data.category],
        ["Status", data.status],
        ["Uploaded Time",data.createdAt],
        ["Product Image",data.productImage],
    ];

    doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 10, 
    });

    doc.save(`${data.productName}.pdf`);
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
        {/* <p>
          {format(data.createdAt,'yyyy/MM/dd kk:mm:ss')}
        </p> */}
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

        <div
          className='p-2 bg-blue-100 hover:bg-blue-600 rounded-full hover:text-white cursor-pointer'
          onClick={handleDownloadPDF}
        >
          <MdDownload />
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
