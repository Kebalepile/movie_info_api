export default function keylogger(event, methods) {
  try {
    const keyCode = event.keyCode || event.key,
      method = methods.get(keyCode);

    if (method !== undefined) {
      method();
    }
    //  else {
    //   console.log("no method found for keycode ", keyCode);
    // }
  } catch (err) {
    console.error(err.message);
  }
}
