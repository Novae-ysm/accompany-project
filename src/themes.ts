export type ThemeId = 'warm' | 'purple' | 'rose' |'warmpink' | 'mist' 

export const themes: { id: ThemeId; label: string }[] = [
  { id: 'warm', label: 'Warm' },
  { id: 'purple', label: 'Purple' },
  { id: 'rose', label: 'Rose' },
  { id: 'warmpink', label: 'Warm Pink' },
  { id: 'mist', label: 'mist' },
]

export function getNextTheme(current: ThemeId): ThemeId {
  const index = themes.findIndex((theme) => theme.id === current)
  return themes[(index + 1) % themes.length].id
}