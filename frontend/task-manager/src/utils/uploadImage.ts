import { API_PATHS } from "./apiPaths";
import axiosInstance from "./axiosInstance";
import { AxiosError } from "axios";

const uploadImage = async (imageFile: File): Promise<string> => {
  const formData = new FormData();
  formData.append("image", imageFile);

  try {
    const response = await axiosInstance.post<{ imageUrl: string }>(
      API_PATHS.IMAGE.UPLOAD_IMAGE,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data.imageUrl; 
  } catch (error) {
    const err = error as AxiosError;
    console.error("Erro ao fazer upload da imagem: ", err.message);
    throw err;
  }
};

export default uploadImage;
