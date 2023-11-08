import bcryptjs from 'bcryptjs';

const encrypt = async (textPlain) => {
    const hash = bcryptjs.hash(textPlain, 8);
    return hash;
}

const compare = async (passwordPlain, hashPassword) => {
    return await bcryptjs.compare(passwordPlain, hashPassword);
}

module.exports = {
    encrypt,
    compare
}