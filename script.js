//Import id where the textContent gonna be change with the API
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-button");
const pokemonName = document.getElementById("pokemon-name");
const pokemonHp = document.getElementById("hp");
const pokemonAttack = document.getElementById("attack");
const pokemonDefense = document.getElementById("defense");
const pokemonSpAttack = document.getElementById("sp-attack");
const pokemonSpDefense = document.getElementById("sp-defense");
const pokemonSpeed = document.getElementById("speed");
const pokemonWeight = document.getElementById("weight");
const pokemonHeight = document.getElementById("height");
const pokemonFrame = document.getElementById("pokemon-frame");
const pokemonType = document.getElementById("pokemon-type");
// Import Button for the search pokemon with ID

const btnOne = document.getElementById("one");
const btnTwo = document.getElementById("two");
const btnThree = document.getElementById("three");
const btnFour = document.getElementById("four");
const btnFive = document.getElementById("five");
const btnSix = document.getElementById("six");
const btnSeven = document.getElementById("seven");
const btnEight = document.getElementById("eight");
const btnNine = document.getElementById("nine");
const btnZero = document.getElementById("zero");

// Import directional-pad another method to change pokemon
// and to see different frame of the pokemon

const leftArrow = document.getElementById("left-arrow");
const rightArrow = document.getElementById("right-arrow");
const centerBtn = document.getElementById("center-btn");
const downArrow = document.getElementById("down-arrow");
const upArrow = document.getElementById("up-arrow");


// It is variable are used in certain functions 
//and are mainly used for navigation in the different sprites of a pokemon 
//as well as to call a new id in the case where we want to see the next pokemon from the pokedex

let currentIndex = 0;
let currentIndexPokemon = 0;
let currentData = null;


// The Api Call
const fetchData = async (id) => {
  try {
    const res = await fetch(
      `https://pokeapi-proxy.freecodecamp.rocks/api/pokemon/${id}`
    );
    if (!res.ok) {
      throw new Error("Pokémon not found");
    }
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
    alert(err.message);
  }
};
// This function are used to update the content of the pokedex
// Stats , sprites,  Name, Id and more soon
const showPokemon = (data) => {
  pokemonName.textContent = `${data.name.toUpperCase()} #${data.id}`;
  pokemonHp.textContent = `HP : ${data.stats[0].base_stat}`;
  pokemonAttack.textContent = `Attack : ${data.stats[1].base_stat}`;
  pokemonDefense.textContent = `Defense : ${data.stats[2].base_stat}`;
  pokemonSpAttack.textContent = `SP. Attack : ${data.stats[3].base_stat}`;
  pokemonSpDefense.textContent = `SP. Defense : ${data.stats[4].base_stat}`;
  pokemonSpeed.textContent = `Speed : ${data.stats[5].base_stat}`;
  pokemonWeight.textContent = `Height: ${data.height}`;
  pokemonHeight.textContent = `Weight: ${data.weight}`;
  pokemonType.innerHTML = data.types
  .map(
    (typeInfo) => `<p class="${typeInfo.type.name}">${typeInfo.type.name.toUpperCase()}</p>`
  )
  .join("");

  // Start always the first sprite by the front_default sprite
  const spriteUrls = Object.values(data.sprites).filter((url) => url);
  currentIndex = spriteUrls.indexOf(data.sprites.front_default);
  currentIndexPokemon = data.id;

  // If don't frame was found always return the index 0 from the object
  if (currentIndex === -1) {
    currentIndex = 0;
  }
  updateImage(data.sprites, currentIndex);
};

// This function is for update the sprites
const updateImage = (sprites, index) => {
  const spriteUrls = Object.values(sprites).filter((url) => url); // Filtrer les URLs non nulles
  if (spriteUrls.length > 0) {
    pokemonFrame.src = spriteUrls[index % spriteUrls.length];
    pokemonFrame.style.display = "block";
  } else {
    pokemonFrame.style.src = "";
    pokemonFrame.style.display = "none";
  }
};


// In this function"nextFrame" and "PreviousFrame" We use the previous function to
// update the frame with the next or the previous sprite
const nextFrame = () => {
  const spriteUrls = Object.values(currentData.sprites).filter((url) => url); // Utiliser currentData.sprites
  currentIndex = (currentIndex + 1) % spriteUrls.length;
  updateImage(currentData.sprites, currentIndex);
};

const previousFrame = () => {
  const spriteUrls = Object.values(currentData.sprites).filter((url) => url); // Utiliser currentData.sprites
  if (spriteUrls.length > 0) {
    currentIndex = (currentIndex - 1 + spriteUrls.length) % spriteUrls.length;
    updateImage(currentData.sprites, currentIndex);
  } else {
    console.log("No sprite URLs found");
  }
};

// The two last function are create to navigate from  the actual pokemon
// to the next or the previous pokemon by their id
// We check if their are not the first or the last pokemon and after we re use the api call to update
// the content of the pokedex
const nextPokemonId = () => {
  if (currentIndexPokemon < 1025) {
    ++currentIndexPokemon;
    fetchData(currentIndexPokemon).then((data) => {
      if (data) {
        currentData = data;
        showPokemon(data);
      }
    });
  } else {
    currentIndexPokemon = 1;
    fetchData(currentIndexPokemon).then((data) => {
      if (data) {
        currentData = data;
        showPokemon(data);
      }
    });
  }
};

const previousPokemonId = () => {
  if (currentIndexPokemon > 1) {
    --currentIndexPokemon;
    fetchData(currentIndexPokemon).then((data) => {
      if (data) {
        currentData = data;
        showPokemon(data);
      }
    });
  } else {
    currentIndexPokemon = 1025;
    fetchData(currentIndexPokemon).then((data) => {
      if (data) {
        currentData = data;
        showPokemon(data);
      }
    });
  }
};
// When the search button is clicked, get the input value, convert it to lowercase,
// and fetch the Pokémon data. If data is found, update currentData and display the Pokémon.
// If no input is provided, show an alert.
searchBtn.addEventListener("click", () => {
  const id = searchInput.value.toLowerCase();
  if (id) {
    fetchData(id).then((data) => {
      if (data) {
        currentData = data;
        currentIndex = 0;
        showPokemon(data);
      }
    });
  } else {
    alert("Please enter a valid Pokémon name or ID");
  }
});

// Their four last EventListener are made to create a pad directional
// to navigate through Pokedex

rightArrow.addEventListener("click", () => {
  if (currentData) {
    nextFrame();
  }
});

leftArrow.addEventListener("click", () => {
  if (currentData) {
    previousFrame();
  }
});

downArrow.addEventListener("click", () => {
  nextPokemonId();
});

upArrow.addEventListener("click", () => {
  previousPokemonId();
});
