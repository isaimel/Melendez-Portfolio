import {
    headerFunctionality,
    galleryFunctionality,
    bioRotationFunctionality,
    addLogos,
    projectsFunctionality,
    addLightboxListeners,
    resumeButtonsFunctionality,
    copyLinkFunctionality
} from './assets/js-files/website-functions.js';

document.addEventListener("DOMContentLoaded", () => {
    addLightboxListeners();

    headerFunctionality();
    bioRotationFunctionality("./");
    galleryFunctionality("./");
    projectsFunctionality("./");
    copyLinkFunctionality();
    resumeButtonsFunctionality("./", true, true);
    addLogos("./");

});