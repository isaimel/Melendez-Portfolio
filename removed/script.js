document.addEventListener("DOMContentLoaded", () => {

    headerFunctionality();
    bioRotationFunctionality();
    resizeElementAdjust();

    async function headerFunctionality() {
        let navMenuHor = document.getElementById("nav-menu-hor");
        let navButton = document.getElementById("nav-button");
        var minWidth = 800;
        var oldWidth = document.documentElement.clientWidth;
        handleResize();

        window.addEventListener("resize", handleResize);
        navButton.addEventListener("click", toggleNavContentOn);

        function handleResize() {
            var newWidth = document.documentElement.clientWidth;
            if (newWidth <= minWidth && (oldWidth > minWidth || newWidth == oldWidth)) {
                navMenuHor.style.display = "none";
                navButton.style.display = "flex";
            }
            if (newWidth > minWidth) {
                navMenuHor.style.display = "";
                navButton.style.display = "";
                navMenuHor.style.fontSize = "";
                navMenuHor.style.gap = "";

            }
            oldWidth = newWidth;
        }
        function toggleNavContentOn() {
            if (navMenuHor.style.display == "none") {
                navMenuHor.style.display = "";
                navMenuHor.style.fontSize = ".8rem";
                navMenuHor.style.gap = "1rem";

            }
            else {
                navMenuHor.style.display = "none";
            }
        }
    }
    async function bioRotationFunctionality() {
        const personalData = await getJSONData('./personalData.json');
        let portrait = document.getElementById("portrait");
        let personalities = document.getElementById("personalities");
        let blurbTitle = document.getElementById("blurb-title");
        let blurbText = document.getElementById("blurb-text");

        let keys = Object.keys(personalData);

        let keyToParas = {};
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

        function replacePortrait(key){
            if (currKey == key) return;
            if (!(key in keyToParas)){
                keyToParas[key] = listsToPara(personalData[key]["paragraphs"]);
            }
            if (currKey) keyToImg[currKey].style.outline = "none";
            keyToImg[key].style.outline = "";

            blurbTitle.textContent = key;
            blurbText.replaceChildren();
            blurbText.append(...keyToParas[key])
            portrait.src = personalData[key]["link-sign"]
            currKey = key;   
        }
    }
    function resizeElementAdjust() {
        const pairNameTools = document.getElementById("pair-name-tools");
        const trustyToolsSection = document.getElementById("trusty-tools-section");
        const personalSection = document.getElementById("personal-section");
        updateOrientation();

        function updateOrientation() {
            const pairY = pairNameTools.getBoundingClientRect().top;
            const personalY = personalSection.getBoundingClientRect().top;

                if (Math.abs(pairY - personalY) < 1){
                    pairNameTools.style.flexDirection = "column";
                    trustyToolsSection.style.width = "min-content";
                } else{
                    pairNameTools.style.flexDirection = "row";
                    trustyToolsSection.style.width = "fit-content";
                }
        }

        window.addEventListener("resize", updateOrientation);
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
    function listsToPara(list){
        let returnList = [];
        for (let index in list){
            var p = document.createElement('p');
            p.textContent = list[index];
            returnList.push(p);
        }
        return returnList;
    }
    function createImage(src, alt, title) {
        var img = document.createElement('img');
        img.src = src;
        if ( alt != null ) img.alt = alt;
        if ( title != null ) img.title = title;
        return img;
    }
});