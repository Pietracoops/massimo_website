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
    for (let i = 0; i < sortedUniqueLanguages.length; i++) 
    {
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

    // Swap the Other tag to the end of the list
    indexOfOther = -1
    for (let i = 0; i < projectsByLanguage.length; i++)
    {
      if (projectsByLanguage[i].language == 'other')
      {
        indexOfOther = i
        break
      } 
    }

    if (indexOfOther !== -1) {
      const removedItem = projectsByLanguage.splice(indexOfOther, 1);
      projectsByLanguage.push(removedItem[0]);
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
    navButtonAnchorTag.setAttribute("href", "");
    navButtonAnchorTag.setAttribute("data-filter",`.${projectsByLanguage[i].language.replaceAll('+', "p").replaceAll('#', "h").replaceAll(' ', "_")}`);
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
      cardContainer.classList.add("Portfolio-box", projectsByLanguage[i].language.replaceAll('+', "p").replaceAll('#', 'h').replaceAll(' ', "_"));
      linkToRepo.setAttribute("href", projectsByLanguage[i].projects[j].url);
      /*repoImg.setAttribute("src", "img/Portfolio-pic1.jpg");*/
      repoImg.setAttribute("src", "img/" + projectsByLanguage[i].projects[j].name + ".png");
      repoImg.setAttribute("onerror", "imageLoadError()");
      linkToRepo.setAttribute("onclick", "return confirmImageLoad()");
      
      projectName.textContent = projectsByLanguage[i].projects[j].name;
      projectDescription.textContent = projectsByLanguage[i].projects[j].description;

      // projectsByLanguage[i].projects[j].description

      // Append card to dom
      portfolioContainer.appendChild(cardContainer);
      cardContainer.appendChild(linkToRepo);
      linkToRepo.appendChild(repoImg);
      cardContainer.appendChild(projectName);
      cardContainer.appendChild(projectDescription);
    }
  }
};

// MIGRATED JQUERY SCRIPTS FROM INDEX FILE, RESPONSIBLE FOR STYLING THE PORTFOLIO SECTION
function stylePortfolioSection() {
  $(document).ready(function (e) {
    $("#test").scrollToFixed();
    $(".res-nav_click").click(function () {
      $(".main-nav").slideToggle();
      return false;
    });

    /*$(".Portfolio-box").magnificPopup({
      delegate: "a",
      type: "image",
    });*/
  });

  wow = new WOW({
    animateClass: "animated",
    offset: 100,
  });
  wow.init();

  $(window).load(function () {
    $(".main-nav li a, .servicelink").bind("click", function (event) {
      var $anchor = $(this);

      $("html, body")
        .stop()
        .animate(
          {
            scrollTop: $($anchor.attr("href")).offset().top - 102,
          },
          1500,
          "easeInOutExpo"
        );
      /*
  			if you don't want to use the easing effects:
  			$('html, body').stop().animate({
  				scrollTop: $($anchor.attr('href')).offset().top
  			}, 1000);
  			*/
      if ($(window).width() < 768) {
        $(".main-nav").hide();
      }
      event.preventDefault();
    });
  });

  $(window).load(function () {
    var $container = $(".portfolioContainer"),
      $body = $("body"),
      colW = 375,
      columns = null;

    $container.isotope({
      // disable window resizing
      resizable: true,
      masonry: {
        columnWidth: colW,
      },
    });

    $(window)
      .smartresize(function () {
        // check if columns has changed
        var currentColumns = Math.floor(($body.width() - 30) / colW);
        if (currentColumns !== columns) {
          // set new column count
          columns = currentColumns;
          // apply width to container manually, then trigger relayout
          $container.width(columns * colW).isotope("reLayout");
        }
      })
      .smartresize(); // trigger resize to set container width
    $(".portfolioFilter a").click(function () {
      $(".portfolioFilter .current").removeClass("current");
      $(this).addClass("current");

      var selector = $(this).attr("data-filter");
      $container.isotope({
        filter: selector,
      });
      return false;
    });
  });
}

// IMMEDIATELY INVOKED FUNCTION THAT CONTROLS THE FLOW OF THE DATA FETCHING AND THE APPENDING OF THE CARDS TO THE DOM
(async function controller() {
  const retrievedData = getGitHubRepos();
  projectCardsAppendToDom(await retrievedData);
  stylePortfolioSection();
})();


// function confirmImageLoad() {
//   return confirm("The image could not be loaded. Do you want to proceed to the link?");
// }

// function imageLoadError() {
//   alert("The image could not be loaded.");
// }