import fs from 'fs';
import os from 'os';
import path from 'path';
import {beforeEach, describe, expect, it} from '@jest/globals';

const {importManifest} = require('../../../src/frontend/tools/meta/import');

const maliciousFixture = path.resolve(__dirname, '../__fixtures__/malicious-import.yaml');

describe('meta import path validation', () => {
  let tempDir;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'meta-import-'));
  });

  it('blocks attempts to write outside of the working directory', () => {
    const sourceFileName = path.join(tempDir, 'malicious.yaml');
    fs.copyFileSync(maliciousFixture, sourceFileName);

    const parserMock = {
      files: {},
      context: {},
      parse(data) {
        this.files = data.files;
        this.context = data.context;
      }
    };

    expect(() => importManifest(sourceFileName, {baseDir: tempDir, parserModule: parserMock}))
      .toThrow(/Unsafe file path/);

    expect(fs.existsSync(path.join(tempDir, 'manifest.yaml'))).toBe(false);
    expect(fs.existsSync(path.join(tempDir, '../evil.txt'))).toBe(false);
  });
});
