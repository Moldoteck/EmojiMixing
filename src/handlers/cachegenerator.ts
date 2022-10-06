//init var with new data 
let emojidata = {}
//run node src/handlers/cachegenerator.ts
//copy generated files
const fs = require('fs')
generateCacheFromEmojiData()
function generateCacheFromEmojiData(){
    let cache = {}
    let revCache = {}
    let keys = Object.keys(emojidata);
    for (let i=0;i<keys.length;i++){
        console.log('processing',i,'of',keys.length)
        let key = keys[i]
        let contentArray = emojidata[key]
        for (let content of contentArray){
          let leftEmoji = content['leftEmoji']
          let rightEmoji = content['rightEmoji']
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
    fs.writeFileSync('cache.json', JSON.stringify(cache, null, 2))
    fs.writeFileSync('revCache.json', JSON.stringify(revCache, null, 2))
}