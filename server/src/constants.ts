const corsList = [
    process.env.NODE_ENV === 'production'
        ? /^https:\/\/[a-zA-Z0-9-]*\.d2v9syk4m83jg4.ojcompiler.com$/
        : /^http[s]?:\/\/localhost:\d{4}$/,
];

export { corsList };
