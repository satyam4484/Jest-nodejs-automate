module.exports = {
    rules: {
        'type-enum': [2, 'always', ['feat', 'deploy', 'test', 'merge', 'custom']],
        'subject-empty': [2, 'never'], // subject cannot be empty
        'type-empty': [2, 'never'],    // type cannot be empty
    },
};
