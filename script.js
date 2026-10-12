document.addEventListener("DOMContentLoaded", () => {
    headerFunctionality();
    bioRotationFunctionality();
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
        function resetAllStyles(){
            setDisplay(navButton);
            setDisplay(navMenu);
            navMenuStyle(State.FULL) 
        }

    }
    async function bioRotationFunctionality() {
        const personalData = await getJSONData('./personalData.json');
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
    function getParagraphDiv(list){
        let newDiv = document.createElement("div");;
        for (let index in list){
            var p = document.createElement('p');
            p.textContent = list[index];
            newDiv.appendChild(p);
        }
        return newDiv;
    }
    
    function createImage(src, alt, title) {
        var img = document.createElement('img');
        img.src = src;
        if ( alt != null ) img.alt = alt;
        if ( title != null ) img.title = title;
        return img;
    }
});