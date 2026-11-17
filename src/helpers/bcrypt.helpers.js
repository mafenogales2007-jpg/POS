import crypto from 'node:crypto';

/**
 * Encripta una contraseña en texto plano utilizando un Salt seguro y PBKDF2 (100.000 iteraciones SHA-512)
 * Cumple con RNF-02 sin dependencias externas.
 * 
 * @param {string} password - Contraseña en texto claro
 * @returns {string} - Hash seguro con formato "salt:hash"
 */
export const hashPassword = (password) => {
  if (!password) {
    throw new Error('La contraseña a encriptar no puede estar vacía');
  }
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
};

/**
 * Compara una contraseña en texto claro contra el hash almacenado en la base de datos
 * 
 * @param {string} password - Contraseña ingresada por el usuario
 * @param {string} storedHash - Hash guardado en MongoDB
 * @returns {boolean} - true si coincide, false si no coincide
 */
export const comparePassword = (password, storedHash) => {
  if (!password || !storedHash || !storedHash.includes(':')) {
    return false;
  }
  const [salt, originalHash] = storedHash.split(':');
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(originalHash, 'hex'));
};

export default {
  hashPassword,
  comparePassword
};
