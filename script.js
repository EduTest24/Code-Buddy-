const apiUrl =
  "https://script.google.com/macros/s/AKfycbzlxaCqb1I6U5MfjGvJaa3c6pcYPCgWUkkAPseqctPZx4zk0VEhHGS81KqjEXwjAV9Dgg/exec";
let currentPrograms = [];

// Load programs for a selected language
function loadPrograms(language) {
  document.getElementById("loader").style.display = "block";
  document.getElementById("success-message").style.display = "none";
  document.getElementById("error-message").style.display = "none";

  fetch(apiUrl + "?language=" + language)
    .then((response) => response.json())
    .then((data) => {
      currentPrograms = data;
      const programNames = document.getElementById("program-names");
      programNames.innerHTML = "";

      data.forEach((program) => {
        const programName = program[1];
        const programCode = program[2];
        const detectedLanguage = detectLanguage(program[0]);

        // Add program names to sidebar
        const programLink = document.createElement("a");
        programLink.href = "#";
        programLink.textContent = programName;
        programLink.onclick = () =>
          displayCode(programName, programCode, detectedLanguage, programLink);
        programNames.appendChild(programLink);
      });

      document.getElementById("loader").style.display = "none";
      document.getElementById("success-message").style.display = "block";
    })
    .catch((error) => {
      console.error("Error:", error);
      document.getElementById("loader").style.display = "none";
      document.getElementById("error-message").style.display = "block";
    });
}

// Display the selected program code in the code container
function displayCode(name, code, language, link) {
  const codeContainer = document.getElementById("code-container");
  document.getElementById("program-title").textContent = name;
  codeContainer.innerHTML = `<pre class="language-${language}"><code>${code}</code></pre>`;
  Prism.highlightAll();

  document
    .querySelectorAll(".sidebar a")
    .forEach((a) => a.classList.remove("active"));
  link.classList.add("active");
}

// Detect language for syntax highlighting
function detectLanguage(language) {
  const langMap = {
    C: "c",
    Java: "java",
  };
  return langMap[language] || "none";
}

// Search for a program by name and display its code
function searchProgram(event) {
  event.preventDefault();
  const query = document
    .getElementById("search-input")
    .value.trim()
    .toLowerCase();

  const result = currentPrograms.find(
    (program) => program[1].toLowerCase() === query
  );

  if (result) {
    displayCode(result[1], result[2], detectLanguage(result[0]));
  } else {
    alert("Program not found!");
  }
}

// Copy code to clipboard
function copyCode() {
  const code = document.getElementById("code-container").innerText;
  const copyButton = document.querySelector(".copy-btn");

  navigator.clipboard.writeText(code).then(() => {
    // Change button text to "Copied!"
    copyButton.innerHTML = "Copied!";

    // Revert button text back to the clipboard icon after 2 seconds
    setTimeout(() => {
      copyButton.innerHTML = `
  Copy
`;
    }, 2000);
  });
}
