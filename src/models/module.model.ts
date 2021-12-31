import first from '../util/first';
import {semanticVersionDescending, semanticVersionFromString} from '../util/semantic-version';

export interface ModuleModel {
  displayName?: string
  description?: string
  name: string
  id: string
  cloudProvider?: string
  softwareProvider?: string
  type: string
  group?: string
  versions?: string[]
}

export const moduleUrl = (module: ModuleModel): string => `https://github.com/cloud-native-toolkit/terraform-${module.name}`

export const moduleStatus = (module: ModuleModel): string => {
  const isPending = (versions: string[] = []): boolean => {
    return versions.length === 0 || (versions.length === 1 && versions[0] === 'v0.0.0')
  }
  const isBeta = (versions: string[] = []): boolean => {
    return first(versions.map(semanticVersionFromString).sort(semanticVersionDescending)).filter(ver => ver.major === 0).isPresent()
  }

  if (isPending(module.versions)) {
    return 'pending'
  } else if (isBeta(module.versions)) {
    return 'beta'
  }

  return 'released'
}

export const moduleDisplayName = (module: ModuleModel): string => {
  return module.displayName || module.name
}

export const moduleType = (module: ModuleModel): string => {
  if (/^gitops-.*/.test(module.name)) {
    return 'gitops'
  }

  return module.type
}

export const moduleProvider = (module: ModuleModel): string => {
  return module.cloudProvider || module.softwareProvider || ''
}