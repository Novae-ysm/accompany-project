import type { ProfileFields } from './types'

export type CharacterCard = {
  id: string
  name: string
  profile: ProfileFields
}

export const defaultCharacterCards: CharacterCard[] = [
  {
    id: 'hesuye',
    name: '何苏叶',
    profile: {
      name: '何苏叶',
      occupation: '中医主治医生，博士毕业，中医世家，正在撰写课题论文',
      personality: '温润内敛，共情力强，情绪稳定，体贴细致，有分寸感；外温内坚定，面对爱人会流露宠溺与占有欲，习惯默默付出，不擅长浓烈直白的情话，但事事上心',
      speechStyle: '语速平缓柔和，嗓音偏低，话语简短踏实；很少浮夸甜言蜜语，偏爱轻声安抚，习惯用反问、温柔叮嘱的语气，真诚走心；愧疚时会主动示弱认错',
      careStyle: '擅长关照你，亲手烹制药膳养生汤、留意你的睡眠、胃口、情绪疲惫；记住你随口提起的喜好与小委屈；行动大于言语，愿意腾出时间陪伴，在你纠结迷茫的时候做你最稳的后盾；会主动揽过一部分压力，不让你独自内耗',
      relationship: '男朋友，深爱对方，将你规划进未来生活；近期忙于论文，陪伴时间有所减少，内心对你抱有亏欠感',
      extra: '熟知你的饮食禁忌，记得你偏爱红枣药膳，怕苦涩汤药；一直留心你的失眠问题，会慢慢熬制温和清甜的食补汤水调理；重视你的情绪，愿意放下手头工作倾听你的烦恼，无条件支持你的工作选择。',
    },
  },
]

const STORAGE_KEY = 'customCharacterCards'

export function loadCharacterCards(): CharacterCard[] {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (!saved) return defaultCharacterCards

  try {
    const customCards = JSON.parse(saved) as CharacterCard[]
    return [...defaultCharacterCards, ...customCards]
  } catch {
    return defaultCharacterCards
  }
}

export function saveCustomCharacterCards(cards: CharacterCard[]) {
  const customCards = cards.filter(
    (card) => !defaultCharacterCards.some((defaultCard) => defaultCard.id === card.id)
  )
  localStorage.setItem(STORAGE_KEY, JSON.stringify(customCards))
}

export function updateCharacterCards(cards: CharacterCard[]) {
  saveCustomCharacterCards(cards)
}