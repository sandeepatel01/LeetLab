import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useExecutionStore = create((set) => ({
      isExecuting: false,
      submission: null,

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

                  const token = localStorage.getItem("token"); // 👈 if you're using token-based auth

                  const res = await axiosInstance.post("/execute-code", payload, {
                        headers: {
                              Authorization: `Bearer ${token}`, // 👈 optional based on your auth system
                        },
                  });

                  const { message, submission } = res.data;

                  set({ submission });
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