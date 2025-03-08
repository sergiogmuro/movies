const axios = require('axios');
const cheerio = require('cheerio');
const {createObjectCsvWriter} = require('csv-writer');

const BASE_URL = 'https://www.innovatv.store/contenido/';

const EXCLUDED_CATEGORIES = ['CINE CAM'];

const csvWriter = createObjectCsvWriter({
    path: 'public/movies' + new Date() + '.csv',
    header: [
        {id: 'movieName', title: 'Name'},
        {id: 'categoryName', title: 'Category Name'},
        {id: 'year', title: 'Year'},
        {id: 'file', title: 'File'},
        {id: 'resolution', title: 'Resolution'},
        {id: 'language', title: 'Language'},
        {id: 'subtitled', title: 'Subtitled'},
        {id: 'url', title: 'URL'},
        {id: 'image', title: 'Image'},
        {id: 'adult', title: 'Adult'},
        {id: 'genre', title: 'Genre'},
        {id: 'overview', title: 'Overview'},
        {id: 'originalTitle', title: 'Original Title'},
        {id: 'originalLanguage', title: 'Original Language'},
        {id: 'release_date', title: 'Release Date'},
        {id: 'popularity', title: 'Popularity'},
    ]
});

async function fetchHTML(url) {
    try {
        const {data} = await axios.get(url);
        return cheerio.load(data);
    } catch (error) {
        console.error(`❌ Error al obtener ${url}:`, error.message);
        return null;
    }
}

async function scrapeIndex() {
    const $ = await fetchHTML(BASE_URL);
    if (!$) return;

    let categories = [];

    $('a').each((_, element) => {
        let name = $(element).text().trim();
        if (name.endsWith('/') && name !== 'Parent Directory/') {
            categories.push(name.replace('/', ''));
        }
    });

    console.log('📂 Categorías encontradas:', categories);

    for (const category of categories) {
        if (!EXCLUDED_CATEGORIES.includes(category)) {
            await scrapeCategory(`${BASE_URL}${category}/`, category);
        }
    }
}

async function scrapeCategory(categoryUrl, categoryName) {
    console.log(`\n🔍 Explorando categoría: ${categoryName} - ${categoryUrl}`);

    const $ = await fetchHTML(categoryUrl);
    if (!$) return;

    let movies = [];

    $('a').each((_, element) => {
        let name = $(element).text().trim();
        if (name.endsWith('/') && name !== 'Parent Directory/') {
            movies.push(name.replace('/', ''));
        }
    });

    console.log(`📁 ${movies.length} películas encontradas en ${categoryName}:`, movies);

    for (const movie of movies) {
        await scrapeMovie(`${categoryUrl}${movie}/`, movie, categoryName);
    }
}

async function scrapeMovie(movieUrl, movieName, categoryName) {
    console.log(`\n🎬 Explorando película: ${movieName} - ${movieUrl}`);

    const $ = await fetchHTML(movieUrl);
    if (!$) {
        let fileDetails = [{
            name: '',
            category: '',
            year: '',
            file: '',
            resolution: '',
            language: '',
            subtitle: '',
            url: movieUrl
        }];

        await storeData(fileDetails);

        return;
    }

    let files = [];

    $('a').each((_, element) => {
        let name = $(element).text().trim();
        if (!name.endsWith('/') && !['Parent Directory', 'Name', 'Last modified', 'Size', 'Description'].includes(name)) {
            files.push(name);
        }
    });

    let imageExtras = await getMovieExtras(movieName);

    let movieYear = extractYear(movieName, files);
    let fileDetails = files.map(file => ({
        movieName,
        categoryName,
        year: movieYear,
        file,
        resolution: extractResolution(file),
        ...extractLanguage(file),
        url: movieUrl + file,
        ...imageExtras
    }));

    console.log(`🎬 Explorando película: ${movieName}`);
    console.log(`📅 Año detectado: ${movieYear}`);
    console.log(`📄 Archivos encontrados:`, fileDetails);

    await storeData(fileDetails);
}

async function storeData(fileDetails) {
    await csvWriter.writeRecords(fileDetails);
}

function extractYear(movieName, files) {
    let yearRegex = /\b(19\d{2}|20\d{2})\b/;

    let match = movieName.match(yearRegex);
    if (match) return match[0];

    for (let file of files) {
        match = file.match(yearRegex);
        if (match) return match[0];
    }

    return 'Año desconocido';
}

function extractResolution(file) {
    let resolutionRegex = /(480p|720p|1080p|1440p|2160p|4K|8K)/i;
    let match = file.match(resolutionRegex);
    return match ? match[0] : 'Resolución desconocida';
}

function extractLanguage(file) {
    let subtitleRegex = /(SUB|sub|Sub|VOSE)(\.|\b)/i;
    let languageRegex = /(latino|ingles|español|castellano|frances|portugues|aleman|italiano|japones|coreano|chino|latin|english|spanish|french|deusch|italian|japan|corean|chinesse)/i;

    let matchSubtitle = file.match(subtitleRegex);
    let matchLanguage = file.toLowerCase().match(languageRegex);

    let subtitled = matchSubtitle ? true : false;
    let language = matchLanguage ? matchLanguage[0] : 'Desconocido';

    return {language, subtitled};
}

// https://bugmenot.com/view/themoviedb.org
// https://www.themoviedb.org/settings/api
const API_KEY = 'cbca3a9fc065e105bea70f3543b3d717';

function getGenres() {
    const url = `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=es`;
    try {
        return axios.get(url).then(data => {
            const genres = data.data.genres;
            return genres.reduce((map, genre) => {
                map[genre.id] = genre.name;
                return map;
            }, {});
        })
    } catch (error) {
        console.error('❌ Error al obtener los géneros:', error.message);
        return {};
    }
}

const genreMap = getGenres();

async function getMovieExtras(movieName) {
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(movieName)}`;

    try {
        const {data} = await axios.get(url);
        if (data.results.length > 0) {
            const movie = data.results[0];
            const imageUrl = `https://image.tmdb.org/t/p/original${movie.poster_path}`;
            // const genres = movie.genre_ids.map(id => genreMap[id] || 'Desconocido');

            console.log(`🎬 Imagen de ${movie.title}: ${imageUrl}`);
            console.log(`🎭 Géneros: ${movie.genre_ids.join(', ')}`);

            return {
                image: imageUrl,
                adult: movie.adult,
                genre: movie.genre_ids.join(', '),
                overview: movie.overview,
                originalTitle: movie.original_title,
                originalLanguage: movie.original_language,
                release_date: movie.release_date,
                popularity: movie.popularity,
            }
        } else {
            console.log('❌ No se encontró la película');
        }
    } catch (error) {
        console.error('❌ Error al obtener la imagen:', error.message);
    }
}

// Ejecutar el scraper
scrapeIndex();
