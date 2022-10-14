export const addEventListeners = (actions) => {
  // hack until i can get vue bindings for the components
  actions.forEach((action) => {
    const id = setInterval(() => {
      const { selector, event, handler } = action;
      const element = document.querySelector(selector);
      if (element) {
        console.log("adding event listener", selector, event);
        element.addEventListener(event, handler);
        clearInterval(id);
      } else {
        console.log("Could not find element", selector);
      }
    }, 1000);
  });
};
