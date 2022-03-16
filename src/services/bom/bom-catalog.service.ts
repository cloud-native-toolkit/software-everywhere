import yaml from 'yaml';
import {
  BomModel,
  BomCatalogModel,
  BomCategoryModel,
  BomGroupModel,
  BomCatalogResultModel,
  BomCatalogFiltersModel
} from '../../models';
import {
  buildBomCatalogList,
  BomCatalogListModel,
  ListValue,
  withBomCategories
} from '../../models/bom-catalog-list.model';
import first from '../../util/first';

let _bom: BomCatalogModel;

interface BomBackendCatalog {
  categories: BomBackendCategory[]
}

interface BomBackendCategory {
  category: string;
  categoryName: string;
  boms: BomModel[]
}

export class BomService {

  async fetchListValues(): Promise<BomCatalogListModel> {
    const result: BomCatalogResultModel = await this.fetch();
    const bomCatalog = result.payload;

    const boms: BomModel[] = bomCatalog.categories.reduce((boms: BomModel[], current: BomCategoryModel) => {
      const b: BomModel[] = current.boms.reduce((result: BomModel[], current: BomGroupModel) => {
        result.push(...current.boms);

        return result;
      }, []);

      boms.push(...b);

      return boms;
    }, [])

    const bomCatalogList: BomCatalogListModel = boms.reduce((result: BomCatalogListModel, current: BomModel) => {
      return result;
    }, buildBomCatalogList())

    return withBomCategories(bomCatalogList, bomCatalog.categories)
  }

  async fetch(bomCatalogFilters?: BomCatalogFiltersModel): Promise<BomCatalogResultModel> {

    if (!_bom) {
      _bom = await this.loadYaml();
    }

    const payload = filterBomCatalog(_bom, bomCatalogFilters)

    return {
      payload,
      filters: bomCatalogFilters || {}
    }
  }

  async loadYaml(): Promise<BomCatalogModel> {
    const result = await fetch('./bom.yaml');
    const text = await result.text();

    try {
      const bomCatalog: BomBackendCatalog = yaml.parse(text);

      return bomBackendCatalogToBomCatalogModel(bomCatalog);
    } catch (error) {
      console.log('Error parsing catalog: ', error)
      throw error
    }
  }

}

const bomBackendCatalogToBomCatalogModel = (bomCatalog: BomBackendCatalog): BomCatalogModel => {
  return {
    categories: bomCatalog.categories.map(bomBackendCategoriesToBomCategoryModel)
  }
}

const bomBackendCategoriesToBomCategoryModel = (bomCategory: BomBackendCategory): BomCategoryModel => {
  const boms = bomCategory.boms || []
  return {
    name: bomCategory.categoryName,
    boms: boms.reduce(bomsToBomGroups, [])
  }
}

const bomsToBomGroups = (boms: BomGroupModel[], current: BomModel): BomGroupModel[] => {
  const bomName = current.cloudProvider;
  const currentBomGroup: BomGroupModel = first(boms.filter(b => b.name === bomName))
    .orElseGet(() => {
      const newCurrentBomGroup = {
        name: bomName,
        boms: []
      };
      boms.push(newCurrentBomGroup);

      return newCurrentBomGroup;
    });

  currentBomGroup.boms.push(current)

  return boms;
}

const isPopulatedFilter = (filters?: BomCatalogFiltersModel): filters is BomCatalogFiltersModel => {
  if (!filters) {
    return false
  }

  // @ts-ignore
  return Object.keys(filters).some(key => !!filters[key])
}

const filterBomCatalog = (bomCatalog: BomCatalogModel, filters?: BomCatalogFiltersModel): BomCatalogModel => {
  console.log('Filtering Bom Catalog: ', filters)
  if (!isPopulatedFilter(filters)) {
    console.log('Bom Filter is empty', filters)
    return bomCatalog
  }

  const result = {
    categories: filterBomCategories(filters, bomCatalog.categories)
  }

  console.log('Filtered result for Bom Categories: ', result)

  return result
}

const filterBomCategories = (filters: BomCatalogFiltersModel, categories: BomCategoryModel[]): BomCategoryModel[] => {

  return categories
    .filter(c => {
      return !filters.category || filters.category === c.name
    })
    .map(c => {
      return {
        name: c.name,
        boms: filterBomGroups(filters, c.boms)
      }
    })
}

const filterBomGroups = (filters: BomCatalogFiltersModel, boms: BomGroupModel[]): BomGroupModel[] => {
  return boms.map(b => {
    return {
      name: b.name,
      boms: filterBoms(filters, b.boms)
    }
  })
}

const filterBoms = (filters: BomCatalogFiltersModel, boms: BomModel[]): BomModel[] => {
  return boms.filter(filterBom(filters))
}

type FilterFunction = (filter: string, bom: BomModel) => boolean

const filterFunctions = {
  cloudProvider: (filter: string, bom: BomModel) => bom.cloudProvider === filter,
}

const filterBom = (filters: BomCatalogFiltersModel) => {
  return (bom: BomModel): boolean => {
    return Object.keys(filters).every(key => {
      // @ts-ignore
      const filter = filters[key]
      // @ts-ignore
      const filterFunction = filterFunctions[key]

      if (!filter || !filterFunction) {
        return true
      }

      // @ts-ignore
      return filterFunction(filter, bom)
    })
  }
}
