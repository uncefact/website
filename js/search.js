(function() {
    function displaySearchResults(results, store) {
        const searchResults = document.getElementById('search-results');
        const searchResultsAmount = document.getElementById('search-results-amount');

        if (results.length) { // Are there any results?
            let appendString = '';
            let pluralString = '';

            if (results.length > 1){
                pluralString = 's'
            }
            const articlesQty = 'Found ' + results.length + ' item' + pluralString;

            for (let i = 0; i < results.length; i++) {  // Iterate over the results
                const item = store[results[i].ref];
                appendString += '<div class="search-results__row">';
                appendString += '<div class="search-results__title"><a href="' + item.url + '" class="search-results__title-link">' + item.title + '</a></div>';
                appendString += '</div>';
            }

            searchResults.innerHTML = appendString;
            searchResultsAmount.innerHTML = articlesQty;
        } else {
            searchResults.innerHTML = '<div class="search-results__empty">No results found</div>';
            searchResults.classList.add('search-results__list--empty');
        }
    }

    function getQueryVariable(variable) {
        const query = window.location.search.substring(1);
        const vars = query.split('&');

        for (let i = 0; i < vars.length; i++) {
            const pair = vars[i].split('=');

            if (pair[0] === variable) {
                return decodeURIComponent(pair[1].replace(/\+/g, '%20'));
            }
        }
    }

    const searchTerm = getQueryVariable('query');

    if (searchTerm) {
        document.getElementById('search-box').setAttribute("value", searchTerm);
        document.getElementById('search-results-value').innerHTML = searchTerm;

        // Initalize lunr with the fields it will be searching on. I've given title
        // a boost of 10 to indicate matches on this field are more important.
        const idx = lunr(function () {
            this.field('id');
            this.field('title', { boost: 10 });
            this.field('content');
        });

        for (let key in window.store) { // Add the data to lunr
            idx.add({
                'id': key,
                'title': window.store[key].title,
                'content': window.store[key].content
            });

            const results = idx.search(searchTerm); // Get lunr to perform a search
            displaySearchResults(results, window.store);
        }
    }
})();
