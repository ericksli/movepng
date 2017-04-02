const Promise = require('bluebird')
const fs = Promise.promisifyAll(require('fs-extra'))
const path = require('path')
const prog = require('caporal')
const MoveByQualifier = require('./MoveByQualifier')
const MoveByNumberInName = require('./MoveByNumberInName')
const MoveByImageHeight = require('./MoveByImageHeight')

const movepng = async(args, options, logger) => {
    try {
        await fs.ensureDirAsync(path.normalize(args.directory))
    } catch (e) {
        logger.error('Invalid directory')
        process.exit(1)
    }
    if (args.resDirectory !== undefined) {
        try {
            await fs.ensureDirAsync(path.normalize(args.resDirectory))
        } catch (e) {
            logger.error('Invalid writeTo')
            process.exit(1)
        }
    }

    const moveByQualifier = new MoveByQualifier()
    const moveByNumberInName = new MoveByNumberInName()
    const moveByImageHeight = new MoveByImageHeight()

    let moveMethod;
    if (await moveByQualifier.isApplicable(args.directory)) {
        moveMethod = moveByQualifier
        logger.info('Using move by qualifier strategy')
    } else if (await moveByNumberInName.isApplicable(args.directory)) {
        moveMethod = moveByNumberInName
        logger.info('Using move by number in name strategy')
    } else {
        moveMethod = moveByImageHeight
        logger.info('Using move by image height strategy')
    }

    const mapping = await moveMethod.prepare(args.directory, logger)
    try {
        await moveMethod.move(args.directory, mapping, args.targetName, args.resDirectory, logger)
    } catch (e) {
        logger.error(e)
    }
}

prog
    .version('1.0.0')
    .description('A simple script to copy PNG files according to its Android density qualifier from the file name.')
    .argument('<directory>', 'Directory that contains the PNG files')
    .argument('<targetName>', 'Output PNG file name (without .png)')
    .argument('[resDirectory]', 'Write file to the path of Android res directory')
    .action((args, options, logger) => {
        try {
            movepng(args, options, logger)
        } catch (e) {
            logger.error(e)
        }
    });
prog.parse(process.argv);

