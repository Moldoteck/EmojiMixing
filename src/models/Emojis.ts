import { prop, getModelForClass } from '@typegoose/typegoose'

export class Emoji {
  @prop({ required: true })
  base_url: string
  @prop({ required: true })
  tg_url: string
}

// Get Emoji model
const EmojiModel = getModelForClass(Emoji, {
  schemaOptions: { timestamps: true },
})

// Get emoji
export async function findEmoji(emoji_base: string): Promise<Emoji> {
  return await EmojiModel.findOne({ base_url: emoji_base })
}

// Create emoji
export async function createEmoji(emoji_base: string, emoji_tg: string) {
  let emoji = undefined
  try {
    emoji = await new EmojiModel({ base_url: emoji_base, tg_url: emoji_tg }).save()
  } catch (err) {
    console.log(err)
    emoji = await EmojiModel.findOne({ emoji_base })
  }
  return emoji
}

export async function deleteEmojis() {
  await EmojiModel.collection.drop();
  // await EmojiModel.deleteMany({})
}