const request = require('request')
const api = require('vk-wrapper')
const black = {
  groups: new RegExp(require('./blackgroups').join('|'), 'i'),
  surnames: new RegExp(require('./blacksurnames').join('|'), 'i')
}

module.exports = (group, count, token) => {
  return new Promise((resolve, reject) => {
    const girl = []
    const method = []

    for (let i = 0, j = Math.ceil(count / 1000); i < j; i++) {
      method.push(`API.groups.getMembers(${JSON.stringify({
        group_id: group,
        offset: 1000 * i,
        count: 1000,
        sort: 'id_desc',
        fields: 'status, sex, can_write_private_message, photo_max_orig, online, connections, relation, city'
      })})`)
    }

    for (let i = 0, j = Math.ceil(method.length / 25); i < j; i++) {
      girl.push(new Promise((resolve, reject) => {
        const girls = []

        api('execute', {
          code: `return [ ${method.slice(i * 25, i * 25 + 25).join(',')} ];`,
          access_token: token
        }).then(body => {
          if (body.error) {
            reject(body.error)
          }

          const items = body.response
            .map(res => res.items)
            .reduce((a, b) => a.concat(b))
            .filter(user => {
              const sex = user.sex
              const city = user.city ? user.city.id : null
              const message = user.can_write_private_message
              const isNormallySurname = !black.surnames.test(user.last_name)

              if (sex === 1 && city === 2 && message && isNormallySurname) {
                return true
              }
            })
            .map(user => {
              return {
                id: user.id,
                name: `${user.first_name} ${user.last_name}`,
                photo: user.photo_max_orig,
                status: user.status,
                online: user.online,
                social: {
                  instagram: user.instagram,
                  skype: user.skype,
                  twitter: user.twitter }
              }
            })

          const methods = items.map(user => {
            return `API.users.getSubscriptions(${JSON.stringify({
              user_id: user.id,
              extended: 1,
              count: 2
            })}).items@.name`
          })

          const girls = []

          for (let i = 0, j = Math.ceil(methods.length / 25); i < j; i++) {
            girls.push(new Promise((resolve, reject) => {
              api('execute', {
                code: `return [ ${methods.slice(i * 25, i * 25 + 25).join(',')} ];`,
                access_token: token
              }).then(body => {
                const users = items.slice(i * 25, i * 25 + 25)
                const subscriptions = body.response.map(groups => groups)

                subscriptions.forEach((subscription, i) => {
                  const groups = { list: [], shit: [] }

                  subscription.forEach(group => {
                    groups.list.push(group)

                    if (black.groups.test(group)) {
                      groups.shit.push(group)
                    }
                  })

                  users[i].extra = { groups: groups, message: {}, className: users[i].online ? 'girls__item--online' : 'girls__item--offline' }
                  users[i].extra.message.body = `Привет, ${users[i].first_name}!`
                  users[i].extra.message.url = `https://api.vk.com/method/messages.send?user_id=${users[i].id}&message=${encodeURIComponent(users[i].extra.message.body)}&access_token=${token}&v=5.60`

                  if (groups.shit.length) {
                    users[i].extra.className += ' girls__item--shit'
                  }
                })

                resolve(users)
              })
            }))
          }

          Promise.all(girls).then(body => resolve(body[0]))
        }).catch(reject)
      }))
    }

    Promise.all(girl).then(body => resolve(body[0]))
  })
}
