export const TestDataForTemplates = {
  "NBIL Request- No NDA": {
    staticTexts: [
      "ALL INFORMATION CONTAINED HEREIN AND ATTACHED HERETO IS CONFIDENTIAL",
      "PLEASE INDICATE YOUR ABILITY TO PROVIDE TERMS",
      "Deal Overview",
      "Insurance Requirements"
    ],
    fields: {
      "Project Name:": { type: "exact" }, // must match input
      "Insurance Type:": { type: "exact" },
      "Proposed Insured/Buyer:": { type: "exact" },
      "Lead Investor:": { type: "exact" },
      "Target:": { type: "exact" },
      "Description of Target Business:": { type: "exact" },
      "Enterprise Value:": { type: "exact" },
      "Byuyer's Counsel:": { type: "exact" },
      "Seller's Counsel:": { type: "exact" },
      "Purchase Agreement:": { type: "exact" },
      "Seller Indemnity": { type: "exact" },
      "limitRequested": { type: "exact" },
      "Policy Retention Requested:": { type: "exact" },
      "Requested Coverage:": { type: "exact" },
      "Underwriting Information:": { type: "exact" },
      "Policy Period:": { type: "exact" },
    }
  },
  "Joint NDA and NBIL Request": {
    staticTexts: [
      "HIGHLY CONFIDENTIAL",
      " THIS INFORMATION IS SUBJECT TO THE TERMS OF THE ATTACHED CONFIDENTIALITY AGREEMENT",
      "PLEASE INDICATE YOUR ABILITY TO PROVIDE TERMS",
      "Deal Overview",
      "Insurance Requirements"
    ],
    fields: {
      // "Project Name:": { type: "exact" }, // must match input
      //"Insurance Type:": { type: "exact" },
       "Proposed Insured/Buyer:": { type: "exact" },
       "Lead Investor:": { type: "exact" },
       "Policy Period:": { type: "exact" },
      // "Target:": { type: "exact" },
      //"Description of Target Business:": { type: "exact" },
      // "Enterprise Value:": { type: "exact" },
      // "Seller Indemnity" : {type :"exact"}
    }
  },
  "NBIL Request- Pre-Cleared NDA": {
    staticTexts: [
      "HIGHLY CONFIDENTIAL",
      " THIS INFORMATION IS SUBJECT TO THE TERMS OF THE CONFIDENTIALITY AGREEMENT PREVIOUSLY SIGNED",
      "PLEASE INDICATE YOUR ABILITY TO PROVIDE TERMS",
      "Deal Overview",
      "Insurance Requirements"
    ],
    fields: {
      // "Project Name:": { type: "exact" }, // must match input
      //"Insurance Type:": { type: "exact" },
      "Proposed Insured/Buyer:": { type: "exact" },
      "Lead Investor:": { type: "exact" },
      "Policy Period:": { type: "exact" },
      // "Target:": { type: "exact" },
      //"Description of Target Business:": { type: "exact" },
      // "Enterprise Value:": { type: "exact" },
      // "Seller Indemnity" : {type :"exact"}
    }
  },
};
 