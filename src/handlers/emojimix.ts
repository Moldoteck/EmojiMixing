import { countUsers, createEmoji, deleteEmojis, findEmoji } from '@/models'
import { Context } from 'telegraf'
import { cacheObject } from './cache'
import { emojidata } from './emojiData'
import { knownSupportedDates } from './emojis'
const needle = require('needle')

let API = 'https://www.gstatic.com/android/keyboard/emojikitchen/'

// let regex = new RegExp(
//   '(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32-\ude3a]|[\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])'
// )

let mp = new Map<string, Array<number>>([
  ['[10083]', [10083, 65039]],
  ['[9729]', [9729, 65039]],
  ['[9829]', [9829, 65039]],
  ['[9786]', [9786, 65039]],
  ['[9785]', [9785, 65039]],
  ['[128371]', [128371, 65039]],
  ['[128065]', [128065, 65039]],
  ['[127786]', [127786, 65039]],
  ['[128375]', [128375, 65039]],
  ['[127798]', [127798, 65039]],
  ['[127869]', [127869, 65039]],
  ['[128558]', [128558, 8205, 128168]],
  ['[128566]', [128566, 8205, 127787, 65039]],
  ['[10084]', [10084, 65039, 8205, 129657]],
  ['[127788]', [127788, 65039]],
  ['[127958]', [127958, 65039]],
  ['[127785]', [127785, 65039]],
  ['[127783]', [127783, 65039]],
  ['[9732]', [9732, 65039]],
  ['[127963]', [127963, 65039]],
  ['[127967]', [127967, 65039]],
  ['[127957]', [127957, 65039]],
  ['[127965]', [127965, 65039]],
  ['[128736]', [128736, 65039]],
  ['[128465]', [128465, 65039]],
  ['[9888]', [9888, 65039]],
  ['[9824]', [9824, 65039]],
  ['[10084]', [10084, 65039]],
  ['[127989]', [127989, 65039]],
  ['[127950]', [127950, 65039]],
  ['[9992]', [9992, 65039]],
  ['[127894]', [127894, 65039]],
  ['[9976]', [9976, 65039]],
  ['[9823]', [9823, 65039]],
  ['[128396]', [128396, 65039]],
  ['[128397]', [128397, 65039]],
  ['[127897]', [127897, 65039]],
  ['[127902]', [127902, 65039]],
  ['[127903]', [127903, 65039]],
  ['[9742]', [9742, 65039]],
  ['[9878]', [9878, 65039]],
  ['[9730]', [9730, 65039]],
  ['[9939]', [9939, 65039]],
  ['[128394]', [128394, 65039]],
  ['[10002]', [10002, 65039]],
  ['[9999]', [9999, 65039]],
  ['[128451]', [128451, 65039]],
  ['[128477]', [128477, 65039]],
  ['[8265]', [8265, 65039]],
  ['[9851]', [9851, 65039]],
  ['[9774]', [9774, 65039]],
  ['[9775]', [9775, 65039]],
  ['[9854]', [9854, 65039]],
  ['[10006]', [10006, 65039]],
  ['[12336]', [12336, 65039]],
  ['[169]', [169, 65039]],
  ['[174]', [174, 65039]],
  ['[8482]', [8482, 65039]],
  ['[128495]', [128495, 65039]],
  ['[128330]', [128330, 65039]],
  ['[127895]', [127895, 65039]],
])

var emojiRegex = require('emoji-regex')

const regex = emojiRegex()

const createURL = (emoji1, emoji2) => {
  let u1 = emoji1[0].map((c) => 'u' + c.toString(16)).join('-')
  let u2 = emoji2[0].map((c) => 'u' + c.toString(16)).join('-')
  let at = `${API}${emoji1[1]}/${u1}/${u1}_${u2}.png`
  // console.log(at)
  return at
}
function processDeca(decaArray) {
  let str = JSON.stringify(decaArray)
  if (mp.has(str)) {
    decaArray = mp.get(str)
  }

  return decaArray
}

export function delay(scnd: number) {
  return new Promise((resolve) => setTimeout(resolve, scnd * 1000))
}

export async function customSendDocument(emojiMix: string, context) {
  let result_msg = undefined
  try {
    result_msg = await context.telegram.sendDocument(
      process.env.CHATID,
      {
        url: emojiMix,
        filename: 'sticker-gen.webp',
      },
      { disable_notification: true }
    )
  } catch (err) {
    let msg = '' + err.message
    if (msg.includes('retry after')) {
      let st = msg.indexOf('retry after') + 'retry after '.length
      msg = msg.substring(st).split(' ')[0]
      await delay(parseInt(msg))
      result_msg = await customSendDocument(emojiMix, context)
    } else {
      console.log('Error', err.stack)
      console.log('Error', err.name)
      console.log('Error', err.message)
    }
  }
  return result_msg
}

export async function emojiMix(ctx: Context) {
  if ('match' in ctx) {
    let allMatches = [...(ctx['match'].input as string).matchAll(regex)]

    if (allMatches.length == 1) {
      let firstChar = allMatches[0]

      let firstdeca = [...firstChar].map((c) => c.codePointAt(0))
      firstdeca = processDeca(firstdeca)

      let firstdecastr = firstdeca.map((c) => c.toString(16)).join('-')
      if (cacheObject[firstdecastr]) {
        let pairs = Object.keys(cacheObject[firstdecastr])
        pairs = pairs.map((p) =>
          p
            .split('-')
            .map((c) => String.fromCodePoint(parseInt(c, 16)))
            .join('')
        )
        return ctx.answerInlineQuery([
          {
            id: '0',
            type: 'article',
            title: 'Options(tap for all)',
            description:
              'For ' + String.fromCodePoint(...firstdeca) + ': ' + pairs.join(),
            input_message_content: {
              message_text:
                'For ' +
                String.fromCodePoint(...firstdeca) +
                ': ' +
                pairs.join(' '),
            },
          },
        ])
      }
    }

    if (allMatches.length >= 2) {
      let firstChar = allMatches[0]
      let secondChar = allMatches[1]

      let firstdeca = [...firstChar].map((c) => c.codePointAt(0))
      let seconddeca = [...secondChar].map((c) => c.codePointAt(0))

      firstdeca = processDeca(firstdeca)
      seconddeca = processDeca(seconddeca)

      let firstdecastr = firstdeca.map((c) => c.toString(16)).join('-')
      let seconddecastr = seconddeca.map((c) => c.toString(16)).join('-')
      if (
        (cacheObject[firstdecastr] &&
          cacheObject[firstdecastr][seconddecastr]) ||
        (cacheObject[seconddecastr] && cacheObject[seconddecastr][firstdecastr])
      ) {
        let tempFirstDeca = []
        let tempSecondDeca = []
        if (
          cacheObject[firstdecastr] &&
          cacheObject[firstdecastr][seconddecastr]
        ) {
          tempFirstDeca = [firstdeca, cacheObject[firstdecastr][seconddecastr]]
          tempSecondDeca = [
            seconddeca,
            cacheObject[firstdecastr][seconddecastr],
          ]
        } else {
          tempFirstDeca = [seconddeca, cacheObject[seconddecastr][firstdecastr]]
          tempSecondDeca = [firstdeca, cacheObject[seconddecastr][firstdecastr]]
        }

        let emojiMix = createURL(tempFirstDeca, tempSecondDeca)
        let emojiDB = await findEmoji(emojiMix)
        let found = emojiDB ? true : false
        if (!found) {
          let res = await needle('head', emojiMix)
          if (res.statusCode != 404) {
            let msg = await customSendDocument(emojiMix, ctx)
            console.log('creating')
            if (msg.hasOwnProperty('sticker')) {
              emojiDB = await createEmoji(emojiMix, msg['sticker'].file_id)
              found = true
            }
          }
        }
        if (found) {
          return ctx.answerInlineQuery([
            {
              id: '0',
              type: 'sticker',
              sticker_file_id: emojiDB.tg_url,
            },
          ])
        } else {
          return ctx.answerInlineQuery([
            {
              id: '0',
              type: 'article',
              title: 'No luck',
              description: 'No mixing found',
              input_message_content: {
                message_text: '.',
              },
            },
          ])
        }
      } else {
        return ctx.answerInlineQuery([
          {
            id: '0',
            type: 'article',
            title: 'No luck',
            description: 'No mixing found',
            input_message_content: {
              message_text: '.',
            },
          },
        ])
      }
    }
  }
}

export async function countBotUsers(ctx: Context) {
  if (ctx.from.id == parseInt(process.env.ADMINID)) {
    let users = await countUsers()
    ctx.reply('Registered users ' + users).catch((e) => {})
  }
}
