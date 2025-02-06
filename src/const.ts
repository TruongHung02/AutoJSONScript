export const ACTION = {
  NEWTAB: 'NewTab',
  ACTIVATE_TAB: 'ActivateTab',
  OPEN_URL: 'OpenUrl',
  CLOSE_TAB: 'CloseTab',
  GO_BACK: 'GoBack',
  RELOAD_PAGE: 'ReloadPage',
  CLICK: 'Click',
  PRESS_KEY: 'Press',
  TYPE_TEXT: 'TypeText',
  MOUSE_MOVE: 'Move',
  SCROLL: 'Scroll',
  // ELEMENT_EXISTS: "ElementExists",
  // GET_URL: "GetUrl",
  // GET_TEXT: "GetText",
  // GET_VALUE: "GetValue",
  // GET_ATTRIBUTE: "GetAttribute",
  // SELECT_DROPDOWN: "SelectDropdown",
  // RANDOM: "Random",
  // FILE_UPLOAD: "FileUpload",
  // HTTP: "Http",
  // WRITE_FILE: "WriteFile",
  // SET_VARIABLE: "SetVariable",
  // COOKIES: "Cookies",
} as const
export type ActionType = (typeof ACTION)[keyof typeof ACTION]

export const SELECTOR_TYPE = {
  CSS: 'css',
  XPATH: 'xpath',
} as const
export type SelectorType = (typeof SELECTOR_TYPE)[keyof typeof SELECTOR_TYPE]
