const menu = {
    attr: 'menu',
    button: {
        attr: 'menu-button',
        missingMsg: 'Missing menu button inside menu...',
    },
    dropdown: {
        attr: 'menu-items',
        missingMsg: 'Missing menu items inside menu...',
    },
    items: {
        attr: 'menu-item',
        missingMsg: 'Missing menu button inside menu...',
    },
};

menu.init = function () {
    let menus = document.querySelectorAll('[' + prefix + menu.attr + ']');
    for (let i = 0; i < menus.length; i++) {
        let menuElement = menus[i];

        // Load relevant elements
        let buttonElement = menuElement.querySelector(
            '[' + prefix + menu.button.attr + ']',
        );
        if (!buttonElement) {
            console.warn(menu.button.missingMsg, menuElement);
            continue;
        }
        let dropdownElement = menuElement.querySelector(
            '[' + prefix + menu.dropdown.attr + ']',
        );
        if (!dropdownElement) {
            console.warn(menu.dropdown.missingMsg, menuElement);
            continue;
        }
        let itemElements = dropdownElement.querySelectorAll(
            '[' + prefix + menu.items.el + ']',
        );

        // Initialize button
        if (!buttonElement.hasAttribute('aria-haspopup')) {
            buttonElement.setAttribute('aria-haspopup', 'true');
        }
        buttonElement.addEventListener('click', menu.button.handleClick);
        buttonElement.addEventListener('keydown', menu.button.handleKeyDown);
        buttonElement.addEventListener('keyup', menu.button.handleKeyUp);

        // Initialize drop down
        if (!dropdownElement.hasAttribute('role')) {
            dropdownElement.setAttribute('role', 'menu');
        }
        dropdownElement.addEventListener(
            'keydown',
            menu.dropdown.handleKeyDown,
        );
        dropdownElement.addEventListener('keyup', menu.dropdown.handleKeyUp);

        // Initialize items
        for (let j = 0; j < itemElements.length; j++) {
            if (!itemElements[j].hasAttribute('role')) {
                itemElements[j].setAttribute('role', 'menuitem');
            }
            itemElements[j].addEventListener('click', menu.items.handleClick);
            itemElements[j].addEventListener('focus', menu.items.handleFocus);
        }
    }
};

menu.open = function () {
    menu.button.el.setAttribute('aria-expanded', 'true');
    menu.dropdown.el.style.display = 'block';
};

/**
 * @param {boolean} preventScroll
 */
menu.close = function (preventScroll) {
    menu.button.el.setAttribute('aria-expanded', 'false');
    menu.dropdown.el.style.display = 'none';
    // TODO: clear focused item?
    menu.button.el.focus({ preventScroll: !!preventScroll });
};

menu.toggle = function () {
    console.log('Menu toggled');
    let open = menu.button.el.getAttribute('aria-expanded');
    if (open === 'true') {
        // close menu
        menu.close();
    } else {
        // open menu
        menu.open();
    }
};

/**
 * @param {Event} evt
 */
menu.button.handleClick = function (evt) {
    menu.toggle();
};

/**
 * @param {KeyboardEvent} evt
 */
menu.button.handleKeyDown = function (evt) {
    window.testEvent = evt;

    switch (evt.key) {
        case ' ':
        case 'Enter':
        case 'ArrowDown':
            evt.preventDefault();
            evt.stopPropagation();
            menu.open();
            // TODO: go to first item
            break;

        case 'ArrowUp':
            evt.preventDefault();
            evt.stopPropagation();
            menu.close();
            // TODO: go to last item
            break;
    }
};

/**
 * @param {KeyboardEvent} evt
 */
menu.button.handleKeyUp = function (evt) {
    switch (evt.key) {
        case ' ':
            // Required for firefox, event.preventDefault() in handleKeyDown for
            // the Space key doesn't cancel the handleKeyUp, which in turn
            // triggers a click.
            evt.preventDefault();
            break;
    }
};

/**
 * @param {KeyboardEvent} evt
 */
menu.dropdown.handleKeyDown = function (evt) {
    // TODO: debounce searching

    switch (evt) {
        // Ref: https://www.w3.org/WAI/ARIA/apg/patterns/menu/#keyboard-interaction-12
        case ' ':
        case 'Enter':
            // TODO: should we allow searching on space?
            evt.preventDefault();
            evt.stopPropagation();
            // TODO: IF focused on an item, click that menu item
            menu.close();
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
            menu.close(true);
            break;

        case 'Tab':
            evt.preventDefault();
            evt.stopPropagation();
            menu.close();
            // TODO: focus next focusable item after button
            // if shift key (evt.shiftKey) then focus previous
            break;

        default:
            if (evt.key.length === 1) {
                // TODO: search list of items for match
            }
            break;
    }
};

menu.dropdown.handleKeyUp = menu.button.handleKeyUp;

// TODO: scroll menu-item into view when focused?

/**
 * @param {Event} evt
 */
menu.items.handleClick = function (evt) {
    // TODO: if item is disabled return event.preventDefault()
    menu.close();
};

/**
 * @param {Event} evt
 * TODO: Is this method needed?
 */
menu.items.handleFocus = function (evt) {
    // TODO: If item is disabled remove focus
    evt.target.focus();
};
