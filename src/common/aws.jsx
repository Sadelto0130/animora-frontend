import axios from '../api/axios.js'

export const uploadImage = async (img) => {

  let imgURL = null

  try {
    /* Se hace una petición al backend para obtener una URL firmada con permisos temporales.*/
    const {data} = await axios.get("/s3url")
    const { uploadURL } = data

    /*Luego, el frontend usa esa URL para hacer un PUT directo de la imagen en el bucket de AWS.*/
    await axios.put(uploadURL, img, {
      headers: {'Content-Type': img.type},
      withCredentials: false
    })
    imgURL = uploadURL.split("?")[0]

  } catch (error) {
    console.error("Error subiendo imagen:", error)
  }

  return imgURL
}

