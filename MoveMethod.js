const Promise = require('bluebird')
const fs = Promise.promisifyAll(require('fs-extra'))
const path = require('path')

class MoveMethod {
    constructor() {
    }

    async isApplicable(directory) {
        // to be overridden by subclass
    }

    async prepare(directory, logger) {
        // to be overridden by subclass
    }

    async move(directory, mapping, targetName, resDirectory, logger) {
        let outputDirectory
        if (resDirectory !== undefined) {
            outputDirectory = path.normalize(resDirectory)
        } else {
            outputDirectory = path.normalize(directory)
        }

        for (const data of mapping) {
            try {
                await fs.copyAsync(data.file,
                    path.normalize(`${outputDirectory}${path.sep}drawable-${data.qualifier}${path.sep}${targetName}.png`))
                if (resDirectory === undefined) {
                    logger.info(`Copied ${path.basename(data.file)} [${data.qualifier}]`)
                } else {
                    logger.info(`Copied ${path.basename(data.file)} to res directory [${data.qualifier}]`)
                }
            } catch (e) {
                logger.error(e)
            }
        }
    }
}

module.exports = MoveMethod