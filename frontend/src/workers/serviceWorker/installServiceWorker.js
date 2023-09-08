if ("serviceWorker" in navigator) {
    window.onload = async function () {

        try {
            let reg = await navigator.serviceWorker.register("./src/workers/serviceWorker/worker.js");
            console.log(`Service Worker registered at ${reg.scope}`);

        } catch (err) {
            console.error(`Bothata ke bo : ${err}`);
        }
    }
}