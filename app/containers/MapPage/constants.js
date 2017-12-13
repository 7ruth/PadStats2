/*
 * mapPageConstants
 * Each action has a corresponding type, which the reducer knows and picks up on.
 * To avoid weird typos between the reducer and the actions, we save them as
 * constants here. We prefix them with 'yourproject/YourComponent' so we avoid
 * reducers accidentally picking up actions they shouldn't.
 *
 * Follow this format:
 * export const YOUR_ACTION_CONSTANT = 'yourproject/YourContainer/YOUR_ACTION_CONSTANT';
 */

export const GOOGLE_API_LOADED = 'boilerplate/MapPage/GOOGLE_API_LOADED';
export const CHANGE_CATEGORIES = 'boilerplate/MapPage/CHANGE_CATEGORIES';
export const UPDATE_SEARCH_RESULTS = 'boilerplate/MapPage/UPDATE_SEARCH_RESULTS';
export const UPDATE_DIRECTION_RESULTS = 'boilerplate/MapPage/UPDATE_DIRECTION_RESULTS';
