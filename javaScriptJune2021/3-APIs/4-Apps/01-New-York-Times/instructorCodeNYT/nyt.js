const baseURL = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
const key = "6oNKrDxKLvPNmHUn4AL34EG9kvNW03mc"; //individual key required
let url;

const searchTerm = document.querySelector(".search");
const startDate = document.querySelector(".start-date");
const endDate = document.querySelector(".end-date");
const searchForm = document.querySelector("form");
const submitBtn = document.querySelector(".submit");
const nextBtn = document.querySelector(".next");
const previousBtn = document.querySelector(".prev");
const nav = document.querySelector("nav");
const section = document.querySelector("section");

nav.style.display = "none"; //disables the article blocks until the search is completed

let pageNumber = 0;
// console.log('PageNumber:', pageNumber);

searchForm.addEventListener("submit", fetchResults);
nextBtn.addEventListener("click", nextPage);
previousBtn.addEventListener("click", previousPage);

function fetchResults(e) { //e is the short variable reference for event handler
  // console.log(e);
  e.preventDefault();  // prevents the page from reloading when we push submit
  console.log(e);
  url = `${baseURL}?api-key=${key}&page=${pageNumber}&q=${searchTerm.value}`;
  console.log("URL:", url);

  if (startDate.value !== "") {
    console.log(startDate.value);
    url += "&begin_date=" + startDate.value;
  }

  if (endDate.value !== "") {
    console.log(endDate.value);
    url += "&end_date=" + endDate.value;
  }

  fetch(url)
    .then(function (result) {
      //  console.log(result, 'line 43')
      return result.json();
    })
    .then(function (json) {
      console.log(json);
      displayResults(json);
    });
  console.log("this is a test");
}

function displayResults(json) {
  // console.log('Display Results', json);
  // console.log(json.response.docs);

  while (section.firstChild) {
    section.removeChild(section.firstChild); //preventing all the fetched data from piling up on one page
  }

  let articles = json.response.docs;
  // console.log(articles);

  if (articles.length === 0) {
    console.log("No results");
  } else {
    for (let i = 0; i < articles.length; i++) {
      console.log(i);
      let article = document.createElement("article");
      let heading = document.createElement("h2");
      let link = document.createElement("a");
      let img = document.createElement("img");
      let para = document.createElement("p");
      let clearfix = document.createElement("div");

      let current = articles[i];
      console.log("Current:", current);

      link.href = current.web_url;
      link.target = "blank";
      link.textContent = current.headline.main;

      para.textContent = "Keywords: ";

      for (let j = 0; j < current.keywords.length; j++) {
        let span = document.createElement("span");
        span.textContent += current.keywords[j].value + ", ";
        para.appendChild(span);
      }

      if (current.multimedia.length > 0) {
        img.src = "http://www.nytimes.com/" + current.multimedia[0].url;
        img.alt = current.headline.main;
      }

      clearfix.setAttribute("class", "clearfix");

      article.appendChild(heading);
      heading.appendChild(link);
      article.appendChild(img);
      article.appendChild(para);
      article.appendChild(clearfix);
      section.appendChild(article);
    }
  }

  if (articles.length === 10) {
    nav.style.display = "block";
    previousBtn.style.display = "block";
    nextBtn.style.display = "block";
  } else if (articles.length < 10 && pageNumber > 0) {
    nav.style.display = "block";
    previousBtn.style.display = "block";
    nextBtn.style.display = "none";
  } else {
    nav.style.display = "none";
  }
}

function nextPage(e) {
  // console.log('Next button clicked');
  pageNumber++;
  fetchResults(e);
  console.log("Page Number:", pageNumber);
}

function previousPage(e) {
  // console.log('Previous button clicked');
  if (pageNumber > 0) {
    pageNumber--;
    fetchResults(e);
  } else {
    return;
  }
  fetchResults(e);
  console.log("Page:", pageNumber);
}