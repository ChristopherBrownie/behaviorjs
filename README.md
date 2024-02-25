TODO:

### Menu (drop down)

[x] attrs: menu, menu-button `<button>`, menu-items `<div>`, menu-item `<a>`
[x] menu-button opens/closes menu-items when clicked
[] when menu is open, items receives focus and is automatically navigable via keyboard
[] determine which is active for styling purposes (data-attrs?)
[] be able to control open/close state manually
[] disabled menu items should be skipped with keyboard navigation
[] focus is trapped within open menu until escape or click outside open menu (closing)
[] closing menu returns focus to menu button

Accessibility
[x] `role="menu"` on menu to open/close
[x] `role="menuitem"` on menu options
[x] `aria-haspopup="true"` on menu button (static)
[] `aria-controls="ID_REFERENCE"` on menu button referencing the menu (static)
[x] `aria-expanded="true/false"` on button depending on open state of menu
[] `aria-labelledby="ID_REFERENCE"` on menu referencing button
[] `aria-activedescendant="ID_REFERENCE"` on menu pointing to actively focused option
[] `tabindex="-1"` on menu to focus via js with .focus()

Advanced Keyboard interactions
[] Enter/Space with focused button: open and focus first non disabled option
[] Up/Down Arrows with focused button: open and focus first/last non disabled option
[] Escape when menu open: close menu
[] Up/Down Arrows with menu open: focus previous/next non disabled option
[] Home/PageUp with menu open: focus first non disabled option
[] End/PageDown with menu open: focus last non disabled option
[] Enter/Space with menu open: click current option
[] any letter with menu open: focus first item that matches input

### Dialog (modal)

[] attrs: dialog, dialog-panel `<button>`, dialog-title `<div>`, dialog-description `<a>`
[] when opened, focus state moves inside the dialog to first item
[] focus is trapped in open dialog, when reaching end it cycles back to beginning
[] click outside dialog panel will close dialog
[] pressing escape will close the dialog
[] `aria-labelledby="ID_REFERENCE"` to dialog-title on dialog-panel
[] `aria-describedby="ID_REFERENCE"` to dialog-description on dialog-panel
[] specify specific item to focus when opened
[] portal to render dialog as sibling to the root-most node (child of body)
[] transitions for opening/closing
[] separate transitions for backdrop and dialog panel
[] dialog panel has `role=dialog` and `aria-modal=true`

### Popover

TBD
