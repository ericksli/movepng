const Promise = require('bluebird')
const path = require('path')
const glob = Promise.promisify(require("glob"))
const MoveMethod = require('./MoveMethod')
const config = require('./config')

class MoveByQualifier extends MoveMethod {
    constructor() {
        super()
    }

    async isApplicable(directory) {
        const files = await glob(path.normalize(`${directory}${path.sep}*-*dpi.png`))
        return files.length > 0
    }

    async prepare(directory, logger) {
        const files = await glob(path.normalize(`${directory}${path.sep}*-*dpi.png`))

        const mapping = files.map((file) => {
            const parts = path.basename(file, '.png').split('-')
            const qualifier = parts[parts.length - 1].toLowerCase()
            return {
                file: path.normalize(file),
                qualifier: qualifier
            }
        })

        // ensure qualifier matches with Android standard
        return mapping.filter((fileData) => {
            return config.qualifiers.find((el) => {
                    return el === fileData.qualifier
                }) !== undefined
        })
    }
}

module.exports = MoveByQualifier