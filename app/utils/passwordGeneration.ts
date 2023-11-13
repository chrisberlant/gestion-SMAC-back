import { randomInt } from 'crypto';

const generateRandomPassword = () => {
	const charset =
		'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+';
	let password = '';

	for (let i = 0; i < 10; i++) {
		const randomIndex = randomInt(0, charset.length);
		password += charset.charAt(randomIndex);
	}

	return password;
};

export default generateRandomPassword;
