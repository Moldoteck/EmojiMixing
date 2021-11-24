# Telegram bot for mixing two emojis into a new sticker

Feel free to use/fork/star/sponsor)))

# Installation and local launch

1. Clone this repo: `git clone https://github.com/Moldoteck/EmojiMixing`
2. Launch the [mongo database](https://www.mongodb.com/) locally
3. Create `.env` with the environment variables listed below
4. Run `yarn install` in the root folder
5. Run `yarn develop`

And you should be good to go! Feel free to fork and submit pull requests. Thanks!

# Environment variables

- `TOKEN` — Telegram bot token
- `MONGO`— URL of the mongo database
- `CHATID` — Throw-away private chat ID. It is used by bot to create stickers
- `ADMINID`— Your TG id. Used to count number of users

Also, please, consider looking at `.env.sample`.

# License

MIT — use for any purpose. Would be great if you could leave a note about the original developers. Thanks!

Many thanks to:
https://github.com/UCYT5040/Google-Sticker-Mashup-Research
https://tikolu.net/emojimix/

Inspired from: https://github.com/backmeupplz/telegraf-template