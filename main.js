const h2 = document.getElementsByClassName('title-menu')[0];
const menuButton = document.querySelector('.burger .menu-button');

if (h2) {
  h2.addEventListener('mouseover', () => {
    menuButton.classList.add('hover');
  });

  h2.addEventListener('mouseout', () => {
    menuButton.classList.remove('hover');
  });
}

// Video Modal
document.addEventListener('DOMContentLoaded', () => {
  const playButton = document.getElementById('play'); // Add the class or ID of your button
  const videoContainer = document.querySelector('.video-container');
  const videoElement = document.getElementById('project-video');
  const closeButton = document.getElementById('close-video');

  if (playButton && videoContainer && videoElement && closeButton) {
    playButton.addEventListener('click', () => {
      console.log('Play button clicked');
      videoContainer.classList.remove('hidden');
      videoElement.muted = false;
      videoElement
        .play()
        .then(() => {
          console.log('Video is playing');
        })
        .catch((error) => {
          console.error('Video playback failed:', error);
        });
    });

    closeButton.addEventListener('click', () => {
      videoContainer.classList.add('hidden');
      videoElement.pause();
      videoElement.currentTime = 0;
    });

    // Pause/Play Video with Space Key
    document.addEventListener('keydown', (event) => {
      if (event.code === 'Space') {
        event.preventDefault();
        if (!videoElement.paused) {
          videoElement.pause();
          videoElement.muted = true;
        } else {
          videoElement.play();
          videoElement.muted = false;
        }
      }

      if (!videoElement.paused) {
        videoElement.pause();
        videoElement.currentTime = 0; // Reset video position
        videoElement.muted = true; // Ensure audio is muted
      }

      if (event.code === 'Escape') {
        closeModal();
      }
    });

    // Pause/Play Video with Left Mouse Button
    videoElement.addEventListener('mousedown', (event) => {
      if (event.button === 0) {
        if (!videoElement.paused) {
          videoElement.pause();
          videoElement.muted = true;
        } else {
          videoElement.play();
          videoElement.muted = false;
        }
      }
    });
  } else {
    console.error('One or more elements are missing in the DOM');
  }

  function closeModal() {
    if (!videoContainer.classList.contains('hidden')) {
      videoContainer.classList.add('hidden');
      videoElement.pause();
      videoElement.currentTime = 0;
      videoElement.muted = true;
    }
  }
});

// Form Modal
document.addEventListener('DOMContentLoaded', () => {
  const formBtn = document.getElementById('form-btn');
  const mobileBtn = document.getElementById('mobile-btn');
  const form = document.querySelector('.form-container');
  const formContainer = document.getElementById('callback-form');
  const closeFormButton = document.getElementById('close-form');
  const name = document.getElementById('name');
  const phoneInput = document.getElementById('phone');
  const emailInput = document.getElementById('email');

  if (closeFormButton) {
    closeFormButton.addEventListener('click', () => {
      formContainer.classList.add('hidden');
    });
  }

  if (formBtn) {
    formBtn.addEventListener('click', () => {
      form.classList.remove('hidden');
    });

    if (mobileBtn) {
      mobileBtn.addEventListener('click', () => {
        form.classList.remove('hidden');
      });
    }

    // Validate form inputs

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; //

      let isValid = true;

      // Validate phone number
      if (!phoneRegex.test(phoneInput.value)) {
        alert('Введите корректный номер телефона.');
        isValid = false;
      }

      // Validate email
      if (!emailRegex.test(emailInput.value)) {
        alert('Введите корректный e-mail.');
        isValid = false;
      }

      // Prevent form submission if validation fails
      if (!isValid) {
        event.preventDefault();
      }

      function getCall(name, phoneInput, emailInput) {
        const data = {
          name: name,
          phone: phoneInput,
          email: emailInput,
        };
        console.log(data);
      }

      function cleanUp() {
        name.value = '';
        phoneInput.value = '';
        emailInput.value = '';
      }

      async function sendForm(getCall, cleanUp) {
        await getCall(name.value, phoneInput.value, emailInput.value);
        await cleanUp();
      }

      if (isValid) {
        sendForm(getCall, cleanUp);
      }
    });

    // Close Form by press Escape
    const closeForm = () => {
      formContainer.classList.add('hidden');
    };

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !formContainer.classList.contains('hidden')) {
        closeForm();
      }
    });
  }
});
