import { randomInt } from 'crypto';

// Génération d'un mot de passe aléatoire entre 8 et 12 caractères
export default function generateRandomPassword() {
	// Longueur aléatoire entre 8 et 12 caractères
	const stringLength = randomInt(8, 13);
	const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
	const numbers = '0123456789';
	const specialChars = '!@#$%^&*()-_=+';
	let randomPassword = '';

	// Génération d'une chaîne de caractères composée de lettres
	for (let i = 0; i < stringLength; i++) {
		const randomIndex = randomInt(0, letters.length);
		randomPassword += letters.charAt(randomIndex);
	}

	// Ajout d'un nombre
	const randomNumberIndex = randomInt(0, stringLength);
	randomPassword += numbers.charAt(randomNumberIndex);

	// Ajout d'un caractère spécial
	const randomSpecialIndex = randomInt(0, stringLength);
	randomPassword += specialChars.charAt(randomSpecialIndex);

	return randomPassword;
}
