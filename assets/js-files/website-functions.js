import {
    getJSONData,
    modLoop,
    getParagraphDiv,
    createImage,
    genElem,
    genLink
} from './generic-functions.js';

export const hostDomain = 'https://pub-c083c836a8cb4bdf85a4f6ffe05ef891.r2.dev';

export const lightbox = {
    "lightboxContainer": document.getElementById("lightbox-container"),
    "lightboxImg": document.getElementById("lightbox-img"),
    "lbLeft": document.getElementById("lb-left"),
    "lbRight": document.getElementById("lb-right"),
    "currLightboxTarget": null,
    "currLightboxInd": -1
};

export function addLightboxListeners() {
    lightbox["lbLeft"].addEventListener("click", () => changeLightboxImg(-1));
    lightbox["lbRight"].addEventListener("click", () => changeLightboxImg(1));
    lightbox["lightboxContainer"].addEventListener("click", (event) => {
        if (event.target !== lightbox["lbLeft"] &&
            event.target !== lightbox["lbRight"]) {
            lightbox["lightboxContainer"].style.display = "none";
            lightbox["lightboxImg"].src = ""
        }
    });

}

export function changeLightboxImg(direction) {
    if (lightbox["currLightboxTarget"] === null) return;
    if (direction === 0) return;

    lightbox["currLightboxInd"] = modLoop(
        lightbox["currLightboxInd"] + direction,
        lightbox["currLightboxTarget"].length
    );

    lightbox["lightboxImg"].src = lightbox["currLightboxTarget"][lightbox["currLightboxInd"]];

    preloadLightboxImage(lightbox["currLightboxInd"] + direction);
    preloadLightboxImage(lightbox["currLightboxInd"] + direction + direction);

}

export function summonLightbox(target, ind) {
    lightbox["currLightboxTarget"] = target;
    lightbox["currLightboxInd"] = ind;

    lightbox["lightboxContainer"].style.display = "flex";
    lightbox["lightboxImg"].src = target[ind];

    preloadLightboxImage(ind - 1);
    preloadLightboxImage(ind + 1);
}

function preloadLightboxImage(ind) {
    if (lightbox["currLightboxTarget"] == null) return;

    const img = new Image();
    img.src = lightbox["currLightboxTarget"][modLoop(ind, lightbox["currLightboxTarget"].length)];
}

export function headerFunctionality() {
    const MAXWIDTH = 700;
    let headerRight = document.getElementById("header-right");
    let navMenu = document.getElementById("nav-menu");
    let navButton = headerRight.querySelector("button");

    window.addEventListener("resize", handleResize);
    navButton.addEventListener("click", navMenuToggle);
    handleResize();

    function handleResize() {
        const NEWIDTH = document.documentElement.clientWidth;
        if (NEWIDTH <= MAXWIDTH && !headerRight.classList.contains("small")) {
            headerRight.classList.add("small");
        }
        else if (NEWIDTH > MAXWIDTH && headerRight.classList.contains("small")) {
            headerRight.classList.remove("small");
            navMenu.style.display = "";
        }
    }
    function navMenuToggle() {
        const menuDisplay = navMenu.style.display;
        navMenu.style.display = (menuDisplay == "") ? "flex" : "";
    }
}

export async function galleryFunctionality(rootPath) {
    const pData = await getJSONData(rootPath + 'assets/data-files/portfolioData.json');
    let galleriesContainer = document.getElementById("galleries-container");
    let categoriesContainer = document.getElementById("categories-container");

    let prevID = null;

    let categoryDivs = {};
    let galleryDivs = {};

    for (const galleryData of pData) {
        let parent = galleryData["parent"];
        let categoryDiv = createGalleryCategory(galleryData);
        categoriesContainer.appendChild(categoryDiv);
        categoryDivs[parent] = categoryDiv;
        categoryDiv.addEventListener("mouseenter", () => selectGallery(parent, galleryData));
        if (parent == "promotional") selectGallery(parent, galleryData);
    }

    function selectGallery(galleryID, galleryData) {
        if (galleryID == prevID) return;

        if (prevID) {
            categoryDivs[prevID].classList.remove("selected");
            galleryDivs[prevID].classList.remove("selected");
        }

        if (!(galleryID in galleryDivs)) {
            galleryDivs[galleryID] = makeSingleGallery(galleryData);
            galleriesContainer.appendChild(galleryDivs[galleryID]);
        }

        galleryDivs[galleryID].classList.add("selected");
        categoryDivs[galleryID].classList.add("selected");

        prevID = galleryID;
    }
    function createGalleryCategory(categoryData) {
        let categoryDiv = genElem("div", categoryData["parent"] + "-cat", ["category", "card"]);

        let fullCar = genElem("div", "", ["full", "s-heading"]);
        fullCar.innerHTML = categoryData["title-full"];
        let abbrCar = genElem("div", "", ["abbr", "s-heading"]);
        abbrCar.innerHTML = categoryData["title-abbr"];
        // abbrCar.appendChild(genElem("hr"));
        // fullCar.appendChild(genElem("hr"));

        categoryDiv.append(fullCar, abbrCar);

        return categoryDiv;
    }
    function makeSingleGallery(galleryData) {
        let newDiv = genElem("div", galleryData["parent"] + "-gal", ["gallery"]);
        let srcList = [];

        for (const imgData of galleryData["item"]) {
            const original = `${hostDomain}/${galleryData["parent"]}-original/${imgData["name"]}.${imgData["ext"]}`;
            const thumbnail = `${hostDomain}/${galleryData["parent"]}-thumbnail/${imgData["name"]}.${imgData["ext"]}`;

            srcList.push(original);

            let img = createImage(thumbnail, imgData["description"], imgData["title"]);
            img.style.gridColumn = `span ${imgData["weightX"]}`;
            img.style.gridRow = `span ${imgData["weightY"]}`;

            let specificInd = srcList.length - 1;
            img.addEventListener("click", () => summonLightbox(srcList, specificInd));

            newDiv.appendChild(img);
        }

        return newDiv;
    }
}

function createEmptyProject() {
    let projectDiv = genElem("div", "", ["project-div"]);
    let mediaContainer = genElem("div", "", ["media-container"]);
    let projectText = genElem("div", "", ["project-text"]);
    let projectTitle = genElem("div", "", ["project-title", "s-heading"]);
    let projectDesc = genElem("div", "", ["project-desc"]);
    let projectButton = genElem("button", "", ["project-button"]);

    projectDiv.classList.add("card");
    projectText.append(projectTitle, projectDesc, projectButton);
    projectDiv.append(mediaContainer, projectText);

    projectButton.textContent = "Show More";
    return {
        projectDiv,
        mediaContainer,
        projectTitle,
        projectDesc,
        projectButton
    };
}
function createProjectMedia(projectInfo, mediaContainer, projectDiv) {22
    switch (projectInfo["type"]) {
        case "video":
            for (const link of projectInfo["links"]) {
                let iframe = genElem("iframe", "", ["video"]);
                iframe.src = link;
                mediaContainer.appendChild(iframe);
            }
            break;

        case "images":
            for (const link of projectInfo["links"]) {
                let img = createImage(link);
                mediaContainer.appendChild(img);
            }
            projectDiv.classList.add("images");
            break;

        case "website":
            for (const link of projectInfo["links"]) {
                let iframe = genElem("iframe", "", ["website"]);
                iframe.src = link;
                mediaContainer.appendChild(iframe);
            }
            projectDiv.style.gridTemplateRows = "20rem auto";
            break;
    }
}
function createProject(projectInfo) {
    let { projectDiv, mediaContainer, projectTitle, projectDesc, projectButton } = createEmptyProject();

    projectTitle.textContent = projectInfo["title"];
    projectTitle.appendChild(genElem("hr"));


    if (projectInfo["direction"] == "row") projectDiv.classList.add("row")
    let shortParagraph = getParagraphDiv(projectInfo["short"]);
    let longParagraph = getParagraphDiv(projectInfo["long"]);
    projectDesc.append(shortParagraph, longParagraph);
    shortParagraph.classList.add("single-text");
    longParagraph.classList.add("hidden", "single-text");

    projectButton.addEventListener("click", textToggle);
    createProjectMedia(projectInfo, mediaContainer, projectDiv);
    return projectDiv;

    function textToggle() {
        if (projectButton.textContent == "Show More") {
            shortParagraph.classList.add("hidden");
            longParagraph.classList.remove("hidden");

            projectButton.textContent = "Show Less";
            if (projectInfo["direction"] == "row") projectDiv.classList.remove("row");
        } else {
            shortParagraph.classList.remove("hidden");
            longParagraph.classList.add("hidden");

            projectButton.textContent = "Show More";
            if (projectInfo["direction"] == "row") projectDiv.classList.add("row");
        }
    }
}
export async function projectsFunctionality(rootPath) {
    const projectsData = await getJSONData(rootPath + 'assets/data-files/projectsData.json');

    for (const projectData of Object.values(projectsData)) {
        document.getElementById("projects-container").appendChild(await createProject(projectData));
    }

}

export async function addLogos(rootPath) {
    const logosData = await getJSONData(rootPath + 'assets/data-files/logosData.json');
    let logoSection = document.getElementById("logo-section");
    for (const logo of logosData["items"]) {
        const img = document.createElement("img");
        img.src = `${hostDomain}/logos/${logo["link"]}.${logo["type"]}`;
        logoSection.appendChild(img);
    }
}

export async function bioRotationFunctionality(rootPath) {
    const personalitiesData = await getJSONData(rootPath + 'assets/data-files/personalData.json');
    let portrait = document.getElementById("blurb").querySelector("img");
    let personalities = document.getElementById("personalities");
    let blurbTitle = document.getElementById("blurb-title");
    let blurbText = document.getElementById("blurb-text");

    let textDict = {};
    let buttonDict = {};
    let currKey = null;

    for (const personalityData of personalitiesData) {
        let key = personalityData["title"];
        let button = makeButton(personalityData, key);
        personalities.appendChild(button);
        buttonDict[key] = button;
        button.addEventListener("mouseenter", () => replacePortrait(key, personalityData));
        if (personalityData["title"] == "Person") replacePortrait(key, personalityData);
    }

    function makeButton(personalityData, key) {
        let button = genElem("button");
        let img = createImage(rootPath + personalityData["link"], key, key);

        button.appendChild(img);
        return button;
    }

    function replacePortrait(key, personalityData) {
        if (currKey == key) return;

        if (!(key in textDict)) {
            let newDiv = getParagraphDiv(personalityData["paragraphs"]);
            newDiv.classList.add("single-text");
            textDict[key] = newDiv;
            blurbText.appendChild(newDiv);
        }

        if (currKey) {
            buttonDict[currKey].classList.remove("selected");
            textDict[currKey].classList.remove("selected");
        }

        buttonDict[key].classList.add("selected");
        textDict[key].classList.add("selected");

        portrait.src = rootPath + personalityData["link-sign"];
        blurbTitle.innerHTML = key;
        currKey = key;
    }
}

export async function resumeButtonsFunctionality(rootPath, buttons, mult) {
    const buttonsData = await getJSONData(rootPath + 'assets/data-files/resumeButtonData.json');
    let resumeButtons = document.getElementById("resume-buttons");
    let multResumeSection = document.getElementById("mult-resume-section");

    for (const resumeData of buttonsData) {
        if (buttons) resumeButtons.appendChild(generateLinkButton(resumeData));
        if (mult) multResumeSection.appendChild(createResumeSection(resumeData));
    }
    function generateLinkButton(buttonData) {
        let aLink = genLink(buttonData["src"]);
        let button = genElem("button");

        button.textContent = buttonData["title"];
        aLink.appendChild(button);
        return aLink;
    }
    function createResumeSection(resumeData) {
        const card = genElem("div", "", ["card"]);

        const heading = genElem("div", "", ["s-heading"]);
        heading.textContent = "Resume: " + resumeData.title;

        heading.appendChild(genElem("hr"));

        const resumeLink = genLink(resumeData.src);

        const resumeImage = createImage(resumeData.image, `${resumeData.title} Resume`, `${resumeData.title} Resume`);
        resumeLink.appendChild(resumeImage);

        card.append(heading, resumeLink);

        return card;
    }
}
export function copyLinkFunctionality() {
        var copyText = document.getElementById("copy-email").textContent;

        navigator.clipboard.writeText(copyText);
        alert("Copied the text: " + copyText);
}