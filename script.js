let openingsData = [];
let currentOpeningIndex = null;
let currentPositionIndex = 0;

// Grab DOM elements
const openingsListEl = document.getElementById("openingsList");
const positionViewEl = document.getElementById("positionView");
const backToOpeningsBtn = document.getElementById("backToOpenings");
const openingNameEl = document.getElementById("openingName");
const positionImageEl = document.getElementById("positionImage");
const positionTextEl = document.getElementById("positionText");
const positionAudioEl = document.getElementById("positionAudio");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const positionCounterEl = document.getElementById("positionCounter");

// 1) Fetch the static JSON file on page load
fetch("openings.json")
  .then((res) => res.json())
  .then((data) => {
    openingsData = data;
    renderOpeningsList();
  })
  .catch((err) => {
    console.error("Error fetching openings data:", err);
  });

// 2) Render list of openings
function renderOpeningsList() {
  openingsListEl.innerHTML = "";
  openingsData.forEach((opening, index) => {
    const div = document.createElement("div");
    div.className = "openingItem";
    div.textContent = opening.name;
    div.addEventListener("click", () => {
      currentOpeningIndex = index;
      currentPositionIndex = 0;
      showPositionView();
    });
    openingsListEl.appendChild(div);
  });
}

// 3) Show position viewer for selected opening
function showPositionView() {
  openingsListEl.style.display = "none";
  positionViewEl.style.display = "block";
  updatePosition();
}

// 4) Load text file content for the position
async function fetchTextFile(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to load text file");
    }
    return await response.text();
  } catch (err) {
    return "Unable to load text.";
  }
}

// 5) Update the displayed position (SVG, audio, text)
async function updatePosition() {
  const currentOpening = openingsData[currentOpeningIndex];
  const positions = currentOpening.positions;
  const currentPos = positions[currentPositionIndex];

  openingNameEl.textContent = currentOpening.name;
  positionImageEl.src = currentPos.svg || "";
  positionAudioEl.src = currentPos.mp3 || "";

  const textContent = currentPos.text
    ? await fetchTextFile(currentPos.text)
    : "No text available.";
  positionTextEl.textContent = textContent;

  positionCounterEl.textContent = `${currentPositionIndex + 1} / ${positions.length}`;

  // Enable/disable navigation buttons
  prevBtn.disabled = currentPositionIndex === 0;
  nextBtn.disabled = currentPositionIndex === positions.length - 1;
}

// 6) Navigation buttons
prevBtn.addEventListener("click", () => {
  if (currentPositionIndex > 0) {
    currentPositionIndex--;
    updatePosition();
  }
});

nextBtn.addEventListener("click", () => {
  const positions = openingsData[currentOpeningIndex].positions;
  if (currentPositionIndex < positions.length - 1) {
    currentPositionIndex++;
    updatePosition();
  }
});

// 7) Back button to return to openings list
backToOpeningsBtn.addEventListener("click", () => {
  positionViewEl.style.display = "none";
  openingsListEl.style.display = "flex";
});
