const Promise = require('bluebird')
const path = require('path')
const glob = Promise.promisify(require('glob'))
const _ = require('lodash')
const MoveMethod = require('./MoveMethod')
const config = require('./config')

class MoveByNumberInName extends MoveMethod {
    constructor() {
        super()
    }

    async isApplicable(directory) {
        const files = await glob(path.normalize(`${directory}${path.sep}*+([0-9]).png`))
        return files.length > 0
    }

    async prepare(directory, logger) {
        let files = await glob(path.normalize(`${directory}${path.sep}*+([0-9]).png`))

        // sort by the last number in file name
        files = _.sortBy(files, (item) => {
            return ~~item.match(/(\d+)\.png$/)[1]
        })

        // files should not exceed the number of qualifiers
        files.slice(0, config.qualifiers.length)

        // assign qualifier
        return files.map((file, i) => {
            return {
                file: path.normalize(file),
                qualifier: config.qualifiers[i]
            }
        })
    }
}

module.exports = MoveByNumberInName