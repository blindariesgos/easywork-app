const logLevelData = {
    "*": process.env.NODE_ENV === "production" ? "silent" : "info",
    "home": "info"
}

export default logLevelData;