
async function loadContent(path = '') {
    try {
        const response = await fetch(`/contenido${path}`, {
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
            }
        });

        if (!response.ok) {
            throw new Error(`Error al obtener datos: ${response.statusText}`);
        }

        const content = await response.text();
        return parseContent(content);
    } catch (error) {
        console.error("Error al cargar contenido:", error);
    }
}

function parseContent(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const rows = Array.from(doc.querySelectorAll("table tr"));
    return rows
        .map(row => {
            const link = row.querySelector("a");
            const date = row.querySelector("td:nth-child(3)") ?? '';
            if (link) {
                return {
                    name: link.textContent.trim(),
                    date: date.innerHTML,
                    url: new URL(link.getAttribute("href"), window.location.origin + "/contenido").href,
                };
            }
            return null;
        })
        .filter(item => item);
}

function renderContentList(content) {
    const list = document.getElementById("contentList");
    list.innerHTML = "";
    content.forEach(item => {
        const li = document.createElement("li");
        li.textContent = item.name + " " + item.date;
        li.onclick = () => handleItemClick(item);
        list.appendChild(li);
    });
}

function handleItemClick(item) {
    // console.log(window.location.origin);
    console.log(window.location.href)
    console.log(item)
    if (item.url.endsWith("/")) {
        fetchFolderContent(item.name);
    } else if (item.url.endsWith(".mp4")) {
        openModal(item.name);
    }

    // const path = item.url.replace(window.location.href + '/contenido', '');
    const path = window.location.href+item.name;
    history.pushState({ path: path }, '', path);
}

async function fetchFolderContent(folderUrl) {
    try {
        const response = await fetch(window.location.href+`/./${folderUrl}`);
        if (!response.ok) {
            console.error(`Error al cargar carpeta: ${response.statusText}`);
            return;
        }
        const html = await response.text();
        const content = parseContent(html);
        renderContentList(content);
    } catch (error) {
        console.error("Error al cargar contenido de la carpeta:", error);
    }
}

function openModal(videoUrl) {
    const modal = document.getElementById("modal");
    const videoPlayer = document.getElementById("videoPlayer");

    videoPlayer.src = `${videoUrl}#t=0`; // Sugerir que inicie desde el tiempo 0
    modal.classList.add("active");
}


function closeModal() {
    const modal = document.getElementById("modal");
    const videoPlayer = document.getElementById("videoPlayer");
    modal.classList.remove("active");
    videoPlayer.pause();
    videoPlayer.src = "";
}

(async function init() {
    try {
        const path = window.location.pathname.replace('/contenido', '');
        const content = await loadContent(path);
        renderContentList(content);
    } catch (error) {
        console.error("Error al inicializar:", error);
    }
})();

window.onpopstate = async function(event) {
    if (event.state && event.state.path) {
        const content = await loadContent(event.state.path);
        renderContentList(content);
    }
};
