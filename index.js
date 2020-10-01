const CronJob = require('cron').CronJob;
const fetch = require('node-fetch')
const moment = require('moment')

const a = {
  a: ''
}

const func = async ()=>{
  const rst = await fetch('https://acs-garena.leagueoflegends.com/v1/stats/player_history/TW/259680759?endIndex=1').then(res=>res.json())
  console.log('start checking at ',moment().tz('Asia/Hong_Kong').format())
  if(rst.games.games[0].gameId!==a.a&&Date.now()-rst.games.games[0].gameCreation-rst.games.games[0].gameCreation.gameDuration*1000<7200000){
    const game = rst.games.games[0]
    const champId = game.participants[0].championId
    const win = game.participants[0].stats.win

    const kills = game.participants[0].stats.kills
    const deaths = game.participants[0].stats.deaths
    const assists = game.participants[0].stats.assists


    const kda = (kills+assists)/(deaths==0?1:deaths)

    console.log(champId)

    const champInfo = await fetch('https://ddragon.leagueoflegends.com/cdn/10.20.1/data/zh_TW/champion.json').then(res=>res.json())
    for(const champ in champInfo.data){
      if(champInfo.data[champ].key==champId){
        const champName = champInfo.data[champ].name
        let greeting = ''
        if(win){
          console.log(champName,'win')
          if(kda>3){
            greeting = `KDA 有 ${kda}, CARRY!!!`
          }else{
            greeting = `但KDA 得 ${kda},仲要死${deaths}次, 又比你躺分`
          }
          await fetch('https://discordapp.com/api/webhooks/760873228200574977/w60qycQDJ9JltkjW1RH5-bgA0iINz_vDPyZkby9xX7QYXggdNt6lyf7GCZa9hguveiKU',{
            method:'POST',
            headers:{
              'Content-Type': 'application/json'
            },
            body:JSON.stringify({
              content:`<@338299239501398027>wincent用 ${champName} 又贏!  🎉🎉🎊🎊🎊\n${greeting}`
            })
          })
        }else{
          console.log(champName,'lose')
          if(kda>3){
            greeting = `KDA 有 ${kda}, 又比人雷😭😭😭😭`
          }else{
            greeting = `KDA 仲要得 ${kda}, 又雷鳩D隊友`
          }
          await fetch('https://discordapp.com/api/webhooks/760873228200574977/w60qycQDJ9JltkjW1RH5-bgA0iINz_vDPyZkby9xX7QYXggdNt6lyf7GCZa9hguveiKU',{
            method:'POST',
            headers:{
              'Content-Type': 'application/json'
            },
            body:JSON.stringify({
              content:`<@338299239501398027>wincent用 ${champName} 又輸!  😭😭😭😭😭\n${greeting}`
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