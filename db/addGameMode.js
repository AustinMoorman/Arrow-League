const prompt = require('prompt-sync')()

const db = require('./db')

let game = {}
let userID = prompt('UserID? else false.')
  game.name = prompt('Name?')
  game.description = prompt('description?')
  game.scoreableVals = prompt('Scoreable values in [val,val]?')
  game.xVal = prompt('Value of x?')
  game.apr = prompt('Arrows per round?')
  game.rpb = prompt('Rounds per bracket?')
  game.bpg = prompt('Brackets per game?')
  game.maxScore = prompt('Max score?')


  try{
    db.leagueDB.addGameMode(game)
  }catch(e){
      console.log(e)
  }
  