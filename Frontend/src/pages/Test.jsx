import { useState } from "react";
import MediaUpload from "../utils/mediaUpload.js";


export default function Test() {

    const [file, setFile] = useState(null);
    async function handleFileChange() {
        try{
            const url = await MediaUpload(file);
            console.log("File uploaded successfully. Public URL:", url);

        }catch(err) {
            console.error("Error uploading file:", err);
        }
    }

  return (
    <div>
      <h1>Test Page</h1>
      <p>This is a simple test page.</p>
      <input onChange={(e)=> setFile(e.target.files[0])} type="file" placeholder="Type something..." className="border p-2 rounded" />
      <button onClick={handleFileChange} className="bg-blue-500 text-white px-4 py-2 rounded mt-2 hover:bg-blue-600 transition-colors duration-200">
        Click Me
      </button>
    </div>
  );
};

