import bcrypt from 'bcrypt'

class PasswordHash {
  saltRounds = 10

  hash = async password => bcrypt.hash(password, this.saltRounds)

  compare = async (password, hash) => bcrypt.compare(password, hash)
}

export default new PasswordHash()
