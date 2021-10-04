const bestSellers = document.getElementById("best-seller-container");
var list = [];

// local storage to parse json as an array
if (localStorage.getItem("searchItem")) {
  list = localStorage.getItem("searchItem");
  list = JSON.parse(list);
}

// appending the search items
function searchList() {
  let storedList = JSON.parse(localStorage.getItem("searchItem"));
  document.querySelector("#search-history").innerHTML = "";
  for (let i = 0; i < storedList.length; i++) {
    document.querySelector("#search-history").append(storedList[i] + " , ");
  }
}

if (list.length > 0) {
  searchList();
}

$("#search-button").click(function (event) {
  event.preventDefault();

  var searchTitle = $("#search-input").val();
  list.push(searchTitle);
  localStorage.setItem("searchItem", JSON.stringify(list));

  var responseURL =
    "https://www.googleapis.com/books/v1/volumes?q=" +
    searchTitle +
    "&key=AIzaSyCT1bI8iN0RIzSLYEPmZUDiadmozUA0ZGI";

  console.log(responseURL);
  $.ajax({
    url: responseURL,
    method: "GET",
  }).then(function (response) {
    console.log(response);
    $("#search-result").html("");
    for (var i = 0; i < response.items.length; i++) {
      var title = response.items[i].volumeInfo.title;
      console.log(title);
      var author = response.items[i].volumeInfo.authors;
      console.log(author);
      var publishedDate = response.items[i].volumeInfo.publishedDate;
      var bookImg = response.items[i].volumeInfo.imageLinks.smallThumbnail;
      var description = response.items[i].volumeInfo.description;
      var previewB = response.items[i].volumeInfo.previewLink;

      var displayBooks = $("<p>").html(
        "Title: " +
          title +
          "<br>" +
          "Author: " +
          author +
          "<br>" +
          "Description: " +
          description +
          "<br>" +
          "Published Date: " +
          publishedDate +
          "<hr>" +
          "<br>"
      );
      var preview = $("<a>").attr("href", previewB);

      var Img = $("<img>").attr("src", bookImg);

      $("#search-result").append(Img, displayBooks, preview);

      $("#search-result").css("display", "block");
    }
    searchList();
    // $("#search-button").reset();
  });
});

function getBestSellerAPI() {
  var NytAPIKey = "n0MXIKtdoTP0TGIXEBn3dResJCtNHSai";

  var queryURL =
    "https://api.nytimes.com/svc/books/v3/lists/current/hardcover-fiction.json?api-key=" +
    NytAPIKey;
  console.log(queryURL);

  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    console.log(response);

    // declare best sellers in a response
    var bestSellers = response.results.books;

    console.log(bestSellers);

    for (var i = 0; i < 5; i++) {
      var title = bestSellers[i].title;
      var auth = bestSellers[i].author;
      var bImg = bestSellers[i].book_image;
      var description = bestSellers[i].description;
      var rank = bestSellers[i].rank;

      var displayList = $("<p>").html(
        "Title: " +
          title +
          "<br>" +
          "Author: " +
          auth +
          "<br>" +
          "Description: " +
          description +
          "<br>" +
          "Rating: " +
          rank +
          "<br>"
      );

      var displayImg = $("<img>").attr("src", bImg);
      // $("#best-seller-container").append(displayImg);
      $("#best-seller-container").append(displayImg, displayList);
    }
  });

  // // declare best sellers in a response
  // var bestSellers = response.results.books;

  // console.log(bestSellers);

  // for (var i = 0; i < 5; i++) {
  //   var title = bestSellers[i].title;
  //   var auth = bestSellers[i].author;
  //   var bImg = bestSellers[i].book_image;
  //   var description = bestSellers[i].description;
  //   var rank = bestSellers[i].rank;

  //   var displayList = $("<p>").html(
  //     "Title: " +
  //       title +
  //       "<br>" +
  //       "Author: " +
  //       auth +
  //       "<br>" +
  //       "Description: " +
  //       description +
  //       "<br>" +
  //       "Rating: " +
  //       rank +
  //       "<br>"
  //   );

  //   var displayImg = $("<img>").attr("src", bImg);
  //   // $("#best-seller-container").append(displayImg);
  //   $("#best-seller-container").append(displayImg, displayList);
  // }
}

getBestSellerAPI();
