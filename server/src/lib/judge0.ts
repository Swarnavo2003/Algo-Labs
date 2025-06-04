import axios from "axios";

export interface Judge0Submission {
  source_code: string;
  language_id: number;
  stdin: string;
  expected_output?: string;
}

export interface Judge0SubmissionResult {
  token: string;
}

export const getJudge0LanguageId = (language: string): number | undefined => {
  const languageMap: Record<string, number> = {
    PYTHON: 71,
    JAVA: 62,
    JAVASCRIPT: 63,
  };
  return languageMap[language.toUpperCase()];
};

export const submitBatch = async (
  submissions: Judge0Submission[],
): Promise<Judge0SubmissionResult[]> => {
  const { data } = await axios.post(
    `${process.env.JUDGE0_API_URI}/submissions/batch?base64_encoded=false`,
    { submissions },
  );

  return data; // [{token},{token},{token}]
};

const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const pollBatchResults = async (tokens: string[]): Promise<any[]> => {
  while (true) {
    const { data } = await axios.get(
      `${process.env.JUDGE0_API_URI}/submissions/batch`,
      {
        params: {
          tokens: tokens.join(","),
          base64_encoded: false,
        },
      },
    );

    const result = data.submissions;

    if (!result) throw new Error("No result for the given tokens");

    const isAllCompleted = result.every(
      (submission: any) =>
        submission.status.id !== 1 && submission.status.id !== 2,
    );

    if (isAllCompleted) return result;

    await sleep(5000); // Wait for 5 second before polling again
  }
};

export const getLanguageName = (languageId: number): string => {
  const LANGUAGE_NAME: Record<number, string> = {
    71: "PYTHON",
    62: "JAVA",
    63: "JAVASCRIPT",
  };

  return LANGUAGE_NAME[languageId] || "UNKNOWN";
};
