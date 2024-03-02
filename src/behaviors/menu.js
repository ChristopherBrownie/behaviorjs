// Menu dropdown
(function () {
    const self = {
        // main api
        init: init,
        open: open,
        close: close,
        toggle: toggle,

        // menu
        attr: 'menu',
        selector: selector,

        // button
        buttonAttr: 'menu-button',
        buttonSelector: buttonSelector,
        missingButtonMsg: 'Missing menu button inside menu...',
        onButtonClick: onButtonClick,
        onButtonKeyDown: onButtonKeyDown,
        onButtonKeyUp: onButtonKeyUp,

        // panel
        panelAttr: 'menu-panel',
        panelSelector: panelSelector,
        missingPanelMsg: 'Missing menu panel inside menu...',
        onPanelKeyDown: onPanelKeyDown,
        onPanelKeyUp: onPanelKeyUp,

        // item
        itemAttr: 'menu-item',
        itemSelector: itemSelector,
        missingItemMsg: 'Missing menu item inside menu...',
        onItemClick: onItemClick,
        onItemFocus: onItemFocus,

        // utils
        getParentMenu: getParentMenu,
    };

    function selector() {
        return '[' + window.prefix + self.attr + ']';
    }

    function buttonSelector() {
        return '[' + window.prefix + self.buttonAttr + ']';
    }

    function panelSelector() {
        return '[' + window.prefix + self.panelAttr + ']';
    }

    function itemSelector() {
        return '[' + window.prefix + self.itemAttr + ']';
    }

    function getParentMenu(element) {
        if (!element) {
            console.warn('Could not get parent menu from empty element.');
            return;
        }
        let menu = element.closest(self.selector());
        if (!menu) {
            // TODO: better warning/logging
            console.warn('Unexpected missing menu!');
        }
        return menu;
    }

    function init() {
        console.log('initializing menus...');
        let menus = document.querySelectorAll(self.selector());
        for (let i = 0; i < menus.length; i++) {
            let menu = menus[i];
            // Load relevant elements
            let button = menu.querySelector(self.buttonSelector());
            if (!button) {
                console.warn(self.missingButtonMsg, menu);
                continue;
            }
            let panel = menu.querySelector(self.panelSelector());
            if (!panel) {
                console.warn(self.missingPanelMsg, menu);
                continue;
            }
            let items = panel.querySelectorAll(self.itemSelector());

            // Initialize button
            if (!button.hasAttribute('aria-haspopup')) {
                button.setAttribute('aria-haspopup', 'true');
            }
            button.addEventListener('click', self.onButtonClick);
            button.addEventListener('keydown', self.onButtonKeyDown);
            button.addEventListener('keyup', self.onButtonKeyUp);

            // Initialize drop down
            if (!panel.hasAttribute('role')) {
                panel.setAttribute('role', 'menu');
            }
            panel.addEventListener('keydown', self.onPanelKeyDown);
            panel.addEventListener('keyup', self.onPanelKeyUp);

            // Initialize items
            for (let j = 0; j < items.length; j++) {
                if (!items[j].hasAttribute('role')) {
                    items[j].setAttribute('role', 'menuitem');
                }
                items[j].addEventListener('click', self.onItemClick);
                items[j].addEventListener('focus', self.onItemFocus);
            }
        }
    }

    /**
     * @param {HTMLElement} menu
     */
    function open(menu) {
        console.log('Opening menu...');
        let button = menu.querySelector(
            '[' + window.prefix + self.buttonAttr + ']',
        );
        button.setAttribute('aria-expanded', 'true');
        let panel = menu.querySelector(
            '[' + window.prefix + self.panelAttr + ']',
        );
        panel.style.display = 'block';
    }

    /**
     * @param {HTMLElement} menu
     * @param {boolean} preventScroll
     */
    function close(menu, preventScroll) {
        console.log('Closing menu...');
        let button = menu.querySelector(
            '[' + window.prefix + self.buttonAttr + ']',
        );
        button.setAttribute('aria-expanded', 'false');
        let panel = menu.querySelector(
            '[' + window.prefix + self.panelAttr + ']',
        );
        panel.style.display = 'none';
        // TODO: clear focused item?
        button.focus({ preventScroll: !!preventScroll });
    }

    /**
     * @param {HTMLElement} menu
     */
    function toggle(menu) {
        console.log('Menu toggled...');
        let button = menu.querySelector(
            '[' + window.prefix + self.buttonAttr + ']',
        );
        if (button.getAttribute('aria-expanded') === 'true') {
            // close menu
            self.close(menu);
        } else {
            // open menu
            self.open(menu);
        }
    }

    /**
     * @param {Event} evt
     */
    function onButtonClick(evt) {
        self.toggle(self.getParentMenu(evt.target));
    }

    /**
     * @param {KeyboardEvent} evt
     */
    function onButtonKeyDown(evt) {
        let menu = self.getParentMenu(evt.target);
        switch (evt.key) {
            case ' ':
            case 'Enter':
            case 'ArrowDown':
                evt.preventDefault();
                evt.stopPropagation();
                self.open(menu);
                // TODO: go to first item
                break;

            case 'ArrowUp':
                evt.preventDefault();
                evt.stopPropagation();
                self.close(menu);
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
                self.close(self.getParentMenu(evt.target));
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
                self.close(self.getParentMenu(evt.target), true);
                break;

            case 'Tab':
                evt.preventDefault();
                evt.stopPropagation();
                self.close(self.getParentMenu(evt.target));
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
        self.close(self.getParentMenu(evt.target));
    }

    /**
     * @param {Event} evt
     * TODO: Is this method needed?
     */
    function onItemFocus(evt) {
        // TODO: If item is disabled remove focus
        evt.target.focus();
    }

    window.menu = self;
})();
