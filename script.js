const jsonFileURL = 'https://isaimel.github.io/Current-Website-Project/lists.json';

const Display = Object.freeze({
  SCROLL: Symbol("scroll"),
  ALL: Symbol("all")
});

const Orientation = Object.freeze({
  PORTRAIT: Symbol("portrait"),
  LANDSCAPE: Symbol("landscape")
});

fetch(jsonFileURL)
  .then(response => response.json())
  .then(jsonData => {
    prepareYoutubeAPI();
    galleryFunctionality(document.getElementById("first_page_gallery"), jsonData);
    addAllProjects(document.getElementById("projects"), jsonData);
    fillBiography(document.getElementById("biography"), jsonData);
  })
  .catch(error => console.log('Error during fetch: ' + error.message));

function fillBiography(bio_container, jsonData) {
  var bioData = jsonData.biography;

  var accDiv = bio_container.querySelector(".accomplishments");
  var blurbDiv = bio_container.querySelector(".personal_blurb");
  var effDiv = bio_container.querySelector(".efficiencies");
  var resumeLink = bio_container.querySelector(".resume");

  bioData["accomplishments"].forEach((accomplishment) => {
    var accomplishmentSpan = document.createElement("span");
    accomplishmentSpan.innerHTML = accomplishment;
    accDiv.appendChild(accomplishmentSpan);
  });

  blurbDiv.innerHTML = bioData["biography"];

  bioData["efficiencies"].forEach((efficiency) => {
    var efficienciesSpan = document.createElement("span");
    efficienciesSpan.innerHTML = efficiency;
    effDiv.appendChild(efficienciesSpan);
  });

  resumeLink.href =
    "https://isaimel.github.io/Current-Website-Project/assets/" +
    bioData["resume_link"];
}

async function addAllProjects(projects_container, jsonData) {
  var allPromises = [];
  for (const project of Object.values(jsonData.projects)) {
    allPromises.push(createProject(project).then(projectDiv => projects_container.appendChild(projectDiv)));
  }
  return Promise.all(allPromises)
}

async function createProject(projectInfo) {
  var projectDiv = document.createElement("div");
  var projectTextDiv = document.createElement("div");
  projectTextDiv.classList.add("project_text");

  projectDiv.classList.add("project");
  projectDiv.style.flexDirection = projectInfo["direction_short"];

  var mediaContainer = document.createElement("div");
  mediaContainer.classList.add("media_container");

  var projectTitle = document.createElement("span");
  projectTitle.classList.add("project_title");
  projectTitle.innerHTML = projectInfo["headline"];

  var projectDescription = document.createElement("p");
  projectDescription.classList.add("project_description");
  projectDescription.innerHTML = projectInfo["short"];

  var swapTextButton = document.createElement("button");
  swapTextButton.textContent = "Show More";

  let expanded = false;

  swapTextButton.addEventListener("click", () => {
    expanded = !expanded;

    projectDescription.innerHTML = expanded ? projectInfo["long"] : projectInfo["short"];
    projectDiv.style.flexDirection = expanded ? projectInfo["direction_long"] : projectInfo["direction_short"];
    swapTextButton.innerHTML = expanded ? "Show Less" : "Show More";
  });

  projectDiv.appendChild(mediaContainer);

  projectTextDiv.appendChild(projectTitle);
  projectTextDiv.appendChild(projectDescription);
  projectTextDiv.appendChild(swapTextButton);

  projectDiv.appendChild(projectTextDiv);

  if (projectInfo["type"] === "video") {
    for (const videoID of projectInfo["links"]) {
      var videoToReplace = document.createElement("div");
      videoToReplace.id = videoID;
      videoToReplace.classList.add("youtube_iframe");
      mediaContainer.appendChild(videoToReplace);
    }
  }
  else if (projectInfo["type"] === "image") {
    for (const imageID of projectInfo["links"]) {
      mediaContainer.appendChild(await loadImageSimple(imageID));
    }
  }
  else if (projectInfo["type"] === "website") {
    for (const websiteURL of projectInfo["links"]) {
      var websiteFrame = document.createElement("iframe");
      websiteFrame.src = websiteURL;
      websiteFrame.classList.add("website_iframe");

      var websiteDiv = document.createElement("div");
      websiteDiv.classList.add("website_container");

      websiteDiv.appendChild(websiteFrame);
      mediaContainer.appendChild(websiteDiv);
    }
  }

  return projectDiv;
}

function galleryFunctionality(gallery, jsonData) {
  const lightboxContainer = document.getElementById('lightboxContainer');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxDescription = lightboxContainer.querySelector("span");

  var tabData = jsonData.tabs;
  var descriptionsData = jsonData.descriptions;

  var leftImage = gallery.querySelector(".left_image");
  var centerImage = gallery.querySelector(".center_image");
  var rightImage = gallery.querySelector(".right_image");

  var leftButton = gallery.querySelector(".slideshow_left");
  var rightButton = gallery.querySelector(".slideshow_right");
  var tabContainer = gallery.querySelector(".tab_container");
  var itemDescription = gallery.querySelector(".item_description");

  var slideshowContainer = gallery.querySelector(".slideshow_container");
  var tabGalleriesContainer = gallery.querySelector(".all_container");
  tabGalleriesContainer.style.display = 'none';

  var galleryHeader = gallery.querySelector(".swap_layout");

  var currentGallery = Display.SCROLL;

  var middleImgInd = 1;
  var tabDivList = {};
  var imageDict = {};
  var tabGalleries = {};

  var currentTab = Object.keys(tabData)[0];

  initializeGallery();

  async function initializeGallery() {
    await loadTabs();
    imageDict[currentTab] = await loadImages(currentTab, 0, 3);

    selectTab(currentTab);
    centerImage.addEventListener('click', () => {
      rewriteLightbox('flex', centerImage.src, centerImage.alt);
      applyImageStyle(lightboxImg, centerImage.ratio, 'max(40vw, 18rem + 18vw)');
    });

    await loadFirstThrees();
    addTabFunctionality();
    await loadRemainingImages();
    addButtonFunctionality();
    galleryHeader.addEventListener("click", () => swapGallery())
    lightboxContainer.addEventListener('click', () => rewriteLightbox('none', '', ""));
  }
  function swapGallery() {
    if (currentGallery == Display.SCROLL) {
      currentGallery = Display.ALL;
      galleryHeader.textContent = "Display scroll gallery"
      slideshowContainer.style.display = 'none';
      tabGalleriesContainer.style.display = '';
      selectTab(currentTab);
    }
    else {
      currentGallery = Display.SCROLL;
      galleryHeader.textContent = "Display full gallery";
      slideshowContainer.style.display = '';
      tabGalleriesContainer.style.display = 'none';
    }
  }
  function loadFirstThrees() {
    var promises = [];
    for (const tabName in tabData) {
      if (tabName == currentTab) continue;
      promises.push(loadImages(tabName, 0, 3).then(imgs => imageDict[tabName] = imgs));
    }
    return Promise.all(promises);
  }

  async function loadRemainingImages() {
    var promises = [];
    for (const tabName in tabData) {
      promises.push(loadImages(tabName, 3, tabData[tabName].length)
        .then(imgs => imageDict[tabName] = imageDict[tabName].concat(imgs)));
    }
    return Promise.all(promises);
  }

  function loadImages(tabName, startIndex, endIndex) {
    var tabList = [];
    for (let i = startIndex; i < endIndex; i++) {
      tabList.push(loadImage(tabName, i));
    }
    return Promise.all(tabList);
  }

  function loadImage(tabName, imageIndex, parentPath = 'https://isaimel.github.io/Current-Website-Project/assets/') {
    return new Promise((resolve) => {
      var img = new Image();
      var imageName = tabData[tabName][imageIndex];
      var imagePath = `${parentPath}${tabName}/${imageName}`;
      img.src = imagePath;
      img.alt = descriptionsData[tabName][imageName];
      img.onload = () => {
        img.ratio = img.naturalWidth > img.naturalHeight ? Orientation.LANDSCAPE : Orientation.PORTRAIT;
        img.addEventListener('click', () => {
          rewriteLightbox('flex', img.src, img.alt);
          applyImageStyle(lightboxImg, img.ratio, 'max(40vw, 18rem + 18vw)')
        });
        tabGalleries[tabName].appendChild(img);
        resolve(img);
      }
      img.onerror = () => resolve(img);
    });
  }
  function rewriteLightbox(displayStyle, imageSource, imageAlt) {
    lightboxContainer.style.display = displayStyle;
    lightboxImg.src = imageSource;
    lightboxDescription.innerHTML = imageAlt;
  }

  function loadTabs() {
    return new Promise((resolve) => {
      for (const key in tabData) {
        var tabDiv = document.createElement("div");
        var galleryDiv = document.createElement("div");

        tabDivList[key] = tabDiv;
        tabGalleries[key] = galleryDiv;
        tabDiv.textContent = key.replace(/^./, char => char.toUpperCase());

        tabContainer.appendChild(tabDiv);
        tabGalleriesContainer.appendChild(galleryDiv);
      }
      resolve();
    });
  }

  function addTabFunctionality() {
    for (const key in tabDivList) {
      tabDivList[key].addEventListener("mouseover", () => swapTab(key));
    }
  }

  function addButtonFunctionality() {
    leftButton.addEventListener("click", () => plusDivs(-1));
    rightButton.addEventListener("click", () => plusDivs(1));
  }

  function selectTab(newTabName) {
    var oldTabName = currentTab;
    var oldDiv = tabDivList[oldTabName];
    oldDiv.style.backgroundColor = '';
    oldDiv.style.color = '';


    var newDiv = tabDivList[newTabName];
    newDiv.style.backgroundColor = "var(--color-1)";
    newDiv.style.color = "var(--color-2)";

    currentTab = newTabName;
    if (currentGallery == Display.SCROLL) showDivs();
    else showGallery(oldTabName);
  }

  function swapTab(tabName) {
    if (tabName == currentTab) {
      return;
    }
    middleImgInd = 1;
    selectTab(tabName);
  }

  function showDivs() {
    var pathList = imageDict[currentTab];

    var leftImg = pathList[modLoop(middleImgInd - 1, pathList.length)];
    var centerImg = pathList[middleImgInd];
    var rightImg = pathList[modLoop(middleImgInd + 1, pathList.length)];

    leftImage.src = leftImg.src;
    centerImage.src = centerImg.src;
    rightImage.src = rightImg.src;

    centerImage.alt = centerImg.alt;
    centerImage.ratio = centerImg.ratio;
    itemDescription.innerHTML = centerImg.alt;

    applyImageStyle(leftImage, leftImg.ratio);
    applyImageStyle(centerImage, centerImg.ratio);
    applyImageStyle(rightImage, rightImg.ratio);
  }
  function showGallery(oldTab) {
    tabGalleries[oldTab].style.display = '';
    tabGalleries[currentTab].style.display = 'flex';
  }
  function plusDivs(n) {
    middleImgInd = modLoop(middleImgInd + n, imageDict[currentTab].length);
    showDivs();
  }
}
function applyImageStyle(imgElement, ratio, percent = '100%') {
  if (ratio === undefined) ratio = Orientation.PORTRAIT;
  if (ratio == Orientation.LANDSCAPE) {
    imgElement.style.width = percent;
    imgElement.style.height = 'auto';
  } else {
    imgElement.style.height = percent;
    imgElement.style.width = 'auto';
  }
}
function modLoop(n, cap) {
  if (n >= cap) {
    return 0
  }
  if (n < 0) {
    return cap - 1
  }
  return n;
}
function loadImageSimple(imageLocation, parentPath = 'https://isaimel.github.io/Current-Website-Project/assets/') {
  return new Promise((resolve) => {
    var img = new Image();
    img.src = `${parentPath}/${imageLocation}`;
    img.onload = () => {
      resolve(img);
    }
    img.onerror = () => resolve(img);
  });
}
function createYTFrame(videoID) {
  return new YT.Player(videoID, {
    height: '200',
    width: '200',
    videoId: videoID
  });
}
function prepareYoutubeAPI() {
  const projects = document.getElementById("projects");
  var tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName('script')[0]
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}
function onYouTubeIframeAPIReady() {
  fetch(jsonFileURL)
    .then(response => response.json())
    .then(jsonData => fillYoutubeIFrames(document.getElementById("projects")));
}
function fillYoutubeIFrames(parentDiv) {
  var allFrames = parentDiv.querySelectorAll(".youtube_iframe");
  allFrames.forEach(frame => {
    createYTFrame(frame.id)
  });
}