const tryOutOfChoice = document.getElementById("tryout-of-choice");
let itemSelectedForBuying;

const itemsForSale = document.querySelectorAll(".item-img");
for (let i = 0; i < itemsForSale.length; i++) {
  itemsForSale[i].addEventListener('click', equip => {
    tryOutOfChoice.src = itemsForSale[i].currentSrc;
    itemSelectedForBuying = itemsForSale[i].currentSrc;
  })
}

function makePurchase(element_id) {
  fetch("/inventory", {
    method: 'POST',
    body: JSON.stringify({element_id}),
    headers: {
      'Content-type': 'application/json'
    }
  }).then(() => window.location.href = window.location.href) // ERROR HERE
  .catch(console.log);
}


/* set phrase in case user character doesn't own any items yet */

const itemList = document.querySelector(".item-list");
const introPhrase = document.getElementById("intro-phrase")

if (itemList.childNodes.length === 3) {
  introPhrase.style.display = 'unset'
}

/* equip and unequip items front-side */

const ownedItems = document.querySelectorAll(".item");
const uniqueImages = document.querySelectorAll(".unique-image");

function changeButtonStatus(btnText) {
  if (btnText.innerText === "Equip") {
    btnText.innerText = "Unequip";
  } else if (btnText.innerText === "Unequip") {
    btnText.innerText = "Equip";
  }
}


// ERROR HERE
ownedItems.forEach(item => item.onclick = () => {
  const srcBtn = item.childNodes[1].src.substr(item.childNodes[1].src.lastIndexOf('/') + 1).slice(0, -4);
  
  for (let i = 0; i < uniqueImages.length; i ++) {
    if (srcBtn === uniqueImages[i].id) {
      console.log('asdasd')
      uniqueImages[i].classList.remove('show-item');
      uniqueImages[i].classList.toggle('equipToggle');
      break;
    } /* else {
      uniqueImages[i].classList.contains('show-item');
      break;
    } */
  }

  
  changeButtonStatus(item.childNodes[5]);
});

// const targetNode = document.getElementById('character-image');
// const config = { attributes: true, childList: true, characterData: true};
// let nodeChange;

// const callback = function(mutationsList, observer) {
//   for(const mutation of mutationsList) {
//     if (mutation.type === 'childList') nodeChange = mutation.addedNodes[0].style.backgroundImage;
//   }
// };

// const observer = new MutationObserver(callback);
// observer.observe(targetNode, config);

/* equip and unequip items back-side */

function equipUnequip(id) {
  fetch("/inventory", {
    method: 'PATCH',
    body: JSON.stringify({id}),
    headers: {
      'Content-type': 'application/json'
    }
  })
  .catch(console.log);
}