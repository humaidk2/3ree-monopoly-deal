import Member from '../models/Member'
import thinky from '../thinky'

const r = thinky.r

export default class MemberRepository {
  static table = Member.getTableName()

  static watchForChanges (changeHandler) {
    Member
      .changes()
      .then(feed => {
        feed.each((error, doc) => {
          if (error) {
            console.log(error)
            process.exit(1)
          }

          const change = {
            deleted: doc.isSaved() === false,
            created: doc.getOldValue() === null
          }

          change.updated = !change.deleted && !change.created
          change.old_val = doc.getOldValue()
          change.new_val = doc

          changeHandler(change)
        })
      })
  }

  getAll (page = 0, limit = 10) {
    return Member
      .orderBy(r.desc('createdAt'))
      .skip(page * limit)
      .limit(limit)
      .run()
  }

  find (id) {
    return Member.get(id).run()
  }

  getCount () {
    return Member.count().run()
  }

  insert (payload) {
    const member = new Member(payload)

    return member.save()
  }

  update (id, payload) {
    return Member.get(id).update(payload).execute()
  }

  delete (id) {
    return Member
      .get(id)
      .delete()
      .run()
  }

  joinGame (gameId, username) {
    const placedCards = { bank: [], properties: [] }

    return Member
      .filter({ gameId, username })
      .run()
      .then(result => {
        if (result.length) {
          throw new Error('Member already exists')
        }
        return this.insert({ gameId, username, placedCards })
      })
  }

  leaveGame (gameId, username) {
  }

  findByGameIdAndUsername (gameId, username) {
    return Member
      .filter({ gameId, username })
      .getJoin({ game: true })
      .run()
      .then(result => {
        if (!result.length) {
          throw new Error(`No member ${username} found for game: ${gameId}`)
        }
        const [member] = result
        return member
      })
  }
}