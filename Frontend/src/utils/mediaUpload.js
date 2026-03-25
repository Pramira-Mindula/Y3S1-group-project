import {createClient} from "@supabase/supabase-js";

let url = "https://ixytspnfduqnpftuuadg.supabase.co";
let key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4eXRzcG5mZHVxbnBmdHV1YWRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzNzg0NjQsImV4cCI6MjA4OTk1NDQ2NH0.tUMKNBc94QyDk6fszBgR314O6grGmYdO1xlAPlzkGW0"
const supabase = createClient(url, key);

export default function MediaUpload(file) {
    return new Promise((resolve,reject) => {

        if(!file) {
            reject("No file provided");
            
        }else{
            const timeStamp = new Date().getTime();
            const fileName = `${timeStamp}_${file.name}`;

            supabase.storage.from("images").upload(fileName, file , {
                upsert: false,
                cacheControl: "3600",
            }).then((res) => { 
                const publicUrl = supabase.storage.from("images").getPublicUrl(fileName).data.publicUrl;
                resolve(publicUrl);
            }).catch((err) => {            
                reject("Error uploading file");
            });
        }
    })

}

