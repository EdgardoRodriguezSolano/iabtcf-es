import {IntEncoder} from './IntEncoder';
import {SpecificEncoder} from './SpecificEncoder';
import {EncodingError} from '../../errors/EncodingError';

class LangEncoder implements SpecificEncoder {

  public encode(value: string, numBits: number): string {

    value = value.toUpperCase();
    const intEncoder: IntEncoder = new IntEncoder();

    const ASCII_START = 65;
    const firstLetter: number = value.charCodeAt(0) - ASCII_START;

    const secondLetter: number = value.charCodeAt(1) - ASCII_START;

    // check some things to throw some good errors
    if (firstLetter < 0 || firstLetter > 25 || secondLetter < 0 || secondLetter > 25) {

      throw new EncodingError(`invalid language code: ${value}`);

    }
    if (numBits % 2 === 1) {

      throw new EncodingError(`numBits must be even, ${numBits} is not valid`);

    }

    numBits = numBits/2;
    const firstLetterBString: string = intEncoder.encode(firstLetter, numBits);
    const secondLetterBString: string = intEncoder.encode(secondLetter, numBits);

    return firstLetterBString + secondLetterBString;

  }

}
export {LangEncoder};
