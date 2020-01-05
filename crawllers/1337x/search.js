async function search(browser, search, site = "https://1337x.to/") {
  try {
    var page = await browser.newPage();
    await page.goto(site + "search/" + search + "/1/");

    var searchResults = await page.evaluate(async () => {
      var searchResults = document.querySelector("tbody");
      if (!searchResults) {
        return { error: false, results: [], totalResults: 0 };
      }
      var tableRows = searchResults.querySelectorAll("tr");
      var results = [];

      tableRows.forEach(item => {
        var details =
          "Uploaded: " +
          item.querySelectorAll("td")[3].innerText +
          ", Size: " +
          item.querySelectorAll("td")[4].innerText +
          ", By: " +
          item.querySelectorAll("td")[5].innerText;
        results.push({
          name: item.querySelectorAll("td")[0].querySelector("a:last-of-type")
            .innerText,
          link: item.querySelectorAll("td")[0].querySelector("a:last-of-type")
            .href,
          seeds: item.querySelectorAll("td")[1].innerText,
          details
        });
      });

      return {
        error: false,
        results,
        totalResults: results.length,
        errorMessage: ""
      };
    });

    await page.close();

    return searchResults;
  } catch (err) {
    console.log(err);
    return { error: true, errorMessage: "Runtime error occured" };
  }
}

module.exports = search;
