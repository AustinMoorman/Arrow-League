const io = require('socket.io')();
const db = require('./db/db');
const archerDB = require('./db/archer');
let games = {}


io.on('connection', (client) => {

  client.on('Join Room', async game => {
    try {
      if (!game.freeScoring) {
        let scorer = await db.leagueDB.getScorerByScorerCode(game.accessCode)
        client.join(scorer.accessCode)
      } else {
        client.join(game.accessCode)
      }
      const roster = await db.archerDB.getArchers(game.leagueID)
      client.emit('Roster', roster)
      const rounds = await db.roundDB.getRoundsByGameID(game.gameID)
      client.emit('Rounds', rounds)
      const gameMode = await db.leagueDB.getGameModeByGameID(game.gameID)
      client.emit('Game Mode', gameMode)
    } catch (e) {
      console.log(e)
      client.emit('Error', 'DB Error')
    }
  })

  client.on('Add Scorer', async change => {
    if (change.socketID === 'delete') {
      change.socketID = null
    } else {
      change.socketID = client.id
    }
    try {
      await db.archerDB.addScorer(change)
      const roster = await db.archerDB.getArchers(change.leagueID)
      io.to(change.accessCode).emit('Roster', roster)
    } catch (e) {
      console.log(e)
      client.emit('Error', 'DB Error')
    }
  })
  client.on('Add Score', async (scores, accessCode, freeScoring) => {
    try {
      if (freeScoring) {
        let game = await db.leagueDB.getGame(accessCode)
        if (game.status === 'active') {
          await db.roundDB.addRound(scores, game)
          const rounds = await db.roundDB.getRoundsByGameID(game.ID)
          client.emit('Rounds', rounds)
          io.to(game.scoreboardAccessCode).emit('Rounds', rounds)
          
        } else {
          client.emit('Error', 'AccessCode no longer active')
        }
      }else{
        let scorer = await db.leagueDB.getScorerByScorerCode(accessCode)
        let verified = await db.archerDB.verifyFixedScorer(scorer.scorerIndex,scores.archerID)
        let game = await db.leagueDB.getGame(scorer.accessCode)
        if (game.status === 'active' && verified) {
          await db.roundDB.addRound(scores, game)
          const rounds = await db.roundDB.getRoundsByGameID(game.ID)
          client.emit('Rounds', rounds)
          io.to(game.scoreboardAccessCode).emit('Rounds', rounds)
        } else {
          client.emit('Error', 'AccessCode no longer active')
        }

      }

    } catch (e) {
      console.log(e)
      client.emit('Error', 'DB Error')
    }
  })

  client.on('Leave Room', accessCode => {
    client.leave(accessCode)
  })
  client.on('Join Scoreboard', async game => {
    console.log(game)
    client.join(game.scoreboardAccessCode)
    const rounds = await db.roundDB.getRoundsByGameID(game.gameID)
    client.emit('Rounds', rounds)
  })
  client.on('Leave Scoreboard', accessCode => {
    client.leave(`${accessCode}scoreBoard`)
  })

  client.on('disconnect', async () => {
    console.log(client.id)
    await db.archerDB.removeScorerSocket(client.id)
    client.leaveAll()
    console.log('disconnected')
  })

});





const PORT = process.env.PORT || 3010;
io.listen(PORT);
console.log(`Arrow League socket server is up and running on ${PORT}!`)

