document.addEventListener("DOMContentLoaded", () => {
    headerFunctionality();

    function headerFunctionality(){
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
            if (newWidth <= minWidth && oldWidth <= minWidth){
                return;
            }
            if (newWidth <= minWidth){
                navMenuHor.style.display = "none";
                navButton.style.display = "flex";
            }
            if (newWidth > minWidth){
                navMenuHor.style.display = "";
                navButton.style.display = "";
                navMenuVert.style.display = ""
            }
            oldWidth = newWidth;
        }
        function toggleNavContentOn() {
            if (navMenuVert.style.display == "flex"){
                navMenuVert.style.display = "";
            }
            else{
                navMenuVert.style.display = "flex";
            }
        }
        
        // function toggleNavContentOff() {
        //     if (belowMinSize) {
        //         navContent.style.display = "none";
        //         navContent.style.flexDirection = "row";
        //     }
        // }
    }
});