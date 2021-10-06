const $bestSellers = $("#best-seller-container");
var $searchFrm = $("#search-form");
var $searchTxt = $("#search-input");
var $histList = $("#search-history-list");
var $searchSelect = $("#form-select");
var $loader = $("#loader");

var $searchContainer = $("#search-result-container");

var $errorLblEl;
var searchQuery;
var searchType;

var arr_hisSearch = [];
var local_storedHis;

function storeData() {
  localStorage.setItem("searchItem", JSON.stringify(arr_hisSearch));
  return;
}

function saveHistory(inpt) {
  //if none of the input matches with any existing items in array, push as new item
  //lets check the length of array, if reaches 10, remove first item
  for (i = 0; i < arr_hisSearch.length; i++) {
    //lets set both items to compare to upper case.
    //this prevents saving the same search input of different character cases.
    var cased_inpt = inpt.toUpperCase();
    var cased_arrItem = arr_hisSearch[i].toUpperCase();
    if (cased_arrItem.includes(cased_inpt)) {
      //if the data exists, re-do search
      clearSearchResults();
      return;
    }
  }

  arr_hisSearch.push(inpt);
  if (arr_hisSearch.length === 11) {
    var new_arr = [];
    //fill new array with existing array
    new_arr = arr_hisSearch.slice(1);
    arr_hisSearch = new_arr;
  }

  storeData();
  loadHistory();
  return;
}

function loadHistory() {
  local_storedHis = JSON.parse(localStorage.getItem("searchItem"));

  if (local_storedHis !== null) {
    var arrUnsorted = [];
    for (var j = 0; j < local_storedHis.length; j++) {
      arrUnsorted.push(local_storedHis[j]);
    }
    arr_hisSearch = arrUnsorted;
    displayHistEl();
  } else {
    return;
  }
}

// SERVER APIs
function getBestSellerAPI() {
  var NytAPIKey = "n0MXIKtdoTP0TGIXEBn3dResJCtNHSai";

  var queryURL =
    "https://api.nytimes.com/svc/books/v3/lists/current/hardcover-fiction.json?api-key=" +
    NytAPIKey;

  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    // declare best sellers in a response
    var bestSellers = response.results.books;
    var displayList = "";

    for (var i = 0; i < 5; i++) {
      displayList = `
        <div class="bestseller-list">
        <h4>${bestSellers[i].title}</h4>
        <img class="best-seller-img" src="${bestSellers[i].book_image}">
        <br>
        <p>Ranking: ${bestSellers[i].rank}</p>
        <p>Last Week Ranking: ${bestSellers[i].rank_last_week || "N/A"}</p>
        <p>Weeks on List: ${bestSellers[i].weeks_on_list || "New this week"}</p>
        <br>
        </div>
      `;    

      $bestSellers.append(displayList);

    }
  });
}

function getSearchAPI(searchQ, searchT) {
  var bookUrl = "https://www.googleapis.com/books/v1/volumes?q=";
  var queryType;
  var user_input = searchQ.replace(/\s/g, "+");

  switch (searchT) {
    case "author":
      queryType = "inauthor:"; // Will need to be sanitized. For example Stephen King becomes Stephen+King using Splice() replace*()
      //searchQuery.replace(' ','+')
      break;
    case "title":
      queryType = "intitle:";
      break;
    case "isbn":
      queryType = "isbn:";
      break;
    case "subject":
      queryType = "subject:";
      break;
    case "all":
      queryType = "";
      break;
    default:
      queryType = "";
      break;
  }

  var baseUrl = bookUrl + queryType + user_input;

  if (searchQ !== "") {
    $.ajax({
      url: baseUrl,
      method: "GET",
      dataType: "json",

      beforeSend: function () {
        $loader.show();
      },
      complete: function () {
        $loader.hide();
        $searchContainer.show();
      },
      success: function (res) {
        //console.log(res);
        if (res.totalItems === 0) {
          //console.log("Error\n" + err.message);
          $searchContainer.show();
          $searchContainer.append(
            "Search result for " + searchQ + " is not found."
          );
        } else {
          //console.log(searchQ);
          saveHistory(searchQ);
          displaySearchResult(res);
          return;
        }
      },
      error: function (err) {
        console.log("Error\n" + err.message);
        $searchContainer.show();
        $searchContainer.append(
          "Search result for " + searchQ + " is not found."
        );
      },
    });
  }

  // ALTERNATE FETCH METHOD
  // fetch(baseUrl, {
  //   credentials: "same-origin",
  //   referrerPolicy: "same-origin",
  // })
  // .then(function (response) {
  //     if (!response.ok) {
  //         throw response.json();
  //     }
  //     $loader.show();
  //     return response.json();
  // })
  // .then(function (data) {
  //   console.log(data);
  //   $loader.hide();
  //     saveHistory(searchQ);
  //     displaySearchResult(data);
  //     return;
  // })
  // .catch(function (err) {
  //     console.log("Error\n" + err.message);
  //     $searchContainer.show();
  //     $searchContainer.append("Search result for " + searchQ + " is not found.");
  // });
}

function clearSearchResults() {
  $searchContainer.text("");
}

function displaySearchResult(result) {
  $searchContainer.show();

  var resultItems = result["items"];
  var resultLength = resultItems.length;

  for (i = 0; i < resultLength; i++) {
    var BookTitle = resultItems[i]["volumeInfo"]["title"];
    if (BookTitle) {
      var infoLink = resultItems[i]["volumeInfo"]["infoLink"];
      if (infoLink) {
        var disp_title = $("<a>")
          .attr("href", infoLink)
          .attr("id", "infoLink")
          .addClass("item-title")
          .append(BookTitle);
      } else {
        var disp_title = $("<p>").addClass("item-title").append(BookTitle);
      }
    }

    //var BookDesc = resultItems[i]['searchInfo']['textSnippet'];
    var BookDesc = resultItems[i]["volumeInfo"]["description"];
    if (BookDesc) {
      var disp_desc = $("<p>").addClass("item-desc").append(BookDesc);
    }

    var BookAuthor_s = resultItems[i]["volumeInfo"]["authors"];
    if (BookAuthor_s) {
      var Author_sLen = BookAuthor_s.length;
      //console.log(Author_sLen);
      var $disp_authr_head = $("<div>")
        .addClass("item-author")
        .append("Author(s):");

      for (j = 0; j < Author_sLen; j++) {
        //console.log(BookAuthor_s[j]);
        var disp_authr = $("<p>").append(BookAuthor_s[j]);

        $disp_authr_head.append(disp_authr);
      }
    }

    var BookDesc = resultItems[i]["volumeInfo"]["description"];
    if (BookDesc) {
      var disp_desc = $("<p>").addClass("item-desc").append(BookDesc);
    }

    var BookPublisher = resultItems[i]["volumeInfo"]["publisher"];
    var BookPublDate = resultItems[i]["volumeInfo"]["publishedDate"];

    //var pubDate = moment(BookPublDate).format("DD-MMMM-YYYY");
    var pubDate = BookPublDate;

    if (BookPublisher) {
      if (BookPublDate) {
        var BookPublisher = $("<p>")
          .addClass("item-published")
          .append("Published: " + BookPublisher + ", " + pubDate);
      } else {
        var BookPublisher = $("<p>")
          .addClass("item-published")
          .append("Published: " + BookPublisher);
      }
    } else {
      if (BookPublDate) {
        var BookPublisher = $("<p>")
          .addClass("item-published")
          .append("Published: " + pubDate);
      }
    }

    var BooksImage = resultItems[i]["volumeInfo"]["imageLinks"];
    var previewLink = resultItems[i]["volumeInfo"]["previewLink"];
    var disp_prevLink;
    if (previewLink) {
      disp_prevLink = $("<a>")
        .attr("href", previewLink)
        .attr("target", "_blank")
        .attr("id", "previewLink")
        .addClass("item-link")
        .append("Preview Book");
    } else {
      disp_prevLink.text("");
    }

    if (BooksImage) {
      //var BookSThumbN = resultItems[i]['volumeInfo']['imageLinks']['smallThumbnail'];
      var BookThumbN = resultItems[i]["volumeInfo"]["imageLinks"]["thumbnail"];
      // console.log("Small Img: " + BookSThumbN);
      // console.log("Img: " + BookThumbN);

      $itemImg = $("<img>").attr("src", BookThumbN).addClass("img-border");

      var $itemImgDiv = $("<div>")
        .addClass("item-img")
        .append($itemImg, disp_prevLink);
    } else {
      $itemImg = $("<img>")
        .attr("alt", "Image not available")
        .addClass("img-border");

      var $itemImgDiv = $("<div>")
        .addClass("item-img")
        .append($itemImg, disp_prevLink);
    }

    var BookID = resultItems[i]["volumeInfo"]["industryIdentifiers"];
    if (BookID) {
      var BookIDLen = BookID.length;
      //console.log(BookIDLen);
      var $disp_id_head = $("<div>")
        .addClass("item-id")
        .append("Identifier(s):");

      for (k = 0; k < BookIDLen; k++) {
        var disp_id = $("<p>").append(
          BookID[k]["type"] + BookID[k]["identifier"]
        );
        $disp_id_head.append(disp_id);
      }
    }

    var $SResultListItem = $("<li>").addClass("search-result-list");

    var $SResultListItemInfo = $("<div>").addClass("item-desc");

    $SResultListItemInfo.append(
      disp_title,
      disp_desc,
      $disp_authr_head,
      BookPublisher,
      $disp_id_head
    );
    $SResultListItem.append($itemImgDiv, $SResultListItemInfo);
    $searchContainer.append($SResultListItem);
  }
}

function displayHistEl() {
  $histList.text("");

  for (x = 0; x < arr_hisSearch.length; x++) {
    var search_item = arr_hisSearch[x];

    var $historyListItem = $("<button>")
      .attr("id", "search-history-item")
      .attr("data-index", x)
      .addClass("search-history-item");

    $liBtnEl = $("<button>")
      .attr("id", "delete-history-item")
      .attr("data-index", x)
      .addClass("delete-history-item")
      .append("X");

    $historyListItem.append(search_item, $liBtnEl);

    $histList.append($historyListItem);
  }
  return;
}

function handleEvent(event) {
  event.preventDefault();
  event.stopPropagation();

  var target_el = event.target;

  if (target_el.id === "search-button") {
    searchQuery = $searchTxt.val();
    searchType = $searchSelect.val();
    handleSearch();
  }

  if (target_el.id === "search-history-item") {
    var trgt = event.target;
    var name = trgt.textContent;
    var search_name = name.slice(0, name.length - 1);
    //console.log(search_name);
    searchQuery = search_name;
    //loc_type = "city";
    handleSearch();
  }

  if (target_el.id === "delete-history-item") {
    var index = target_el.parentElement.getAttribute("data-index");
    arr_hisSearch.splice(index, 1);

    storeData();
    displayHistEl();

    clearForm();
    // location.reload();
  }

  if (target_el.id === "infoLink") {
    var infoLink = target_el.getAttribute("href");
    window.open(infoLink, "_blank");
  }

  if (target_el.id === "previewLink") {
    var previewLink = target_el.getAttribute("href");
    window.open(previewLink, "_blank");
  }
}

function handleSearch() {
  if (!searchQuery) {
    if ($errorLblEl) {
      $errorLblEl.remove();
    }

    $errorLblEl = $("<label>")
      .attr("type", "text")
      .addClass("input-error")
      .append("*Error: Please enter a value");

    $searchFrm.append($errorLblEl);

    $($searchTxt.focus());
    return;
  }

  if ($errorLblEl) {
    $errorLblEl.remove();
  }

  clearSearchResults();
  getSearchAPI(searchQuery, searchType);
  clearForm();

  return;
}

function clearForm() {
  searchQuery = "";
  $($searchTxt).val("");
  $($searchTxt.focus());
}

function initiate() {
  loadHistory();
  getBestSellerAPI();
  $searchContainer.hide();
  $searchTxt.focus();
  //console.log(arr_hisSearch);
}

initiate();

$(window).ready(function () {
  $(window).on("click", handleEvent);
});
