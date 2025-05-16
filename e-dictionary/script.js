document.addEventListener('DOMContentLoaded', function () {
    displayRecentWord();
    displaybookmarkedWord();
});

let loading_animation = document.getElementById('loading_animation');

$(window).on('load', function () {
    $('#loading_animation').hide();
});

let search_word = document.getElementById('search_word');
let card_title = document.getElementById('card_title');
let word_meaning = document.getElementById('word_meaning');
let word_example = document.getElementById('word_example');
let word_pronounciation = document.getElementById('word_pronounciation');
let word_audio_source = document.getElementById('word_audio_source');
let word_audio = document.getElementById('word_audio');
let audio_btn = document.getElementById('audio_btn');
let search_btn = document.getElementById('search_btn');
let reset_btn = document.getElementById('reset_btn');
let bookmark_icon = document.getElementById('bookmark_icon');
let word_history_section = document.getElementById('word_history_section');
let word_result_div = document.getElementById('word_result_div');

search_btn.addEventListener('click', async function () {
    bookmark_icon.getElementsByTagName("i")[0].className = "bi bi-bookmark";
    let show_result = document.getElementById('show_result');
    show_result.style.display = "none";
    if (search_word.value === "") {
        show_result.style.display = "none";
        var toastLiveExample = document.getElementById('liveToast');
        var toast = new bootstrap.Toast(toastLiveExample);
        toast.show();
    } else {
        await fetchWord();
        word_history_section.style.display = "none";
        loading_animation.style.display = "block";

        setTimeout(function () {
            loading_animation.style.display = "none";
            word_history_section.style.display = "block";
            show_result.style.display = "block";
        }, 1000);
    }

    let recently_searched = localStorage.getItem("recently_searched");
    let recentWord = recently_searched ? JSON.parse(recently_searched) : [];

    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${search_word.value}`);
    const data = await response.json();

    let recentObj = {
        title: `${data[0].word}`,
        meaning: `${data[0].meanings[0].definitions[0].definition}`,
    };

    if (search_word.value !== "") {
        recentWord.push(recentObj);
        localStorage.setItem("recently_searched", JSON.stringify(recentWord));
        displayRecentWord();
    }
});

search_word.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        search_btn.click();
    }
});

reset_btn.addEventListener('click', function () {
    search_word.value = "";
    let show_result = document.getElementById('show_result');
    show_result.style.display = "none";
    localStorage.removeItem("recently_searched");  // Clear all recently searched words
    displayRecentWord();  // Update the display
});

async function fetchWord() {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${search_word.value}`);
    const data = await response.json();
    if (response.ok) {
        audio_btn.style.display = "block";
        bookmark_icon.style.display = "block";

        card_title.innerHTML = `${data[0].word}`;
        word_meaning.innerHTML = `<br>  <b><i>Meaning: </i></b>  ${data[0].meanings[0].definitions[0].definition}`;
        word_example.innerHTML = `<b><i>Example: </i></b>   ${data[0].meanings[0].definitions[0].example}`;
        word_audio_source.src = `${data[0].phonetics[0].audio}`;
        word_pronounciation.innerHTML = `<b><i>Pronounciation:</i></b>  ${data[0].phonetics[0].text}`;
    } else {
        card_title.innerHTML = `${data.title}`;
        word_meaning.innerHTML = `${data.message}`;
        word_example.innerHTML = `${data.resolution}`;
        word_pronounciation.innerHTML = "";
        audio_btn.style.display = "none";
        bookmark_icon.style.display = "none";
    }
}

audio_btn.addEventListener('click', function (e) {
    e.preventDefault();
    audio_btn.getElementsByTagName("i")[0].className = "bi bi-volume-down-fill";
    word_audio.load(); // Call this to just preload the audio without playing
    word_audio.play();
    word_audio.addEventListener('ended', function () {
        audio_btn.getElementsByTagName("i")[0].className = "bi bi-volume-down";
    });
});

function displayRecentWord() {
    let recently_searched = localStorage.getItem("recently_searched");
    let recentWord = recently_searched ? JSON.parse(recently_searched) : [];
    let html = "";
    recentWord.forEach(function (element, index) {
        html += `<div class="recent_word my-2 mx-2 card" style="width: 20rem;">
        <div class="card-body">
           <button id ="recent_popover" type="button" class="btn " data-bs-toggle="popover" data-bs-trigger="hover focus" data-bs-placement="bottom" title="${element.title}"
            data-bs-content="${element.meaning}"> <h5 class="card-title">${element.title}</h5>
        </button>
            </div>
    </div>`;
    });
    let recently_searched_element = document.getElementById('recently_searched');
    let recent_search_title = document.getElementById("recent_search_title");
    if (recentWord.length !== 0) {
        recent_search_title.style.display = "block";
        recently_searched_element.innerHTML = html;
    } else {
        recent_search_title.style.display = "none";
        recently_searched_element.innerHTML = "";
    }
}

function deleteRecentSearch(index) {
    let recently_searched = localStorage.getItem("recently_searched");
    let recentWord = recently_searched ? JSON.parse(recently_searched) : [];
    if (index === 4) {
        recentWord.splice(0, 1);
        localStorage.setItem("recently_searched", JSON.stringify(recentWord));
        displayRecentWord();
    }
}

// Bookmark functionality remains unchanged
let bookmark_btn = document.getElementById('bookmark_btn');

bookmark_icon.addEventListener('click', function () {
    let bookmark_icon_class = bookmark_icon.getElementsByTagName("i")[0].className;

    let bookmarked_words = localStorage.getItem("bookmarked_words");
    let bookmarkedObj = bookmarked_words ? JSON.parse(bookmarked_words) : [];

    if (bookmark_icon_class === "bi bi-bookmark") {
        bookmark_icon.getElementsByTagName("i")[0].className = "bi bi-bookmark-check-fill";
        let bookmark_parent = this.parentElement;
        bookmarkedObj.push(bookmark_parent.getElementsByTagName("h5")[0].innerHTML);
        localStorage.setItem("bookmarked_words", JSON.stringify(bookmarkedObj));
        displaybookmarkedWord();
    } else {
        bookmark_icon.getElementsByTagName("i")[0].className = "bi bi-bookmark";
    }
});

function displaybookmarkedWord() {
    let bookmarked_words = localStorage.getItem("bookmarked_words");
    let bookmarkedObj = bookmarked_words ? JSON.parse(bookmarked_words) : [];
    let html = "";
    bookmarkedObj.forEach(function (element, index) {
        html += `<li id=${index}><h4>${element}<button id=${index} type="button" class="btn-close text-reset"
        aria-label="Close" onclick="delete_bookmarkWord(this.id)"></button></h4></li><br>`;
    });
    let bookmarked_words_element = document.getElementById('bookmarked_words_element');
    if (bookmarkedObj.length !== 0) {
        bookmarked_words_element.innerHTML = html;
    } else {
        bookmarked_words_element.innerHTML = `<h5>No words bookmarked !!</h5>`;
    }
}

function delete_bookmarkWord(index) {
    let bookmarked_words = localStorage.getItem("bookmarked_words");
    let bookmarkedObj = bookmarked_words ? JSON.parse(bookmarked_words) : [];
    bookmarkedObj.splice(index, 1);
    localStorage.setItem("bookmarked_words", JSON.stringify(bookmarkedObj));
    displaybookmarkedWord();
}

var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
    return new bootstrap.Popover(popoverTriggerEl);
});

let mybutton = document.getElementById("btn-back-to-top");

window.onscroll = function () {
    scrollFunction();
};

function scrollFunction() {
    if (
        document.body.scrollTop > 20 ||
        document.documentElement.scrollTop > 20
    ) {
        mybutton.style.display = "block";
    } else {
        mybutton.style.display = "none";
    }
}

mybutton.addEventListener("click", backToTop);

function backToTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}
