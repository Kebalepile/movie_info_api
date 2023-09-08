import nav from "./components/navigation/nav.js";
nav();

let pwaInstallPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  // Stash the event so it can be triggered later.
  pwaInstallPrompt = e;
});
const installButton = document.querySelector('#install')

installButton.addEventListener("click", (e) => {
  if (pwaInstallPrompt) {
    // Show the prompt
    pwaInstallPrompt.prompt();
    // Wait for the user to respond to the prompt
    pwaInstallPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the A2HS prompt');
      } else {
        console.log('User dismissed the A2HS prompt');
      }
      pwaInstallPrompt = null;
    });
  }
  e.target.blur();
});

  
