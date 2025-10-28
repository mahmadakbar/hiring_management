export const jobTypeOptions = [
  { value: "full-time", label: "Full-time" },
  { value: "contract", label: "Contract" },
  { value: "part-time", label: "Part-time" },
  { value: "internship", label: "Internship" },
  { value: "freelance", label: "Freelance" },
];

export const profileInfo = [
  { value: "fullName", label: "Full name", option: ["mandatory"] },
  { value: "photoProfile", label: "Photo Profile", option: ["mandatory"] },
  {
    value: "gender",
    label: "Gender",
    option: ["mandatory", "optional", "off"],
  },
  {
    value: "domicile",
    label: "Domicile",
    option: ["mandatory", "optional", "off"],
  },
  { value: "email", label: "Email", option: ["mandatory"] },
  {
    value: "phoneNumber",
    label: "Phone Number",
    option: ["mandatory", "optional", "off"],
  },
  {
    value: "linkedinLink",
    label: "LinkedIn Link",
    option: ["mandatory", "optional", "off"],
  },
  {
    value: "dateOfBirth",
    label: "Date of Birth",
    option: ["mandatory", "optional", "off"],
  },
];
