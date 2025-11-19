import { faker } from '@faker-js/faker';

/**
 * Utility class for generating random test data for Salesforce Transaction Liability Claims domain.
 */
export class RandomDataGenerator {
  /**
   * Generate a random claim number (e.g., CLM-20250704-XXXX)
   */
  static randomclaimNumber(): string {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    return `CLM-${date}-${faker.number.int({ min: 1000, max: 9999 })}`;
  }

  /**
   * Generate a random policy number
   */
  static randompolicyNumber(): string {
    return `POL-${faker.string.alphanumeric({ length: 8, casing: 'upper' })}`;
  }

  /**
   * Generate a random insured name
   */
  static randominsuredName(): string {
    return faker.company.name();
  }

  /**
   * Generate a random claimant name
   */
  static randomclaimantName(): string {
    return faker.person.fullName();
  }

  /**
   * Generate a random loss date (within last 5 years)
   */
  static randomlossDate(): string {
    return faker.date.past({ years: 5}).toISOString().slice(0, 10);
  }

  /**
   * Generate a random claim amount
   */
  static randomclaimAmount(): number {
    // Generate a float with 2 decimal places
    return faker.number.float({ min: 1000, max: 100000, fractionDigits: 2 });
  }

  /**
   * Generate a random address
   */
  static randomaddress(): string {
    return faker.location.streetAddress();
  }

  /**
   * Generate a random phone number
   */
  static randomphoneNumber(): string {
    return faker.phone.number();
  }

  /**
   * Generate a random email address
   */
  static randomemail(): string {
    return faker.internet.email();
  }

  /**
   * Generate a random description of loss
   */
  static randomlossDescription(): string {
    return faker.lorem.sentence();
  }

  /**
  * Generate a random three-letter string (e.g., "xjd")
  */
  static randomThreeLetterWord(): string {
     return faker.string.alpha({length: 3}).toLowerCase();
  }

  /**
  * Generate a random opportunity name
  */
  static randomOpportunityName(): string {
    const randomPart = faker.string.alpha({ length: 5 }).toLowerCase();
    return `auto ${randomPart}`;
  }

  /**
  * Get date after one year in MM/DD/YYYY format
  */
  static randomcloseDate() :string {
    const date = new Date();
    date.setDate(date.getDate() + 365);

    const mm = String(date.getMonth() + 1).padStart(2, '0'); // months are 0-based
    const dd = String(date.getDate()).padStart(2, '0');
    const yyyy = date.getFullYear();

    return `${mm}/${dd}/${yyyy}`;
    
  }

  /**
  * Get today's date in MM/DD/YYYY format
  */
  static todayDate(): string {
    const date = new Date();

    const mm = String(date.getMonth() + 1).padStart(2, '0'); // months are 0-based
    const dd = String(date.getDate()).padStart(2, '0');
    const yyyy = date.getFullYear();

    return `${mm}/${dd}/${yyyy}`;
  }

   /**
  * Generate a random String with given prefix and length of random part
  * @param prefix The prefix for the generated string
  * @param len Length of the random part to be appended to the prefix
  * @returns A string in the format `${prefix}${randomPart}`
  */
  static randomString(prefix: string, len: number): string {
    const randomPart = faker.string.alpha({ length: len }).toLowerCase();
    return `${prefix}${randomPart}`;
  }

  static randomStringWithRange(prefix: string, startLen: number, endLen: number): string {
    // Ensure valid range
    if (startLen > endLen) {
      throw new Error("startLen must be less than or equal to endLen");
    }

    // Random length between startLen and endLen
    const randomLength = faker.number.int({ min: startLen, max: endLen });

    // Generate the random alphabetic part
    const randomPart = faker.string.alpha({ length: randomLength }).toLowerCase();

    // Return prefix + random string
    return `${prefix}${randomPart}`;
  }

    static getDateYearsFromNow(years: number): string {
    const date = new Date();
    date.setFullYear(date.getFullYear() + years);
 
    const mm = String(date.getMonth() + 1).padStart(2, '0'); // months are 0-based
    const dd = String(date.getDate()).padStart(2, '0');
    const yyyy = date.getFullYear();
 
    return `${mm}/${dd}/${yyyy}`;
  }

  
  static randomNumber(len: number): string {
    if (len <= 0) return "";

    // First digit: 1–9 (ensures no leading zero)
    const firstDigit = faker.number.int({ min: 1, max: 9 }).toString();

    // Remaining digits: can include 0–9
    const remainingDigits = faker.string.numeric({ length: len - 1 });

    return `${firstDigit}${remainingDigits}`;
  }
}
