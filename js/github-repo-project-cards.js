// SELECTED GITHUB ACCOUNT FROM THE GITHUB API
const url = "https://api.github.com/users/pietracoops/repos";

// THIS FUNCTION FETCHES THE REPOS FROM THE ACCOUNT,AND RETURNS THE NECESSARY DATA FROM EACH PROJECT, ORGANIZED BY LANGUAGE
const getGitHubRepos = async function () {
  try {
    // Fetch repo data
    const data = await fetch(url);
    const dataJSON = await data.json();

    // Add languages of each repo into array of languages
    const languages = [];

    await dataJSON.map((repo) => {
      languages.push(repo.language);
    });

    // Reduce array of languages to contain only unique values
    const uniqueLanguages = languages.filter((value, index, array) => {
      return array.indexOf(value) === index;
    });

    // Reorder array of unique languages based on the number of projects that use said language
    const numOfOccurrencesOfLanguages = {};

    uniqueLanguages.map((language) => {
      numOfOccurrencesOfLanguages[language] = 0;
    });

    dataJSON.map((repo) => {
      numOfOccurrencesOfLanguages[repo.language] += 1;
    });

    const sortedUniqueLanguages = uniqueLanguages.sort((a, b) => {
      const projectsA = numOfOccurrencesOfLanguages[a] || 0; // Default to 0 if language not found
      const projectsB = numOfOccurrencesOfLanguages[b] || 0; // Default to 0 if language not found

      return projectsB - projectsA; // Sort in descending order of project count
    });

    // Create a new array of objects
    const projectsByLanguage = [];

    // Organize the objects within the array by language
    for (let i = 0; i < sortedUniqueLanguages.length; i++) {
      projectsByLanguage.push({
        language: sortedUniqueLanguages[i] || "other", // Some repos from the api call may have languages that equal to null
        projects: [],
      });

      // Place all projects into array of objects, organized by language
      dataJSON.map((repo) => {
        if (
          repo.language === projectsByLanguage[i].language ||
          (projectsByLanguage[i].language === "other" && repo.language === null) // Include the case of repos that have their languages equal to null
        ) {
          projectsByLanguage[i].projects.push({
            name: repo.name,
            description: repo.description,
            url: repo.html_url,
          });
        }
      });
    }
    return projectsByLanguage;
  } catch (error) {
    throw error;
  }
};

// THIS FUNCTION THAT CREATES PROJECT CARDS AND APPENDS THEM TO THE DOM OF THE WEBSITE
const projectCardsAppendToDom = function (projectsByLanguage) {
  console.log(projectsByLanguage);

  // Declare elements in html that this function will interact with
  const portfolioNav = document.querySelector(".Portfolio-nav");
  const portfolioContainer = document.querySelector(".portfolioContainer");

  for (let i = 0; i < projectsByLanguage.length; i++) {
    // Create navigation button for language
    const navButton = document.createElement("li");
    const navButtonAnchorTag = document.createElement("a");

    // Assign classes, attributes and text
    navButtonAnchorTag.setAttribute("href", "#");
    navButtonAnchorTag.setAttribute(
      "data-filter",
      `.${projectsByLanguage[i].language.replace(/\s+/g, "-")}`
    );
    navButtonAnchorTag.textContent = projectsByLanguage[i].language;

    // Append navigation button to dom
    portfolioNav.appendChild(navButton);
    navButton.appendChild(navButtonAnchorTag);

    for (let j = 0; j < projectsByLanguage[i].projects.length; j++) {
      // Create elements for cards
      const cardContainer = document.createElement("div");
      const linkToRepo = document.createElement("a");
      const repoImg = document.createElement("img");
      const projectName = document.createElement("h3");
      const projectDescription = document.createElement("p");

      // Assign classes and text content
      cardContainer.classList.add(
        "Portfolio-box",
        projectsByLanguage[i].language.replace(/\s+/g, "-"),
        "isotope-item"
      );
      linkToRepo.setAttribute("href", projectsByLanguage[i].projects[j].url);
      repoImg.setAttribute("src", "img/Portfolio-pic1.jpg");
      projectName.textContent = projectsByLanguage[i].projects[j].name;
      projectDescription.textContent =
        projectsByLanguage[i].projects[j].description;

      // Append card to dom
      portfolioContainer.appendChild(cardContainer);
      cardContainer.appendChild(linkToRepo);
      linkToRepo.appendChild(repoImg);
      cardContainer.appendChild(projectName);
      cardContainer.appendChild(projectDescription);
    }
  }
};

// IMMEDIATELY INVOKED FUNCTION THAT CONTROLS THE FLOW OF THE DATA FETCHING AND THE APPENDING OF THE CARDS TO THE DOM
(async function controller() {
  const retrievedData = getGitHubRepos();
  projectCardsAppendToDom(await retrievedData);
})();
