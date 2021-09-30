const bestSellers = document.getElementById("best-seller-container");

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
