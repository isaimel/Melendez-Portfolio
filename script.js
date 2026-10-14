document.addEventListener("DOMContentLoaded", () => {
    headerFunctionality();
    bioRotationFunctionality();
    galleryFunctionality();
    const lightboxContainer = document.getElementById('lightboxContainer');
    const lightboxImg = document.getElementById('lightboxImg');
    let lbLeft = document.getElementById("lb-left");
    let lbRight = document.getElementById("lb-right");
    let currLightboxTarget = null;
    let currLightboxInd = -1;

    async function headerFunctionality() {
        const State = {
            MINI: "mini",
            FULL: "full",
        };

        let navMenu = document.getElementById("nav-menu");
        let navButton = document.getElementById("nav-button");
        var minWidth = 600;
        handleResize();

        window.addEventListener("resize", handleResize);
        navButton.addEventListener("click", toggleNavMenu);

        function handleResize() {
            var newWidth = document.documentElement.clientWidth;
            if (newWidth <= minWidth && getDisplay(navButton) == "") {
                setDisplay(navMenu, "none");
                setDisplay(navButton, "flex");
                navMenuStyle(State.MINI)
            }
            if (newWidth > minWidth) {
                resetAllStyles();
            }
        }
        function navMenuStyle(state) {
            if (state == State.MINI) {
                navMenu.style.fontSize = ".8rem";
                navMenu.style.gap = "1rem";
            }
            else if (state == State.FULL) {
                navMenu.style.fontSize = "";
                navMenu.style.gap = "";
            }
        }
        function toggleNavMenu() {
            if (navMenu.style.display == "none") {
                setDisplay(navMenu, "")
            }
            else {
                setDisplay(navMenu, "none");
            }
        }
        function resetAllStyles() {
            setDisplay(navButton);
            setDisplay(navMenu);
            navMenuStyle(State.FULL)
        }

    }
    async function bioRotationFunctionality() {
        const personalData = await getJSONData('./data-files/personalData.json');
        let portrait = document.getElementById("blurb").querySelector("img");
        let personalities = document.getElementById("personalities");
        let blurbTitle = document.getElementById("blurb-title");
        let blurbText = document.getElementById("blurb-text");

        let keys = Object.keys(personalData);

        let keyToDiv = {};
        let keyToImg = {};
        let currKey = null;

        for (const key of keys) {
            let dict = personalData[key];
            let img = createImage(dict["link"], key, key);
            img.style.outline = "none";
            personalities.appendChild(img);
            keyToImg[key] = img;
            img.addEventListener("click", () => replacePortrait(key));
        }
        replacePortrait("Person");

        function replacePortrait(key) {
            if (currKey == key) return;

            if (!(key in keyToDiv)) {
                let newDiv = getParagraphDiv(personalData[key]["paragraphs"]);
                newDiv.style.display = "none"
                keyToDiv[key] = newDiv;
                blurbText.appendChild(newDiv);
            }

            if (currKey) {
                keyToImg[currKey].classList.remove("selected");
                keyToDiv[currKey].style.display = "none";
            }

            keyToImg[key].classList.add("selected");
            portrait.src = personalData[key]["link-sign"];
            keyToDiv[key].style.display = "block";
            currKey = key;
        }
    }
    async function galleryFunctionality() {
        const hostDomain = 'https://pub-c083c836a8cb4bdf85a4f6ffe05ef891.r2.dev';
        const portfolioData = await getJSONData('./data-files/portfolioData.json');
        let galleriesContainer = document.getElementById("galleries-container");
        let galleryCategories = document.getElementById("gallery-categories");

        let prevID = null;

        const idToFolder = {
            "merch-gallery": "merchandise",
            "graphics-gallery": "graphics",
            "promo-gallery": "promotional",
            "fa-gallery": "fine-arts",
            "misc-gallery": "miscellaneous",
        }
        let categoryDivs = {};
        let galleryDivs = {};

        for (const category of galleryCategories.children) {
            category.addEventListener("click", () => selectGallery(category.id));
            categoryDivs[category.id] = category;
        }
        selectGallery("promo-gallery");

        function selectGallery(galleryID) {
            if (galleryID == prevID) return;
            if (prevID) {
                categoryDivs[prevID].style.backgroundColor = "";
                galleryDivs[prevID].style.display = "";
            }
            if (!(galleryID in galleryDivs)) {
                galleryDivs[galleryID] = makeSingleGallery(galleryID);
                galleriesContainer.appendChild(galleryDivs[galleryID]);
                console.log(galleryID);
            }
            galleryDivs[galleryID].style.display = "grid";
            categoryDivs[galleryID].style.backgroundColor = "whitesmoke";
            prevID = galleryID;
        }
        function makeSingleGallery(galleryID) {
            let newDiv = document.createElement("div");
            let parentName = idToFolder[galleryID];
            let ind = 0;
            let srcList = [];
            const galleryData = portfolioData[parentName];
            for (const [imgName, imgData] of Object.entries(galleryData)) {
                const original = `${hostDomain}/${parentName}-original/${imgName}.${imgData["ext"]}`;
                const thumbnail = `${hostDomain}/${parentName}-thumbnail/${imgName}.${imgData["ext"]}`;
                let img = createImage(thumbnail, imgData["description"], imgData["title"]);
                img.style.gridColumn = `span ${imgData["weightX"]}`;
                img.style.gridRow = `span ${imgData["weightY"]}`;
                let specificInd = ind;
                srcList.push(original);
                img.addEventListener("click", () => summonLightbox(srcList, specificInd));
                newDiv.appendChild(img);
                ind++;
            }
            return newDiv;
        }
    }
    lbLeft.addEventListener("click", () => changeLightboxImg(-1));
    lbRight.addEventListener("click", () => changeLightboxImg(1));

    function changeLightboxImg(direction) {
        if (currLightboxTarget == null) return;
        if (direction == 0) return;
        currLightboxInd = modLoop(currLightboxInd + direction, currLightboxTarget.length);
        lightboxImg.src = currLightboxTarget[currLightboxInd];
        preloadLightboxImage(currLightboxInd + direction);
    }
    function summonLightbox(target, ind) {
        currLightboxTarget = target;
        currLightboxInd = ind;
        lightboxContainer.style.display = 'flex';
        lightboxImg.src = target[ind];

        preloadLightboxImage(ind - 1);
        preloadLightboxImage(ind + 1);
    }
    function preloadLightboxImage(ind) {
        if (currLightboxTarget == null) return;

        const img = new Image();
        img.src = currLightboxTarget[modLoop(ind, currLightboxTarget.length)];
    }
    lightboxContainer.addEventListener("click", (event) => {
        if (event.target !== document.getElementById("lb-left") &&
            event.target !== document.getElementById("lb-right")) {
            lightboxContainer.style.display = "none";
            lightboxImg.src = ""
        }
    });
    function setDisplay(el, newValue = "") {
        el.style.display = newValue;
    }
    function getDisplay(el) {
        return el.style.display;
    }
    async function getJSONData(filepath) {
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
    function modLoop(dangerIndex, modAmount) {
        return ((dangerIndex % modAmount) + modAmount) % modAmount;
    }
    function getParagraphDiv(list) {
        let newDiv = document.createElement("div");;
        for (let index in list) {
            var p = document.createElement('p');
            p.textContent = list[index];
            newDiv.appendChild(p);
        }
        return newDiv;
    }

    function createImage(src, alt, title) {
        var img = document.createElement('img');
        img.src = src;
        if (alt != null) img.alt = alt;
        if (title != null) img.title = title;
        return img;
    }

});