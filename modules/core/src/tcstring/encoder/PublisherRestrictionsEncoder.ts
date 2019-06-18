import {SpecificEncoder} from './SpecificEncoder';
import {BitLength} from '../../model/BitLength';
import {Vector} from '../../model/Vector';
import {VendorVectorEncoder} from './VendorVectorEncoder';
import {PurposeRestriction} from '../../model/PurposeRestriction';

export class PublisherRestrictionsEncoder extends VendorVectorEncoder implements SpecificEncoder {

  private vector: Vector<PurposeRestriction>;

  public encode(vector: Vector<PurposeRestriction>): string {

    this.vector = vector;

    return super.encode(vector);

  }

  /**
   * TODO: this can not inherit from VendorVectorEncoder becuase ranges would
   * be both no gaps in IDs and the same purposeId and restriction type are
   * assigned together.
   *
   * @return {string} encoded bit string for the ranges
   */
  protected buildRangeEncoding(): string {

    const numEntries = this.ranges.length;

    // Number of entries
    let rangeString = this.intEncoder.encode(numEntries, BitLength.rangeEncodingNumEntries);


    this.ranges.forEach((range: number[]): void => {

      const single = (range.length === 1);
      let thisRange = '';

      // first is the indicator of whether this is a single id or range (two)
      // 0 is single and range is 1
      thisRange += this.boolEnc.encode(!single);

      // second is the first (or only) vendorId
      thisRange += this.intEncoder.encode(range[0], BitLength.vendorId);

      if (!single) {

        thisRange += this.intEncoder.encode(range[1], BitLength.vendorId);

      }

      const pr: PurposeRestriction = this.vector.get(range[0]) as PurposeRestriction;

      thisRange += this.intEncoder.encode(pr.purposeId, BitLength.purposeRestrictionId);
      thisRange += this.intEncoder.encode(pr.restrictionType, BitLength.purposeRestrictionType);

      if (pr.isValid()) {

        rangeString += thisRange;

      }

    });

    return rangeString;

  }

  protected get useRange(): boolean {

    return true;

  }

}
