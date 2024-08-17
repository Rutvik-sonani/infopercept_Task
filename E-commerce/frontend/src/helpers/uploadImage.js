const url = `https://api.cloudinary.com/v1_1/dzo7ww47f/image/upload`

const uploadImage  = async(image) => {
    const formData = new FormData()
    formData.append("file",image)
    formData.append("upload_preset","mern_product")
    

    const dataResponse = await fetch(url,{
        method : "post",
        body : formData
    })

    console.log("Upload img status : ",dataResponse);

    return dataResponse.json()

}

export default uploadImage 