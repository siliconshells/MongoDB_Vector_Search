// mongosh script: creates DB + inserts 100 docs with root standardCode/standardTitle
use health_reg_test;

db.facility_requirements.drop();

const standards = [
  { standardCode: "42 CFR 482.23", standardTitle: "Nursing Services" },              // hospitals: nursing services  [oai_citation:1‡eCFR](https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-G/part-482/subpart-C/section-482.23?utm_source=chatgpt.com)
  { standardCode: "42 CFR 482.41", standardTitle: "Physical Environment" },           // hospitals: physical environment  [oai_citation:2‡Legal Information Institute](https://www.law.cornell.edu/cfr/text/42/482.41?utm_source=chatgpt.com)
  { standardCode: "45 CFR 164.308", standardTitle: "HIPAA Administrative Safeguards" },// HIPAA security safeguards  [oai_citation:3‡eCFR](https://www.ecfr.gov/current/title-45/subtitle-A/subchapter-C/part-164/subpart-C/section-164.308?utm_source=chatgpt.com)
  { standardCode: "29 CFR 1910.1030", standardTitle: "Bloodborne Pathogens" }         // OSHA bloodborne pathogens  [oai_citation:4‡OSHA](https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.1030?utm_source=chatgpt.com)
];

// Short phrases ONLY (<=10 words each)
const reqPools = {
  "42 CFR 482.23": [
    "RN coverage available at all times.",
    "Verify nursing licenses are current.",
    "Document nursing supervision and staffing plan.",
    "Maintain patient care assignments each shift.",
    "Update nursing policies and procedures annually.",
    "Ensure adequate nurse-to-patient ratios for acuity.",
    "Record nursing handoff communications reliably.",
    "Maintain competency checkoffs for critical skills."
  ],
  "42 CFR 482.41": [
    "Keep exits unobstructed and clearly marked.",
    "Test emergency lighting and power regularly.",
    "Maintain fire safety and evacuation readiness.",
    "Inspect HVAC for safe ventilation performance.",
    "Store oxygen cylinders securely, upright, and labeled.",
    "Control access to mechanical and electrical rooms.",
    "Maintain clean, safe patient environment daily.",
    "Document safety rounds and corrective actions."
  ],
  "45 CFR 164.308": [
    "Train workforce on security awareness annually.",
    "Restrict ePHI access to authorized users only.",
    "Review access privileges and revoke promptly.",
    "Maintain risk analysis and mitigation plan.",
    "Document incident response and breach procedures.",
    "Enforce strong passwords and account management.",
    "Log system access to electronic records.",
    "Maintain policies for secure workstation use."
  ],
  "29 CFR 1910.1030": [
    "Use universal precautions with all blood exposure.",
    "Maintain exposure control plan and update annually.",
    "Provide Hepatitis B vaccination for exposed staff.",
    "Use sharps containers near point of use.",
    "Train staff on bloodborne hazards annually.",
    "Use gloves, gowns, and eye protection as needed.",
    "Label regulated waste containers properly.",
    "Document needlestick incidents and follow-up care."
  ]
};

const docs = [];
for (let i = 1; i <= 100; i++) {
  const std = standards[(i - 1) % standards.length];
  const pool = reqPools[std.standardCode];

  // deterministic “variation” using modulo
  const r1 = pool[(i * 3) % pool.length];
  const r2 = pool[(Math.floor(Math.random() * pool.length))];

  docs.push({
    _id: `doc${i}`,
    standardCode: std.standardCode,
    standardTitle: std.standardTitle,
    main_requirement: r2,
    requirements: [
      { text: r1 },
      // { text: r2 }
    ]
  });
}

db.facility_requirements.insertMany(docs);

print("Inserted:", db.facility_requirements.countDocuments(), "documents");
print("Sample:", JSON.stringify(db.facility_requirements.findOne({ _id: "doc1" }), null, 2));