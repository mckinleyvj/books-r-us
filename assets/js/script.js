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


var searchContainer = document.getElementById("result-container");

var bookUrl = 'https://www.googleapis.com/books/v1/volumes?q=';

$(function bookSearch() {
  $("#search-button").on("click", function(event) {
    event.preventDefault();
    // console.log("you've clicked");

    let searchQuery = $("#search-input").val();
    let baseUrl = bookUrl + searchQuery;

    // console.log(baseUrl);

    if(searchQuery !== ""){

      $.ajax({
        url: baseUrl,
        method: "GET",
        dataType: "json",

        beforeSend: function() {
          $("#loader").show();
        },

        complete: function(){
          $("#loader").hide();
          $(".results-container").show();
        },

        success: function(res) {
          console.log(res);

          var searchOutput = "";

          for (var i = 0; i < res.items.length; i++) {
            searchOutput += `
            <div>
            <h4>${res.items[i].volumeInfo.title}</h4>
            <br>
            <img src="${res.items[i].volumeInfo.imageLinks.smallThumbnail}">
            <br>
            <p>${res.items[i].volumeInfo.authors}</p>
            <p>${res.items[i].volumeInfo.publishedDate}</p>
            <p class="ISBN">ISBN-13 No: ${res.items[i].volumeInfo.industryIdentifiers[0].identifier}</p>
            <p>${res.items[i].volumeInfo.description}</p>
            <a href="${res.items[i].volumeInfo.previewLink}" type="url">Preview Book</a>
            </div>
            <br>
            `
          }
          if(searchOutput !== "") {
            $("#search-list").html(searchOutput);
            console.log(searchQuery);

          } else {
            let noReslts = "There are no matching results for your query. Please try again."
            $("#search-list").html(noReslts);
            console.log(searchQuery);
          }
        },
        error: function() {
          console.log("error");
        }
      });
    }else{
      console.log("pls enter something");
    }
  });
  
});
