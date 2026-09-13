import { useRef } from 'react'
import type { CustomAsset } from '../lib/assets'

type Props = {
  side: 'left' | 'right'
  title: string
  assets: CustomAsset[]
  currentImage: string
  onSelect: (asset: CustomAsset) => void
  onUpload: (file: File) => void
  onDelete: (id: string) => void
  accept?: string
}

export default function AssetLibrary({
  side,
  title,
  assets,
  currentImage,
  onSelect,
  onUpload,
  onDelete,
  accept = 'image/png',
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  return (
    <aside className={`asset-library asset-library-${side}`}>
      <div className="asset-library-header">
        <span>{title}</span>
      </div>

      <div className="asset-library-grid">
        {assets.map((asset) => (
          <div
            key={asset.id}
            className={`asset-item ${currentImage === asset.dataUrl ? 'asset-item-active' : ''}`}
          >
            <button
              type="button"
              className="asset-thumb"
              onClick={() => onSelect(asset)}
            >
              <img src={asset.dataUrl} alt={asset.name} />
            </button>
            <button
              type="button"
              className="asset-delete"
              onClick={() => onDelete(asset.id)}
              title="Delete"
            >
              ×
            </button>
          </div>
        ))}

        <button
          type="button"
          className="asset-upload"
          onClick={() => fileInputRef.current?.click()}
        >
          +
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        hidden
        onChange={(event) => {
          const file = event.target.files?.[0]
          if (file) onUpload(file)
          event.target.value = ''
        }}
      />
    </aside>
  )
}