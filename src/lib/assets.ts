export type CustomAsset = {
  id: string
  name: string
  dataUrl: string
  createdAt: number
}

const CHARACTER_KEY = 'customCharacterImages'
const BACKGROUND_KEY = 'customBackgroundImages'

function loadAssets(key: string): CustomAsset[] {
  const raw = localStorage.getItem(key)
  if (!raw) return []
  try {
    return JSON.parse(raw) as CustomAsset[]
  } catch {
    return []
  }
}

function saveAssets(key: string, assets: CustomAsset[]) {
  localStorage.setItem(key, JSON.stringify(assets))
}

export function loadCharacterImages(): CustomAsset[] {
  return loadAssets(CHARACTER_KEY)
}

export function loadBackgroundImages(): CustomAsset[] {
  return loadAssets(BACKGROUND_KEY)
}

export function saveCharacterImages(assets: CustomAsset[]) {
  saveAssets(CHARACTER_KEY, assets)
}

export function saveBackgroundImages(assets: CustomAsset[]) {
  saveAssets(BACKGROUND_KEY, assets)
}

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export function createAsset(name: string, dataUrl: string): CustomAsset {
  return {
    id: crypto.randomUUID(),
    name,
    dataUrl,
    createdAt: Date.now(),
  }
}