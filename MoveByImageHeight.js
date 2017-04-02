const Promise = require('bluebird')
const path = require('path')
const glob = Promise.promisify(require('glob'))
const _ = require('lodash')
const sizeOf = Promise.promisify(require('image-size'))
const MoveMethod = require('./MoveMethod')
const config = require('./config')

class MoveByImageHeight extends MoveMethod {
    constructor() {
        super()
    }

    async isApplicable(directory) {
        const files = await glob(path.normalize(`${directory}${path.sep}*.png`))
        return files.length > 0
    }

    async prepare(directory, logger) {
        let files = await glob(path.normalize(`${directory}${path.sep}*.png`))

        files = await Promise.all(files.map(async(file) => {
            const dimensions = await sizeOf(path.normalize(file))
            return {
                file: file,
                dimensions: dimensions
            }
        }))

        // sort by the last number in file name
        files = _.sortBy(files, (item) => {
            return item.dimensions.height
        })

        // files should not exceed the number of qualifiers
        files.slice(0, config.qualifiers.length)

        // assign qualifier
        return files.map((file, i) => {
            return {
                file: path.normalize(file.file),
                qualifier: config.qualifiers[i]
            }
        })
    }
}

module.exports = MoveByImageHeight