const createNoteBtn = document.getElementById('createNoteBtn');
const noteContainer = document.getElementById('noteContainer');

createNoteBtn.addEventListener('click', () => {
  const note = createNote();
  noteContainer.appendChild(note);
});

function createNote() {
  const note = document.createElement('div');
  note.classList.add('note');

  const textarea = document.createElement('textarea');
  textarea.placeholder = 'Escribe tu nota...';

  const saveBtn = document.createElement('button');
  saveBtn.textContent = 'Guardar';

  saveBtn.addEventListener('click', () => {
    const text = textarea.value;
    saveNoteToDatabase(text)
      .then(() => {
        alert('Nota guardada exitosamente');
      })
      .catch((error) => {
        console.error('Error al guardar la nota:', error);
        alert('Error al guardar la nota');
      });
  });

  note.appendChild(textarea);
  note.appendChild(saveBtn);

  return note;
}

function saveNoteToDatabase(note) {
  return fetch('/save-notes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ note: note })
  });
}

// Llama a esta función después de guardar una nota exitosamente
getUserNotes();

function getUserNotes() {
  fetch('/user-notes')
    .then((response) => response.json())
    .then((data) => {
      displayUserNotes(data);
    })
    .catch((error) => {
      console.error('Error al obtener las notas del usuario:', error);
    });
}

function displayUserNotes(notes) {
  // Limpiar el contenedor de notas
  noteContainer.innerHTML = '';

  // Mostrar las notas en el contenedor
  notes.forEach((note) => {
    const noteElement = createNote();
    noteElement.querySelector('textarea').value = note.text_note;
    noteContainer.appendChild(noteElement);
  });
}
// const addBtn = document.getElementById("add");

    // const notes = JSON.parse(localStorage.getItem("notes"));

    // if (notes) {
    //     notes.forEach((note) => {
    //         addNewNote(note);
    //     });
    // }

    // addBtn.addEventListener("click", () => {
    //     addNewNote();
    // });

    // function addNewNote(text = "") {
    //     const note = document.createElement("div");
    //     note.classList.add("note");

    //     note.innerHTML = `
    //     <div class="notes">
    //         <div class="tools">
    //         <button class="save"><i class="fas fa-save"></i></button>
    //         <button class="edit"><i class="fas fa-edit"></i></button>
    //         <button class="delete"><i class="fas fa-trash-alt"></i></button>
    //         </div>
    //         <div class="main ${text ? "" : "hidden"}"></div>
    //         <textarea class="${text ? "hidden" : ""}"></textarea>
    //     </div>
    //     `;

    //     const editBtn = note.querySelector(".edit");
    //     const deleteBtn = note.querySelector(".delete");
    //     const saveBtn = note.querySelector(".save");

    //     const main = note.querySelector(".main");
    //     const textArea = note.querySelector("textarea");

    //     textArea.value = text;
    //     main.innerHTML = marked(text);

    //     editBtn.addEventListener("click", () => {
    //         main.classList.toggle("hidden");
    //         textArea.classList.toggle("hidden");
    //     });

    //     saveBtn.addEventListener("click", () => {
    //         main.contentEditable = false;
    //         saveBtn.disabled = true;
    //         saveNoteToDatabase(textArea.value);
    //     });

    //     deleteBtn.addEventListener("click", () => {
    //         note.remove();

    //         updateLS();
    //     });

    //     textArea.addEventListener("input", (e) => {
    //         const { value } = e.target;

    //         main.innerHTML = marked(value);

    //         updateLS();
    //     });

    //     document.body.appendChild(note);
    // }

    // function updateLS() {
    //     const notesText = document.querySelectorAll("textarea");

    //     const notes = [];

    //     notesText.forEach((note) => {
    //         notes.push(note.value);
    //     });

    //     localStorage.setItem("notes", JSON.stringify(notes));
    // }

    // function saveNoteToDatabase(note) {
    //     fetch("/save-notes", {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify({ note: note }),
    //     })
    //     .then((response) => response.json())
    //     .then((data) => {
    //         console.log("Nota guardada exitosamente:", data);
    //     })
    //     .catch((error) => {
    //         console.error("Error al guardar la nota:", error);
    //     });
    // }
