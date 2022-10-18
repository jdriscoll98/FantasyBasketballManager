export const addEventListeners = (actions) => {
  // hack until i can get vue bindings for the components
  actions.forEach((action) => {
    const id = setInterval(() => {
      const { selector, event, handler } = action;
      const element = document.querySelector(selector);
      if (element) {
        element.addEventListener(event, handler);
        clearInterval(id);
      }
    }, 1000);
  });
};
