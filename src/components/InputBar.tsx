import { getNextTheme, type ThemeId } from '../themes'
import type { Language } from '../i18n'

type Props = {
  input: string
  sending: boolean
  onChange: (value: string) => void
  onSend: () => void
  onOpenProfile: () => void
  onOpenHistory: () => void
  onOpenSettings: () => void
  theme: ThemeId
  onChangeTheme: (theme: ThemeId) => void
  language: Language
  onToggleLanguage: () => void
  t: Record<string, string>
  listening: boolean
  onVoiceInput: () => void
}

export default function InputBar({
  input,
  sending,
  onChange,
  onSend,
  onOpenProfile,
  onOpenHistory,
  onOpenSettings,
  theme,
  onChangeTheme,
  language,
  onToggleLanguage,
  t,
  listening,
  onVoiceInput,
}: Props) {
  return (
    <div className="input-bar">
      <button
        type="button"
        className="profile-button"
        onClick={onOpenProfile}
        title={t.profile}
      >
        {t.profile}
      </button>

      <button
        type="button"
        className="profile-button"
        onClick={() => onChangeTheme(getNextTheme(theme))}
        title={t.theme}
      >
        {t.theme}
      </button>

      <button
        type="button"
        className="profile-button"
        onClick={onToggleLanguage}
        title={t.language}
      >
        {language === 'zh' ? 'EN' : '中文'}
      </button>

      <button
        type="button"
        className="profile-button"
        onClick={onOpenHistory}
        title={t.history}
      >
        {t.history}
      </button>

      <button
        type="button"
        className="profile-button"
        onClick={onOpenSettings}
        title={t.settings}
      >
        {t.settings}
      </button>

      <div className="voice-input-wrapper">
        <input
          type="text"
          placeholder={t.inputPlaceholder}
          value={input}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') onSend()
          }}
        />
        <button
          type="button"
          className="voice-input-button"
          onClick={onVoiceInput}
          title={t.voiceInput}
        >
          {listening ? (
            <span className="voice-listening-text">{t.listening}</span>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
              <line x1="12" y1="19" x2="12" y2="23"></line>
              <line x1="8" y1="23" x2="16" y2="23"></line>
            </svg>
          )}
        </button>
      </div>

      <button type="button" onClick={onSend} disabled={sending}>
        {sending ? t.sending : t.send}
      </button>
    </div>
  )
}