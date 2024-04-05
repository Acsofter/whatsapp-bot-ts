import fs from "fs/promises";
import axios from "axios";

if (!process.env.API_UPLOAD_FILE)
  throw new Error("la variable API_UPLOAD_FILE es necesaria!");

const get_text_from_pdf = async (filepath: string): Promise<string | void> => {

    const fileContent = await fs.readFile(filepath);

    const options = {
        method: 'post',
        url: process.env.API_UPLOAD_FILE,
        headers: {
          'Content-Type': 'application/pdf'
        },
        data: fileContent
      };

    return new Promise((resolve, reject) => {
        axios(options)
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                reject(error)
            });
    });
};

export default {
  get_text_from_pdf,
};
