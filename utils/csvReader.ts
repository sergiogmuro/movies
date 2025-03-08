import {Movie} from "../types/Movie";
import fs from "fs";
import path from "path";

const readMoviesFromCSV = async (): Promise<Movie[]> => {
  try {
    const filePath = path.join(__dirname, "../public/movies.csv");

    // Asegúrate de que el tipo de 'data' es 'string'
    const data = await new Promise<string>((resolve, reject) => {
      fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
          return reject({error: "Error leyendo el archivo CSV", details: err});
        }
        resolve(data);
      });
    });

    if (!data) {
      throw new Error("El archivo CSV está vacío");
    }

    const rows = data.split("\n").slice(1).filter(row => row.trim() !== "");
    return rows
        .map((row, index) => {
          const columns = row.split(",");

          let image = columns[8] !== "" ? columns[8] : "https://www.shutterstock.com/image-vector/image-icon-600nw-211642900.jpg"

          return {
            id: index,
            name: columns[0] ?? "",
            categoryName: columns[1] ?? "",
            year: columns[2] ?? "",
            file: columns[3] ?? "",
            resolution: columns[4] ?? "",
            language: columns[5] ?? "",
            subtitled: columns[6] === "true",
            url: columns[7] ?? "",
            image: image,
            adult: columns[9] ?? "",
            genre: columns[10] ?? "",
            overview: columns[11] ?? "",
            originalTitle: columns[12] ?? "",
            originalLanguage: columns[13] ?? "",
            releaseDate: columns[14] ?? "",
            popularity: columns[15] ?? "",
          };
        })
        .filter((movie): movie is Movie => movie !== null);
  } catch (err) {
    console.error("Error en la lectura o procesamiento de datos:", err);
    throw err; // Puedes lanzar el error para que sea manejado por quien llama
  }
};

export default readMoviesFromCSV;
