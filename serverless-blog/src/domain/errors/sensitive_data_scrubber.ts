import _ from 'underscore';
import deepClone from 'deep-clone';

const BASE_EXCLUSIONS = ['password', 'x-api-key'];

const BASE_PLAINTEXT_EXCLUSIONS = {
  PAN_NUMBER: /(?:\d[ -]*){13,19}/g,
};

function deleteSensitiveDataHelper(exclusions, data, level) {
  if (!_.isObject(data) || _.isFunction(data) || level < 0) {
    return;
  }

  for (const key of Object.keys(data)) {
    if (exclusions.has(key)) {
      data[key] = '*******scrubbed*******';
    } else {
      deleteSensitiveDataHelper(exclusions, data[key], level - 1);
    }
  }
}

function deleteSensitivePatternHelper(plaintextExclusion, data) {
  let cleanData;
  cleanData = data;

  for (const pattern of plaintextExclusion) {
    cleanData = cleanData.replace(pattern, '*******scrubbed*******');
  }

  return cleanData;
}

class SensitiveDataScrubber {
  private exclusions: any;
  private plaintextExclusion: any;

  constructor(additionalExclusions?: any, additionalPlaintextExclusions?: any) {
    let exclusions = BASE_EXCLUSIONS;
    if (_.isArray(additionalExclusions)) {
      exclusions = exclusions.concat(additionalExclusions);
    }

    let plaintextExclusion = [];
    for (const type in BASE_PLAINTEXT_EXCLUSIONS) {
      plaintextExclusion.push(BASE_PLAINTEXT_EXCLUSIONS[type]);
    }

    if (_.isArray(additionalPlaintextExclusions)) {
      plaintextExclusion = plaintextExclusion.concat(additionalPlaintextExclusions);
    }

    this.exclusions = new Set(exclusions);
    this.plaintextExclusion = new Set(plaintextExclusion);
    this.scrub = this.scrub.bind(this);
    this.scrubPlaintext = this.scrubPlaintext.bind(this);
  }

  scrub(data, level = 2) {
    const cleanData = deepClone(data);
    deleteSensitiveDataHelper(this.exclusions, cleanData, level);
    return cleanData;
  }

  scrubPlaintext(data) {
    const cleanData = deleteSensitivePatternHelper(this.plaintextExclusion, data);
    return cleanData;
  }
}

export default SensitiveDataScrubber;
