const config = {
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3000,
    jwtSecret: process.env.JWT_SECRET || 'Secret key',
    mongoLink: () => {
        return process.env.ENV === 'Test'
          ? 'mongodb://localhost/user-auth-mern-test'
          : 'mongodb://localhost/user-auth-mern';
    }
};

module.exports = config;
