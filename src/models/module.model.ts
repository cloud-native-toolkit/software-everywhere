import first from '../util/first';
import {SemanticVersion, semanticVersionDescending, semanticVersionFromString} from '../util/semantic-version';

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
  repo?: string
}

export const moduleUrl = (module: ModuleModel): string => `https://${module.id}`

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

export const moduleLatestVersion = (module: ModuleModel): string => {
  const versions: SemanticVersion[] = (module.versions || [])
    .filter(v => v !== 'v0.0.0')
    .map(semanticVersionFromString)
    .sort(semanticVersionDescending)

  return first(versions)
    .map(v => v.label)
    .orElse('')
}
