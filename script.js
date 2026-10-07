document.addEventListener("DOMContentLoaded", () => {

    headerFunctionality();
    bioRotationFunctionality()

    async function headerFunctionality() {
        let navMenuHor = document.getElementById("nav-menu-hor");
        let navMenuVert = document.getElementById("nav-menu-vert");
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
                navMenuVert.style.display = ""
            }
            oldWidth = newWidth;
        }
        function toggleNavContentOn() {
            if (navMenuVert.style.display == "flex") {
                navMenuVert.style.display = "";
            }
            else {
                navMenuVert.style.display = "flex";
            }
        }
    }
    async function bioRotationFunctionality() {
        const personalData = await getJSONData('./personalData.json');
        let leftWing = document.getElementById("left-wing");
        let centralBody = document.getElementById("central-body");
        let rightWing = document.getElementById("right-wing");

        let leftWingImg = leftWing.querySelector("img");
        let centralBodyImg = centralBody.querySelector("img");
        let rightWingImg = rightWing.querySelector("img");

        let leftWingSpan = leftWing.querySelector("span");
        let centralBodySpan = centralBody.querySelector("span");
        let rightWingSpan = rightWing.querySelector("span");

        var minWidth = 800;
        var oldWidth = document.documentElement.clientWidth;

        var listSize = personalData.length;
        var ind = 1;

        window.addEventListener("resize", handleResize);
        leftWingImg.addEventListener("click", () => alterIndex(-1));
        centralBodyImg.addEventListener("click", () => alterIndex(0));
        rightWingImg.addEventListener("click", () => alterIndex(1));
        
        handleResize();

        function alterIndex(direction){
            if (direction == 0) return;
            ind = modLoop(ind + direction, listSize);
            console.log(ind);
            updateDisplay();
        }

        function updateDisplay() {
            var newWidth = document.documentElement.clientWidth;

            centralBodyImg.src = personalData[modLoop(ind, listSize)]["link"];
            centralBodySpan.textContent = personalData[modLoop(ind, listSize)]["title"];

            if (newWidth <= minWidth) return;
            leftWingImg.src = personalData[modLoop(ind - 1, listSize)]["link"];
            leftWingSpan.textContent = personalData[modLoop(ind - 1, listSize)]["title"];

            rightWingImg.src = personalData[modLoop(ind + 1, listSize)]["link"];
            rightWingSpan.textContent = personalData[modLoop(ind + 1, listSize)]["title"];
        }
        function handleResize() {
            var newWidth = document.documentElement.clientWidth;
            if (newWidth <= minWidth && (oldWidth > minWidth || newWidth == oldWidth)) {
                leftWingSpan.innerHTML = "";
                rightWingSpan.innerHTML = "";
            }
            else if (newWidth > minWidth && oldWidth > minWidth){
                updateDisplay();
            }
            oldWidth = newWidth;
        }

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
});