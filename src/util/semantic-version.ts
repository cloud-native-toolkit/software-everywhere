
export interface SemanticVersion {
  label: string
  major: number
  minor: number
  patch: number
}

export const semanticVersionFromString = (ver: string): SemanticVersion => {
  const [major, minor, patch] = ver.replace('v', '').split('.');

  return {
    label: ver,
    major: parseInt(major),
    minor: parseInt(minor),
    patch: parseInt(patch)
  }
}

export const semanticVersionDescending = (a: SemanticVersion, b: SemanticVersion): number => {
  if (b.major - a.major !== 0) {
    return b.major - a.major
  } else if (b.minor - a.minor !== 0) {
    return b.minor - a.minor
  } else {
    return b.patch - a.patch
  }
}

export const semanticVersionAscending = (a: SemanticVersion, b: SemanticVersion): number => {
  return semanticVersionDescending(a, b) * -1
}
