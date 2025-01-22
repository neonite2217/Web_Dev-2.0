showNotes();

let myBtn = document.getElementById('myBtn');

myBtn.addEventListener('click', function (e) {
    let noteTitle = document.getElementById('noteTitle').value;
    let textArea = document.getElementById('textarea').value;
    let notes = localStorage.getItem('notes');

    if (notes == null) {
        notesObj = [];
    } else {
        notesObj = JSON.parse(notes);
    }

    notesObj.push({ title: noteTitle, text: textArea });
    localStorage.setItem("notes", JSON.stringify(notesObj));

    document.getElementById('noteTitle').value = "";
    document.getElementById('textarea').value = "";
    showNotes();
});

function showNotes() {
    let notes = localStorage.getItem('notes');
    if (notes == null) {
        notesObj = [];
    } else {
        notesObj = JSON.parse(notes);
    }

    let html = "";
    notesObj.forEach(function (element, index) {
        html += `<div class="noteBox">
        <h3 class="noteHeading">${element.title ? element.title : `Note ${index + 1}`}</h3>
        <p class="paraHeading">${element.text}</p>
        <button class="buttonHeading" id="${index}" onclick="deleteNote(this.id)">Delete Note</button>
        </div>`;
    });

    let notesElem = document.getElementById('notes');
    if (notesObj.length !== 0) {
        notesElem.innerHTML = html;
    } else {
        notesElem.innerHTML = `Nothing to show, create a new note from "Add a note" section above.`;
    }
}

function deleteNote(index) {
    let notes = localStorage.getItem('notes');
    if (notes == null) {
        notesObj = [];
    } else {
        notesObj = JSON.parse(notes);
    }

    notesObj.splice(index, 1);
    localStorage.setItem('notes', JSON.stringify(notesObj));
    showNotes();
}

let search = document.getElementById('search');
search.addEventListener('input', function () {
    let inputVal = search.value.toLowerCase();

    let noteBoxs = document.getElementsByClassName('noteBox');
    Array.from(noteBoxs).forEach(function (element) {
        let boxTxt = element.getElementsByTagName('p')[0].innerText.toLowerCase();
        if (boxTxt.includes(inputVal)) {
            element.style.display = "block";
        } else {
            element.style.display = "none";
        }
    });
});

// Add event listener for Enter key to trigger search
search.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent default form submission behavior
        let inputEvent = new Event('input');
        search.dispatchEvent(inputEvent); // Trigger input event for search
    }
});

// Add event listener to textarea to handle Shift + Enter for new lines
document.getElementById('textarea').addEventListener('keydown', function (event) {
    if (event.key === 'Enter' && event.shiftKey) {
        event.preventDefault();
        const start = this.selectionStart;
        const end = this.selectionEnd;

        // Insert a newline at the current cursor position
        this.value = this.value.substring(0, start) + '\n' + this.value.substring(end);

        // Move the cursor to the next line
        this.selectionStart = this.selectionEnd = start + 1;
    }
});
