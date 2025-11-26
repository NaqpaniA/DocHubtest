  /*
  Copyright (C) 2021 owner Roman Piontik R.Piontik@mail.ru

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

          http://www.apache.org/licenses/LICENSE-2.0

  In any derivative products, you must retain the information of
  owner of the original code and provide clear attribution to the project

          https://dochub.info

  The use of this product or its derivatives for any purpose cannot be a secret.

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.

  Maintainers:
      R.Piontik <r.piontik@mail.ru>

  Contributors:
      R.Piontik <r.piontik@mail.ru>
      Rostislav Kabalin <kabalin2009@yandex.ru>
  */

const path = require('path');
const fs = require('fs');
const YAML = require('yaml');
const parser = require('./parser');

function getSafeOutputPath(filename, baseDir) {
        if (!filename || typeof filename !== 'string') {
                throw new Error('Unsafe file path detected: empty filename');
        }

        const normalizedBaseDir = path.resolve(baseDir || process.cwd());
        if (path.isAbsolute(filename)) {
                throw new Error(`Unsafe file path detected: ${filename}`);
        }

        const normalizedFilename = path.normalize(filename);
        if (normalizedFilename === '..' || normalizedFilename.includes(`..${path.sep}`) || normalizedFilename.startsWith('..')) {
                throw new Error(`Unsafe file path detected: ${filename}`);
        }

        const resolvedPath = path.resolve(normalizedBaseDir, normalizedFilename);
        if (resolvedPath !== normalizedBaseDir && !resolvedPath.startsWith(`${normalizedBaseDir}${path.sep}`)) {
                throw new Error(`Unsafe file path detected: ${filename}`);
        }

        return resolvedPath;
}

function validateParserFiles(files, baseDir) {
        return Object.entries(files || {}).map(([filename, content]) => ({
                filename,
                outputPath: getSafeOutputPath(filename, baseDir),
                content
        }));
}

function writeParserFiles(validatedFiles) {
        for (const file of validatedFiles) {
                fs.mkdirSync(path.dirname(file.outputPath), { recursive: true });
                fs.writeFileSync(file.outputPath, file.content);
        }
}

function importManifest(sourceFileName, options = {}) {
        const baseDir = path.resolve(options.baseDir || process.env.INIT_CWD || process.cwd());
        const parserModule = options.parserModule || parser;
        const resolvedSource = path.isAbsolute(sourceFileName)
                ? sourceFileName
                : path.resolve(baseDir, sourceFileName);

        const yaml = fs.readFileSync(resolvedSource, 'utf8');
        parserModule.parse(YAML.parse(yaml));

        const validatedFiles = validateParserFiles(parserModule.files, baseDir);
        const distanationFileName = path.resolve(baseDir, 'manifest.yaml');
        fs.mkdirSync(path.dirname(distanationFileName), { recursive: true });
        fs.writeFileSync(distanationFileName, YAML.stringify(parserModule.context));
        writeParserFiles(validatedFiles);
}

if (require.main === module) {
        const sourceFileName = process.argv[2];
        const baseDir = process.env.INIT_CWD || process.cwd();

        // eslint-disable-next-line no-console
        console.log('Import file: ', path.resolve(baseDir, sourceFileName));

        try {
                importManifest(sourceFileName, { baseDir });
        } catch (err) {
                // eslint-disable-next-line no-console
                console.error(err);
                process.exitCode = 1;
        }
}

module.exports = {
        getSafeOutputPath,
        importManifest,
        validateParserFiles,
        writeParserFiles
};
