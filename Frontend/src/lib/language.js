function getLanguageName(languageId) {
      const LANGUAGE_NAMES = {
            54: "C++",
            62: "Java",
            63: "JavaScript",
            71: "Python",
      };
      return LANGUAGE_NAMES[languageId] || "Unknown";
}

export { getLanguageName };


export function getLanguageId(language) {
      const languageMap = {
            "C++": 54,
            "JAVA": 62,
            "JAVASCRIPT": 63,
            "PYTHON": 71
      };
      return languageMap[language.toUpperCase()];
}