const flashcardContainer = document.querySelector(".flashcard-container");
const addFlashcardButton = document.getElementById("addFlashcard");
const questionInput = document.getElementById("question");
const answerInput = document.getElementById("answer");

// recuperar los flashcards al cargar la página
fetch("/flashcards-data")
  .then((response) => response.json())
  .then((data) => {
    data.forEach((flashcard) => {
      const { front_fc, back_fc } = flashcard;
      const newFlashcard = createFlashcard(front_fc, back_fc);
      flashcardContainer.appendChild(newFlashcard);
    });
  })
  .catch((error) => {
    console.error(error);
  });

addFlashcardButton.addEventListener("click", () => {
  const question = questionInput.value;
  const answer = answerInput.value;

  if (question && answer) {
    const flashcard = createFlashcard(question, answer);
    flashcardContainer.appendChild(flashcard);

    fetch("/save-flashcard", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question, answer }),
    })
      .then((response) => {
        if (response.ok) {
          console.log("Flashcard guardada en la base de datos.");
        } else {
          throw new Error("Error al guardar la flashcard en la base de datos.");
        }
      })
      .catch((error) => {
        console.error(error);
      });

    questionInput.value = "";
    answerInput.value = "";
  }
});

function createFlashcard(question, answer) {
  const flashcard = document.createElement("div");
  flashcard.classList.add("flashcard");

  const front = document.createElement("div");
  front.classList.add("front");
  front.innerHTML = `<div class="text">${question}</div>`;

  const back = document.createElement("div");
  back.classList.add("back");
  back.innerHTML = `<div class="text">${answer}</div>`;

  flashcard.appendChild(front);
  flashcard.appendChild(back);

  flashcard.addEventListener("click", () => {
    flashcard.classList.toggle("flipped");
  });

  return flashcard;
}
