document.addEventListener('DOMContentLoaded', () => {
  const flashcardsContainer = document.getElementById('flashcards');

  // Obtener datos de localStorage
  let contentArray = localStorage.getItem('items')
    ? JSON.parse(localStorage.getItem('items'))
    : [];

  // Función para crear una flashcard
  const createFlashcard = (text, index) => {
    const flashcard = document.createElement('div');
    flashcard.className = 'flashcard';
    flashcard.innerHTML = `
      <div class="front">${text.my_question}</div>
      <div class="back">${text.my_answer}</div>
    `;

    flashcard.addEventListener('click', () => {
      flashcard.classList.toggle('flipped');
    });

    flashcardsContainer.appendChild(flashcard);
  };

  // Recorrer los datos almacenados y crear las flashcards
  contentArray.forEach((text, index) => {
    createFlashcard(text, index);
  });

  // Función para agregar una nueva flashcard
  const addFlashcard = () => {
    const questionInput = document.getElementById('question');
    const answerInput = document.getElementById('answer');
    const flashcardInfo = {
      my_question: questionInput.value,
      my_answer: answerInput.value
    };

    contentArray.push(flashcardInfo);
    localStorage.setItem('items', JSON.stringify(contentArray));

    createFlashcard(flashcardInfo, contentArray.length - 1);

    questionInput.value = '';
    answerInput.value = '';
  };

  // Evento para guardar la nueva flashcard
  document.getElementById('save_card').addEventListener('click', addFlashcard);
});
