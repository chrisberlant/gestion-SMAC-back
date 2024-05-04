import generateRandomPassword from '@/utils/passwordGeneration';
import { passwordRegex } from '@/validationSchemas/userSchemas';
import { expect } from 'chai';

describe('Random password generation', () => {
	it('should generate a random password according to defined regular expression', () => {
		const generatedPassword = generateRandomPassword();
		expect(generatedPassword).match(passwordRegex);
		const generatedPassword2 = generateRandomPassword();
		expect(generatedPassword2).match(passwordRegex);
		const generatedPassword3 = generateRandomPassword();
		expect(generatedPassword3).match(passwordRegex);
	});
});
