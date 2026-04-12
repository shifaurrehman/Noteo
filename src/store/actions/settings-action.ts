import { loadSettingsAction, updateSettings, setTheme } from "../slices/settingsSlice";

export const LOAD_SETTINGS = loadSettingsAction
export const UPDATE_SETTINGS = updateSettings
export const SET_THEME = setTheme

export const LOAD_SETTINGS_API = "LOAD_SETTINGS_API"
export const UPDATE_SETTINGS_API = "UPDATE_SETTINGS_API"

export const SETTINGS_API_MAP: Record<string, string> = {
    [LOAD_SETTINGS.type]: LOAD_SETTINGS_API,
    [UPDATE_SETTINGS.type]: UPDATE_SETTINGS_API,
    [SET_THEME.type]: UPDATE_SETTINGS_API
}