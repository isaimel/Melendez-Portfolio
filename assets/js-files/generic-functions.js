export async function getJSONData(filepath) {
    try {
        const response = await fetch(filepath);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error(error.message);
    }
}
export function modLoop(ind, mod) {
    return ((ind % mod) + mod) % mod;
}
export function getParagraphDiv(list, newDiv = null) {
    if (newDiv == null) {
        newDiv = document.createElement("div");
    }

    for (let index in list) {
        let p = document.createElement("p");
        p.textContent = list[index];
        newDiv.appendChild(p);
    }

    return newDiv;
}

export function createImage(src, alt, title) {
    var img = document.createElement('img');
    img.src = src;
    if (alt != null) img.alt = alt;
    if (title != null) img.title = title;
    return img;
}
export function genElem(type, id = "", classes = []) {
    const el = document.createElement(type);

    if (id) el.id = id;
    el.classList.add(...classes);

    return el;
}
export function genLink(href, target = "_blank", rel = "noopener noreferrer") {
    var aLink = genElem("a");
    aLink.target = target;
    aLink.rel = rel;
    aLink.href = href;
    return aLink;
}