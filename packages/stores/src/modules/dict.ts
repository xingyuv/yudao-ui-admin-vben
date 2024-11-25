import { acceptHMRUpdate, defineStore } from 'pinia';

export interface DictItem {
  colorType?: string;
  cssClass?: string;
  label: string;
  value: string;
}

export type Dict = Record<string, DictItem[]>;

interface DictState {
  dictCache: Dict;
}

export const useDictStore = defineStore('dict', {
  actions: {
    getDictData(dictType: string, value?: string) {
      const dict = this.dictCache[dictType];
      if (!dict) {
        return undefined;
      }
      return value ? dict.find((d) => d.value === value) : dict;
    },
    setDictCache(dicts: Dict) {
      this.dictCache = dicts;
    },
    setDictCacheByApi(
      api: (params: Record<string, any>) => Promise<Record<string, any>[]>,
      params: Record<string, any>,
      labelField: string = 'label',
      valueField: string = 'value',
    ) {
      api(params).then((dicts) => {
        const dictCacheData: Dict = {};
        dicts.forEach((dict) => {
          dictCacheData[dict.dictType] = dicts
            .filter((d) => d.dictType === dict.dictType)
            .map((d) => ({
              colorType: d.colorType,
              cssClass: d.cssClass,
              label: d[labelField],
              value: d[valueField],
            }));
        });
        this.setDictCache(dictCacheData);
      });
    },
  },
  persist: {
    // 持久化
    pick: ['dictCache'],
  },
  state: (): DictState => ({
    dictCache: {},
  }),
});

// 解决热更新问题
const hot = import.meta.hot;
if (hot) {
  hot.accept(acceptHMRUpdate(useDictStore, hot));
}
