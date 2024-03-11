import { randomInt } from 'crypto';

// Génération d'un mot de passe aléatoire entre 8 et 12 caractères
export default function generateRandomPassword() {
	// Longueur aléatoire entre 8 et 12 caractères
	const stringLength = randomInt(8, 13);
	const charset =
		'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	let randomPassword = '';

	// Génération d'une chaîne de caractères composée de lettres
	for (let i = 0; i < stringLength; i++) {
		const randomIndex = randomInt(0, charset.length);
		randomPassword += charset.charAt(randomIndex);
	}

	// Remplacement d'un des caractères par un caractère spécial
	const specialChar = '!@#$%^&*()-_=+';
	const randomIndex = randomInt(0, stringLength);
	randomPassword += specialChar.charAt(randomIndex);

	return randomPassword;
}
