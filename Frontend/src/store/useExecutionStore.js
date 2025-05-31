import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useExecutionStore = create((set) => ({
      isExecuting: false,
      submission: null,
      submissionTimestamp: null,

      executeCode: async (source_code, language_id, stdin, expected_outputs, problemId) => {
            try {
                  set({ isExecuting: true });

                  const payload = {
                        source_code,
                        language_id,
                        stdin,
                        expected_outputs,
                        problemId,
                  };

                  console.log("🚀 Sending submission payload:", payload);

                  const token = localStorage.getItem("token");

                  const res = await axiosInstance.post("/execute-code", payload, {
                        headers: {
                              Authorization: `Bearer ${token}`,
                        },
                  });

                  console.log("🚀 API response:", res.data);

                  const { message, submission } = res.data.data;

                  const testcasesRaw = submission?.testcases || [];

                  const testCases = testcasesRaw.map((tc, index) => ({
                        id: index + 1,
                        passed: tc.passed,
                        expected: tc.expected,
                        stdout: tc.stdout,
                        memory: tc.memory,
                        time: tc.time,
                  }));

                  const memoryArr = testCases.map((tc) => tc.memory);
                  const timeArr = testCases.map((tc) => tc.time);

                  set({
                        submission: {
                              status: submission.status,
                              sourceCode: source_code,
                              testCases,
                              memory: JSON.stringify(memoryArr),
                              time: JSON.stringify(timeArr),
                        },
                        submissionTimestamp: Date.now(),
                  });

                  toast.success(message || "Code executed successfully!");
            } catch (error) {
                  console.error("❌ Error executing code:", error?.response?.data || error.message);
                  toast.error(error?.response?.data?.message || "Failed to execute code.");
            } finally {
                  set({ isExecuting: false });
            }
      },
}));


// import { create } from "zustand";
// import { axiosInstance } from "../lib/axios";
// import toast from "react-hot-toast";



// export const useExecutionStore = create((set) => ({
//       isExecuting: false,
//       submission: null,

//       executeCode: async (source_code, language_id, stdin, expected_outputs, problemId) => {
//             try {
//                   set({ isExecuting: true });
//                   console.log("Submission:", JSON.stringify({
//                         source_code,
//                         language_id,
//                         stdin,
//                         expected_outputs,
//                         problemId
//                   }));
//                   const res = await axiosInstance.post("/execute-code", { source_code, language_id, stdin, expected_outputs, problemId });

//                   set({ submission: res.data.submission });

//                   toast.success(res.data.message);
//             } catch (error) {
//                   console.log("Error executing code", error);
//                   toast.error("Error executing code");
//             }
//             finally {
//                   set({ isExecuting: false });
//             }
//       }
// }))