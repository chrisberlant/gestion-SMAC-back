import generateRandomPassword from '@/utils/passwordGeneration';
import { passwordRegex } from '@/validationSchemas/userSchemas';
import { expect } from 'chai';

describe('Random password generation', () => {
	it('should generate a random password according to defined regular expression', () => {
		for (let i = 0; i < 10; i++) {
			const generatedPassword = generateRandomPassword();
			expect(generatedPassword).match(passwordRegex);
		}
	});
});
