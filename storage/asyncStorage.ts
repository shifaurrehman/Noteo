import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveData = async (key: string, value: any) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Failed to save data', e);
  }
};

export const getData = async (key: string) => {
  try {
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.error('Failed to fetch data', e);
    return null;
  }
};

export const deleteData = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    console.error('Failed to delete data', e);
  }
};

export const clearStorage = async () => {
  try {
    await AsyncStorage.clear();
    console.log('AsyncStorage cleared!');
  } catch (e) {
    console.error('Error clearing AsyncStorage', e);
  }
};