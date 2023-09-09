import nav from "./components/navigation/nav.js";
import pwaInstallPrompt from "./components/prompts/pwaInstallPrompt.js";
nav();
pwaInstallPrompt(document.querySelector("#install"));



// keycodes
// 13,32,40,101 -> playpause
// 39 , 102 -> skipforward
// 37 , 100-> backward
//  80, 105-> picture in picture
//  38, 104-> fullscreen
//  40, 98-> normal screen
