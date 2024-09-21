import config from '../config.js';

const attr = 'menu';
const buttonAttr = 'menu-button';
const missingButtonMsg = 'Missing menu button inside menu...';
const panelAttr = 'menu-panel';
const missingPanelMsg = 'Missing menu panel inside menu...';
const itemAttr = 'menu-item';
const missingItemMsg = 'Missing menu item inside menu...';

export default { init, open, close, toggle };

function selector() {
    return '[' + config.prefix + attr + ']';
}

function buttonSelector() {
    return '[' + config.prefix + buttonAttr + ']';
}

function panelSelector() {
    return '[' + config.prefix + panelAttr + ']';
}

function itemSelector() {
    return '[' + config.prefix + itemAttr + ']';
}

function getParentMenu(element) {
    if (!element) {
        console.warn('Could not get parent menu from empty element.');
        return;
    }
    let menu = element.closest(selector());
    if (!menu) {
        // TODO: better warning/logging
        console.warn('Unexpected missing menu!');
    }
    return menu;
}

function init() {
    console.log('initializing menus...');
    let menus = document.querySelectorAll(selector());
    for (let i = 0; i < menus.length; i++) {
        let menu = menus[i];
        // Load relevant elements
        let button = menu.querySelector(buttonSelector());
        if (!button) {
            console.warn(missingButtonMsg, menu);
            continue;
        }
        let panel = menu.querySelector(panelSelector());
        if (!panel) {
            console.warn(missingPanelMsg, menu);
            continue;
        }
        let items = panel.querySelectorAll(itemSelector());

        // Initialize button
        if (!button.hasAttribute('aria-haspopup')) {
            button.setAttribute('aria-haspopup', 'true');
        }
        button.addEventListener('click', onButtonClick);
        button.addEventListener('keydown', onButtonKeyDown);
        button.addEventListener('keyup', onButtonKeyUp);

        // Initialize drop down
        if (!panel.hasAttribute('role')) {
            panel.setAttribute('role', 'menu');
        }
        panel.addEventListener('keydown', onPanelKeyDown);
        panel.addEventListener('keyup', onPanelKeyUp);

        // Initialize items
        for (let j = 0; j < items.length; j++) {
            if (!items[j].hasAttribute('role')) {
                items[j].setAttribute('role', 'menuitem');
            }
            items[j].addEventListener('click', onItemClick);
            items[j].addEventListener('focus', onItemFocus);
        }
    }
}

/**
 * @param {HTMLElement} menu
 */
function open(menu) {
    console.log('Opening menu...');
    let button = menu.querySelector('[' + config.prefix + buttonAttr + ']');
    button.setAttribute('aria-expanded', 'true');
    let panel = menu.querySelector('[' + config.prefix + panelAttr + ']');
    panel.style.display = 'block';
}

/**
 * @param {HTMLElement} menu
 * @param {boolean} preventScroll
 */
function close(menu, preventScroll) {
    console.log('Closing menu...');
    let button = menu.querySelector('[' + config.prefix + buttonAttr + ']');
    button.setAttribute('aria-expanded', 'false');
    let panel = menu.querySelector('[' + config.prefix + panelAttr + ']');
    panel.style.display = 'none';
    // TODO: clear focused item?
    button.focus({ preventScroll: !!preventScroll });
}

/**
 * @param {HTMLElement} menu
 */
function toggle(menu) {
    console.log('Menu toggled...');
    let button = menu.querySelector('[' + config.prefix + buttonAttr + ']');
    if (button.getAttribute('aria-expanded') === 'true') {
        // close menu
        close(menu);
    } else {
        // open menu
        open(menu);
    }
}

/**
 * @param {Event} evt
 */
function onButtonClick(evt) {
    toggle(getParentMenu(evt.target));
}

/**
 * @param {KeyboardEvent} evt
 */
function onButtonKeyDown(evt) {
    let menu = getParentMenu(evt.target);
    switch (evt.key) {
        case ' ':
        case 'Enter':
        case 'ArrowDown':
            evt.preventDefault();
            evt.stopPropagation();
            open(menu);
            // TODO: go to first item
            break;

        case 'ArrowUp':
            evt.preventDefault();
            evt.stopPropagation();
            close(menu);
            // TODO: go to last item
            break;
    }
}

/**
 * @param {KeyboardEvent} evt
 */
function onButtonKeyUp(evt) {
    switch (evt.key) {
        case ' ':
            // Required for firefox, event.preventDefault() in handleKeyDown for
            // the Space key doesn't cancel the handleKeyUp, which in turn
            // triggers a click.
            evt.preventDefault();
            break;
    }
}

/**
 * @param {KeyboardEvent} evt
 */
function onPanelKeyDown(evt) {
    // TODO: debounce searching

    switch (evt) {
        // Ref: https://www.w3.org/WAI/ARIA/apg/patterns/menu/#keyboard-interaction-12
        case ' ':
        case 'Enter':
            // TODO: should we allow searching on space?
            evt.preventDefault();
            evt.stopPropagation();
            // TODO: IF focused on an item, click that menu item
            close(getParentMenu(evt.target));
            break;

        case 'ArrowDown':
            evt.preventDefault();
            evt.stopPropagation();
            // TODO: Focus next item
            break;

        case 'ArrowUp':
            evt.preventDefault();
            evt.stopPropagation();
            // TODO: Focus previous item
            break;

        case 'Home':
        case 'PageUp':
            evt.preventDefault();
            evt.stopPropagation();
            // TODO: Focus first item
            break;

        case 'End':
        case 'PageDown':
            evt.preventDefault();
            evt.stopPropagation();
            // TODO: Focus last item
            break;

        case 'Escape':
            evt.preventDefault();
            evt.stopPropagation();
            close(getParentMenu(evt.target), true);
            break;

        case 'Tab':
            evt.preventDefault();
            evt.stopPropagation();
            close(getParentMenu(evt.target));
            // TODO: focus next focusable item after button
            // if shift key (evt.shiftKey) then focus previous
            break;

        default:
            if (evt.key.length === 1) {
                // TODO: search list of items for match
            }
            break;
    }
}

/**
 * @param {KeyboardEvent} evt
 */
function onPanelKeyUp(evt) {
    switch (evt.key) {
        case ' ':
            // Required for firefox, event.preventDefault() in handleKeyDown for
            // the Space key doesn't cancel the handleKeyUp, which in turn
            // triggers a click.
            evt.preventDefault();
            break;
    }
}

// TODO: scroll menu-item into view when focused?

/**
 * @param {Event} evt
 */
function onItemClick(evt) {
    // TODO: if item is disabled return event.preventDefault()
    close(getParentMenu(evt.target));
}

/**
 * @param {Event} evt
 * TODO: Is this method needed?
 */
function onItemFocus(evt) {
    // TODO: If item is disabled remove focus
    evt.target.focus();
}
