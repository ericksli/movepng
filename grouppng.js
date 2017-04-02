const Promise = require('bluebird')
const fs = Promise.promisifyAll(require('fs-extra'))
const path = require('path')
const glob = Promise.promisify(require('glob'))
const _ = require('lodash')
const prog = require('caporal')


const grouppng = async(args, options, logger) => {
    const paths = await glob(path.normalize(`${args.directory}${path.sep}*.png`))
    const regex = new RegExp(args.regex)
    let files = paths.map((p) => {
        return path.basename(p, '.png').replace(regex, '')
    })
    const groups = _.uniq(files)
    for (const group of groups) {
        logger.info(`Group ${group}`)
        const filesInGroup = paths.filter((p) => {
            const name = path.basename(p, '.png').replace(regex, '')
            return name === group
        })
        for (const src of filesInGroup) {
            const dest = `${args.directory}${path.sep}${group}${path.sep}${path.basename(src)}`
            await fs.moveAsync(path.normalize(src), path.normalize(dest))
            logger.info(`  - ${path.basename(src)}`)
        }
    }
}

prog
    .version('1.0.0')
    .description('Group PNG files')
    .argument('<directory>', 'Directory that contains the PNG files')
    .argument('<regex>', 'RegExp for the suffix to be ignored (do not need to include .png)')
    .action((args, options, logger) => {
        try {
            grouppng(args, options, logger)
        } catch (e) {
            logger.error(e)
        }
    });
prog.parse(process.argv);
