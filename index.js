const CronJob = require('cron').CronJob;
const fetch = require('node-fetch')

const a = {
  a: ''
}

const func = async ()=>{
  const rst = await fetch('https://acs-garena.leagueoflegends.com/v1/stats/player_history/TW/259680759?endIndex=1').then(res=>res.json())
  if(rst.games.games[0].gameId!==a.a){
    const game = rst.games.games[0]
    const champId = game.participants[0].championId
    const win = game.participants[0].stats.win

    console.log(champId)

    const champInfo = await fetch('https://ddragon.leagueoflegends.com/cdn/10.20.1/data/zh_TW/champion.json').then(res=>res.json())
    for(const champ in champInfo.data){
      if(champInfo.data[champ].key==champId){
        const champName = champInfo.data[champ].name
        if(win){
          console.log(champName,'win')
          await fetch('https://discordapp.com/api/webhooks/760873228200574977/w60qycQDJ9JltkjW1RH5-bgA0iINz_vDPyZkby9xX7QYXggdNt6lyf7GCZa9hguveiKU',{
            method:'POST',
            headers:{
              'Content-Type': 'application/json'
            },
            body:JSON.stringify({
              content:`wincent用 ${champName} 又贏!  🎉🎉🎊🎊🎊`
            })
          })
        }else{
          console.log(champName,'lose')
          await fetch('https://discordapp.com/api/webhooks/760873228200574977/w60qycQDJ9JltkjW1RH5-bgA0iINz_vDPyZkby9xX7QYXggdNt6lyf7GCZa9hguveiKU',{
            method:'POST',
            headers:{
              'Content-Type': 'application/json'
            },
            body:JSON.stringify({
              content:`wincent用 ${champName} 又輸!  😭😭😭😭😭`
            })
          })
        }
        a.a=game.gameId
        return
      }
    }

  }
  // console.log(rst.games.games[0].gameId)
}
var job = new CronJob('* * * * * *', func, null, true, 'America/Los_Angeles');
job.start();