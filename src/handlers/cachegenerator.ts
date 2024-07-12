//init var with new data 
let emojidata = {}

//run node src/handlers/cachegenerator.ts
//copy generated files
const fs = require('fs')
generateCacheFromEmojiData()
// availableDates()
function generateCacheFromEmojiData(){
    let cache = {}
    let revCache = {}
    let keys = emojidata['data']
    let keysArray = Object.keys(keys);
    for (let i=0;i<keysArray.length;i++){
        console.log('processing',i,'of',keysArray.length)
        let obj = keys[keysArray[i]]['combinations']

        let contentArray = Object.keys(obj);
        for (let j=0;j<contentArray.length;j++){
          let content = obj[contentArray[j]][0]
          let leftEmoji = content['leftEmojiCodepoint']
          let rightEmoji = content['rightEmojiCodepoint']
          let date = content['date']
          if(!cache.hasOwnProperty(leftEmoji)){
            cache[leftEmoji] = {}
          }
          cache[leftEmoji][rightEmoji]=date

          if(!revCache.hasOwnProperty(rightEmoji)){
            revCache[rightEmoji] = {}
          }
          revCache[rightEmoji][leftEmoji]=date
        }
    }
    console.log(cache)
    fs.writeFileSync('cache.json', JSON.stringify(cache, null, 2))
    fs.writeFileSync('revCache.json', JSON.stringify(revCache, null, 2))
}
function availableDates(){
    // let dates = new Set()
    // //init var with set type

    // let revCache = {}
    // let keys = Object.keys(emojidata);
    // for (let i=0;i<keys.length;i++){
    //     console.log('processing',i,'of',keys.length)
    //     let key = keys[i]
    //     let contentArray = emojidata[key]
    //     for (let content of contentArray){
    //       let date = content['date']
    //       dates.add(date)
    //     }
    // }
    // console.log(`${[...dates].join(' ')}`)
}