import AsyncStorage from '@react-native-async-storage/async-storage';

import { UNFINISHED_TASKS, FINISHED_TASKS } from '../constants/app-constants';

export async function importLists() {
  try {
    const lists = await AsyncStorage.multiGet([UNFINISHED_TASKS, FINISHED_TASKS]);
    return lists?.map(req => JSON.parse(req)).forEach(console.log);
  }
  catch (e) {
    console.error(e);
  }
}

export async function exportLists(unfinishedTasks, finishedTasks) {
  try {
    const multiSet = [
      [UNFINISHED_TASKS, JSON.stringify(unfinishedTasks)],
      [FINISHED_TASKS, JSON.stringify(finishedTasks)],
    ];

    await AsyncStorage.multiSet(multiSet);
  }
  catch (e) {
    console.error(e);
  }
}