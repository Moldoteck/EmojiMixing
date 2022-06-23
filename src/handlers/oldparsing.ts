// for (let element of knownSupportedDates) {
//     let tempFirstDeca = [firstdeca, element]
//     let tempSecondDeca = [seconddeca, element]

//     emojiMix = createURL(tempFirstDeca, tempSecondDeca)
//     emojiDB = await findEmoji(emojiMix)
//     if (emojiDB) {
//       found = true
//       break
//     }
//     emojiMix = createURL(tempSecondDeca, tempFirstDeca)
//     emojiDB = await findEmoji(emojiMix)
//     if (emojiDB) {
//       found = true
//       break
//     }
//   }

//   if (!found) {
//     for (let element of knownSupportedDates) {
//       let tempFirstDeca = [firstdeca, element]
//       let tempSecondDeca = [seconddeca, element]

//       emojiMix = createURL(tempFirstDeca, tempSecondDeca)

//       //request with classic combination
//       let res = await needle('head', emojiMix)
//       if (res.statusCode != 404) {
//         found = true
//         break
//       } else {
//         emojiMix = createURL(tempSecondDeca, tempFirstDeca)
//         res = await needle('head', emojiMix)
//         if (res.statusCode != 404) {
//           found = true
//           break
//         }
//       }
//     }
//   }

//   if (found) {
//     if (!emojiDB) {
//       //if not in db, create entry
//       let msg = await customSendDocument(emojiMix, ctx)
//       console.log('creating')
//       if (msg.hasOwnProperty('sticker')) {
//         emojiDB = await createEmoji(emojiMix, msg['sticker'].file_id)

//         if (emojiDB) {
//           return ctx.answerInlineQuery([
//             {
//               id: '0',
//               type: 'sticker',
//               sticker_file_id: emojiDB.tg_url,
//             },
//           ])
//         }
//       }
//     } else {
//       return ctx.answerInlineQuery([
//         {
//           id: '0',
//           type: 'sticker',
//           sticker_file_id: emojiDB.tg_url,
//         },
//       ])
//     }
//   } else {
//     //if fail, respond failed
//     return ctx.answerInlineQuery([
//       {
//         id: '0',
//         type: 'article',
//         title: 'No luck',
//         description: 'No mixing found',
//         input_message_content: {
//           message_text: '.',
//         },
//       },
//     ])
//   }