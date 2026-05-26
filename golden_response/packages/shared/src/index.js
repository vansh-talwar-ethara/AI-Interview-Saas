export const PLAN_LIMITS = {
    free: {
        textInterviewsPerDay: 3,
        voiceEnabled: false,
        companyModes: false,
    },
    pro: {
        textInterviewsPerDay: Infinity,
        voiceEnabled: true,
        companyModes: true,
    },
    enterprise: {
        textInterviewsPerDay: Infinity,
        voiceEnabled: true,
        companyModes: true,
    },
};
export const API_RESPONSE_EXAMPLE = {
    success: true,
    data: null,
    error: null,
};
export * from "./promptTemplates";
