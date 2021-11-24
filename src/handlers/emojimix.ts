import { countUsers, createEmoji, findEmoji } from '@/models';
import { Context } from 'telegraf'
import { emojisCodes } from './emojis'
const needle = require('needle');

let API = 'https://www.gstatic.com/android/keyboard/emojikitchen/'

let regex = new RegExp('(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32-\ude3a]|[\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])')

const createURL = (emoji1, emoji2) => {
  let u1 = emoji1[0].map(c => "u" + c.toString(16)).join("-");
  let u2 = emoji2[0].map(c => "u" + c.toString(16)).join("-");
  return `${API}${emoji1[2]}/${u1}/${u1}_${u2}.png`;
};
function processDeca(decaArray) {
  let str = JSON.stringify(decaArray)
  if (str === JSON.stringify([127869])) {
    decaArray = [127869, 65039]
  }
  if (str === JSON.stringify([129657])) {
    decaArray = [10084, 65039, 8205, 129657]
  }
  if (str === JSON.stringify([128168])) {
    decaArray = [128558, 8205, 128168]
  }
  if (str === JSON.stringify([127787])) {
    decaArray = [128566, 8205, 127787, 65039]
  }

  return decaArray
}
export async function emojiMix(ctx: Context) {
  if ('match' in ctx) {
    // console.log(ctx.match[0].codePointAt(0))
    let withoutspace = ctx.match[0].replace(/\s/g, '');
    let firstChar = withoutspace.match(regex)[0]
    let secondChar = withoutspace.slice(firstChar.length)

    let firstdeca = Array(1).fill(firstChar.codePointAt(0))
    let seconddeca = Array(1).fill(secondChar.codePointAt(0))
    // for (let i = 0; i < 5; i++) {
    //   let deca = firstChar.codePointAt(i)
    //   if (deca) {
    //     firstdeca.push(deca)
    //   } else { break }
    // }

    firstdeca = processDeca(firstdeca)
    seconddeca = processDeca(seconddeca)
    console.log(firstdeca, seconddeca)
    let emojiIndexFirst = emojisCodes.findIndex((element) => JSON.stringify(element[0]) == JSON.stringify(firstdeca))
    let emojiIndexSecond = emojisCodes.findIndex((element) => JSON.stringify(element[0]) == JSON.stringify(seconddeca))

    if (emojiIndexFirst != -1 && emojiIndexSecond != -1) {
      let emojiMix = createURL(emojisCodes[emojiIndexFirst], emojisCodes[emojiIndexSecond])

      let emojiDB = await findEmoji(emojiMix)
      if (emojiDB) {
        return ctx.answerInlineQuery([{
          id: '0',
          type: 'sticker',
          sticker_file_id: emojiDB.tg_url
        }])
      }

      let res = await needle('head', emojiMix)
      if (res.statusCode == 404) {
        emojiMix = createURL(emojisCodes[emojiIndexSecond], emojisCodes[emojiIndexFirst])
        emojiDB = await findEmoji(emojiMix)
        if (emojiDB) {
          return ctx.answerInlineQuery([{
            id: '0',
            type: 'sticker',
            sticker_file_id: emojiDB.tg_url
          }])
        }

        res = await needle('head', emojiMix)
        if (res.statusCode == 404) {
          return
        }
      }

      if (!emojiDB) {
        let msg = await ctx.telegram.sendDocument(process.env.CHATID,
          {
            url: emojiMix,
            filename: 'sticker-gen.webp'
          },
          { disable_notification: true })
        console.log('creating')
        if (msg.hasOwnProperty('sticker')) {
          emojiDB = await createEmoji(emojiMix, msg.sticker.file_id)

          if (emojiDB) {
            return ctx.answerInlineQuery([{
              id: '0',
              type: 'sticker',
              sticker_file_id: emojiDB.tg_url
            }])
          }
        }
      } else {
        return ctx.answerInlineQuery([{
          id: '0',
          type: 'sticker',
          sticker_file_id: emojiDB.tg_url
        }])
      }
    } else {
      return ctx.answerInlineQuery([{
        id: '0',
        type: 'article',
        title: 'No luck',
        description: 'No mixing found',
        input_message_content: {
          message_text: '.'
        }
      }])
    }
  }
}


export async function emojiMixEmpty(ctx: Context) {
  if ('match' in ctx) {
    console.log(ctx.match)
    if (ctx.match.input.length == 0) {
      // console.log('empty')
      // for (let i = 0; i < 3; ++i) {

      //   let emjind1 = Math.floor(Math.random() * emojisCodes.length)
      //   let emjind2 = Math.floor(Math.random() * emojisCodes.length)

      // return ctx.answerInlineQuery([{
      //   id: '0',
      //   type: 'sticker',
      //   sticker_file_id: emojiDB.tg_url
      // }])
      // }
    }
  }
}


export async function countBotUsers(ctx: Context) {
  if (ctx.from.id == parseInt(process.env.ADMINID)) {
    let users = await countUsers()
    ctx.reply('Registered users ' + users).catch(e => { })
  }
}