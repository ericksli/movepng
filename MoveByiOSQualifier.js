const Promise = require('bluebird')
const path = require('path')
const glob = Promise.promisify(require('glob'))
const _ = require('lodash')
const MoveMethod = require('./MoveMethod')
const config = require('./config')

class MoveByiOSQualifier extends MoveMethod {
    constructor() {
        super()
    }

    async isApplicable(directory) {
        const files = await glob(path.normalize(`${directory}${path.sep}*?(@*x).png`))
        return files.length > 0
    }

    async prepare(directory, logger) {
        let files = await glob(path.normalize(`${directory}${path.sep}*?(@*x).png`))

        // sort by the last number in file name
        files = _.sortBy(files, (item) => {
           
            let result = item.match(/@((\d|\.)+)x\.png$/)
            if (result === null) {
                return 1
            } else {
                return ~~item.match(/@((\d|\.)+)x\.png$/)[1]
            }
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

module.exports = MoveByiOSQualifier