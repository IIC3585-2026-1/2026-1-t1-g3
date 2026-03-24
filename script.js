#! Obtain all the cards from the MAIN or DOM
const cards = document.querySelectorAll(".card");

let first = null;
let second = null;
let lock = false;

cards.forEach(card => {
  card.addEventListener("click", () => {
    if (lock || card === first) return;

    /*with classList we can add a class to a certain element*/ 
    card.classList.add("flipped");

    /*if the first card is not selected, we select it*/
    if (!first) {
      first = card;
      return;
    }

    second = card;
    lock = true;

    /*if the first card is the same as the second card, we add the match class to both cards*/
    if (first.dataset.symbol === second.dataset.symbol) {
      first.classList.add("match");
      second.classList.add("match");
      reset();
      /*if the first card is not the same as the second card, we add the wrong class to both cards*/
    } else {
      first.classList.add("wrong");
      second.classList.add("wrong");

      /*we remove the flipped and wrong classes from both cards after 800ms*/
      setTimeout(() => {
        first.classList.remove("flipped", "wrong");
        second.classList.remove("flipped", "wrong");
        reset();
      }, 800);
    }
    /*we reset the game after 800ms*/
  });
});

function reset() {
  first = null;
  second = null;
  lock = false;
}