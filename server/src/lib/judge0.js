import axios from "axios";

export const getJudge0LanguageId = (language) => {
  const languageMap = {
    PYTHON: 71,
    JAVA: 62,
    JAVASCRIPT: 63,
  };
  return languageMap[language.toUpperCase()];
};

export const submitBatch = async (submissions) => {
  const {data} = await axios.post(
    `${process.env.JUDGE0_API_URI}/submissions/batch?base64_encoded=false`,
    {submissions},
    {headers: {Authorization: `Bearer ${process.env.JUDGE0_API_KEY}`}},
  );

  return data; // [{token},{token},{token}]
};

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const pollBatchResults = async (tokens) => {
  while (true) {
    const {data} = await axios.get(
      `${process.env.JUDGE0_API_URI}/submissions/batch`,
      {
        params: {
          tokens: tokens.join(","),
          base64_encoded: false,
        },
        headers: {Authorization: `Bearer ${process.env.JUDGE0_API_KEY}`},
      },
    );

    const result = data.submissions;

    if (!result) throw new Error("No result for the given tokens");

    const isAllCompleted = result.every(
      (submission) => submission.status.id !== 1 && submission.status.id !== 2,
    );

    if (isAllCompleted) return result;

    await sleep(5000); // Wait for 5 second before polling again
  }
};

export const getLanguageName = (languageId) => {
  const LANGUAGE_NAME = {
    71: "PYTHON",
    62: "JAVA",
    63: "JAVASCRIPT",
  };

  return LANGUAGE_NAME[languageId] || "UNKNOWN";
};
