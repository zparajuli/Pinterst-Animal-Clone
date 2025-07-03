let fetching = false;
const container = document.getElementById('container');
const cols = Array.from(container.getElementsByClassName('col'));
const loader = document.getElementById('loader');

// Optional Cat API Key
const CAT_API_KEY = ''; // 'live_xxx' if you have one

const fetchCatImages = async () => {
  try {
    const response = await fetch(`https://api.thecatapi.com/v1/images/search?limit=10`, {
      headers: {
        'x-api-key': CAT_API_KEY
      }
    });
    const data = await response.json();
    return data.map(item => item.url);
  } catch (error) {
    console.error("Error fetching cat images:", error);
    return [];
  }
};

const fetchDogImages = async () => {
  try {
    const response = await fetch(`https://dog.ceo/api/breeds/image/random/10`);
    const data = await response.json();
    return data.message;
  } catch (error) {
    console.error("Error fetching dog images:", error);
    return [];
  }
};

const fetchFoxImages = async (count = 5) => {
  const urls = [];
  try {
    for (let i = 0; i < count; i++) {
      const response = await fetch('https://randomfox.ca/floof/');
      const data = await response.json();
      urls.push(data.image);
    }
  } catch (error) {
    console.error("Error fetching fox images:", error);
  }
  return urls;
};

const fetchFrogImages = async (count = 5) => {
  try {
    const response = await fetch('https://frogpicturesapi.xyz/api/frogs');
    const data = await response.json();
    return data.data.slice(0, count).map(item => item.image);
  } catch (error) {
    console.error("Error fetching frog images:", error);
    return [];
  }
};

const fetchMixedImages = async () => {
  fetching = true;
  loader.style.display = 'block';

  try {
    const [cats, dogs, foxes, frogs] = await Promise.all([
      fetchCatImages(),
      fetchDogImages(),
      fetchFoxImages(5),
      fetchFrogImages(5)
    ]);

    const allImages = [...cats, ...dogs, ...foxes, ...frogs];

    // Shuffle the array to randomize order
    return allImages.sort(() => Math.random() - 0.5);
  } finally {
    fetching = false;
    loader.style.display = 'none';
  }
};

const createCard = (imageUrl, col) => {
  const card = document.createElement('div');
  card.classList.add('card');

  const img = document.createElement('img');
  img.src = imageUrl;
  img.alt = "Animal Image";

  img.onerror = function () {
    this.src = 'https://via.placeholder.com/300x200?text=Image+Error';
  };

img.addEventListener('click', () => {
  if (img.classList.contains('enlarged')) {

    img.classList.remove('enlarged');
    img.style.width = '';
    img.style.height = '';
  } else {

    const rect = img.getBoundingClientRect();
    const newWidth = rect.width * 3;
    const newHeight = rect.height * 3;


    img.style.width = `${newWidth}px`;
    img.style.height = `${newHeight}px`;

    img.classList.add('enlarged');
  }
});


  card.appendChild(img);
  col.appendChild(card);
};

const loadImages = async () => {
  const images = await fetchMixedImages();
  images.forEach((image, index) => {
    createCard(image, cols[index % cols.length]);
  });
};

window.addEventListener('scroll', () => {
  if (fetching) return;

  const scrollTop = window.scrollY;
  const windowHeight = window.innerHeight;
  const docHeight = document.documentElement.scrollHeight;

  if (docHeight - scrollTop - windowHeight < 800) {
    loadImages();
  }
});


  document.addEventListener('DOMContentLoaded', () => {
    const banner = document.getElementById('credit-banner');
    const btnOk = document.getElementById('credit-ok');
    const btnCancel = document.getElementById('credit-cancel');

    if (!localStorage.getItem('creditDismissed')) {
      banner.style.display = 'flex';
      // Push page content down so banner doesn't overlap fixed nav (if any)
      document.body.style.paddingTop = banner.offsetHeight + 'px';
    }

    const dismiss = () => {
      banner.style.display = 'none';
      localStorage.setItem('creditDismissed', 'true');
      document.body.style.paddingTop = '0';
    };

    btnOk.addEventListener('click', dismiss);
    btnCancel.addEventListener('click', dismiss);
  });


document.getElementById('imagePopup').addEventListener('click', () => {
  document.getElementById('imagePopup').classList.add('hidden');
});


loadImages();
