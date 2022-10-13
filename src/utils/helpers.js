export const addEventListeners = (actions) => {
  actions.forEach((action) => {
    const [ev, element, callback] = action;
    element.addEventListener(ev, callback);
  });
};
