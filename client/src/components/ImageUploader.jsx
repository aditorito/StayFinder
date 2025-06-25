// ImageUploader.jsx
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { useRecoilState } from "recoil";
import { imagesAtom } from "../store/atoms/Register";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const ImageUploader = () => {
    const [images, setImages] = useRecoilState(imagesAtom);

    const onDrop = useCallback(async (acceptedFiles) => {
        for (const file of acceptedFiles) {
            const formData = new FormData();
            formData.append("image", file); // match multer key on backend


            try {
                const yourToken = localStorage.getItem('token')
                const res = await axios.post(
                    `${backendUrl}/bookings/upload`,
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                            "Authorization": `${yourToken}`, // Add this
                        },
                    }
                );
                const url = res.data.imageUrl;              


                setImages((prev) => [...prev, url]); // adjust based on backend response
                
            } catch (err) {
                console.error("Upload error:", err);
            }
        }
    }, [setImages]);


    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { "image/*": [] },
        multiple: true,
    });

    return (
        <div className="md:col-span-2">
            <label className="block mb-2 text-sm font-medium text-gray-700">Upload Images</label>

            <div
                {...getRootProps()}
                className={`w-full px-4 py-10 border-2 border-dashed rounded-lg text-center cursor-pointer transition-all ${isDragActive ? "border-rose-500 bg-rose-50" : "border-gray-300"
                    }`}
            >
                <input {...getInputProps()} />
                {isDragActive ? (
                    <p className="text-gray-600">Drop the files here...</p>
                ) : (
                    <p className="text-gray-500">Drag & drop images here, or click to select</p>
                )}
            </div>

            {images.length > 0 && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {images.map((url, idx) => (
                        <img
                            key={idx}
                            src={url}
                            alt={`Uploaded ${idx}`}
                            className="w-full h-32 object-cover rounded-md shadow"
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

// Convert file to base64 (for Cloudinary upload)
function convertToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
}
