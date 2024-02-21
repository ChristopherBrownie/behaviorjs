const prefix = 'data-js-';

// menu (drop down)
// attrs: menu <n/a>, menu-button <button>, menu-items <div>, menu-item <n/a>
// requirements:
// - accessibility role=menu
// - menu-button opens/closes menu-items when clicked
// - when menu is open, items receives focus and is automatically navigable via keyboard
// - determine which is active for styling purposes (data-attrs?)
// - be able to control open/close state manually
// - disabled menu items should be skipped with keyboard navigation
let menu = document.querySelector(prefix + 'menu');

if (!menu) return;

let menuButton = menu.querySelector(prefix + 'menu-button');
let menuItems = menu.querySelector(prefix + 'menu-items');
// let menuItem = menu.querySelector(prefix + 'menu-item');
