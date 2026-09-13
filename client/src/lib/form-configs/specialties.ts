import type { Specialty } from "./types"

export const specialties: Specialty[] = [
  {
    id: "emergency-medicine",
    name: "Emergency Medicine",
    description: "Emergency department assessment and triage",
    form: {
      specialty: "Emergency Medicine",
      sections: [
        {
          id: 1,
          title: "Triage Assessment",
          fields: [
            {
              id: "chiefComplaint",
              label: "Chief Complaint",
              type: "textarea",
              placeholder: "Primary reason for visit",
              required: true,
            },
            {
              id: "triageCategory",
              label: "Triage Category",
              type: "select",
              required: true,
              options: [
                { label: "Category 1 - Immediate", value: "cat1" },
                { label: "Category 2 - Very Urgent", value: "cat2" },
                { label: "Category 3 - Urgent", value: "cat3" },
                { label: "Category 4 - Less Urgent", value: "cat4" },
                { label: "Category 5 - Non-Urgent", value: "cat5" },
              ],
            },
            {
              id: "painScore",
              label: "Pain Score (0-10)",
              type: "slider",
              min: 0,
              max: 10,
              step: 1,
            },
          ],
        },
        {
          id: 2,
          title: "Vital Signs",
          fields: [
            {
              id: "heartRate",
              label: "Heart Rate (bpm)",
              type: "number",
              placeholder: "Enter heart rate",
            },
            {
              id: "bloodPressureSystolic",
              label: "BP Systolic (mmHg)",
              type: "number",
              placeholder: "Systolic pressure",
            },
            {
              id: "bloodPressureDiastolic",
              label: "BP Diastolic (mmHg)",
              type: "number",
              placeholder: "Diastolic pressure",
            },
            {
              id: "temperature",
              label: "Temperature (°C)",
              type: "number",
              step: 0.1,
              placeholder: "Body temperature",
            },
            {
              id: "oxygenSaturation",
              label: "SpO₂ (%)",
              type: "number",
              placeholder: "Oxygen saturation",
            },
          ],
        },
      ],
    },
  },
  {
    id: "cardiology",
    name: "Cardiology",
    description: "Cardiovascular assessment and management",
    form: {
      specialty: "Cardiology",
      sections: [
        {
          id: 1,
          title: "Cardiovascular History",
          fields: [
            {
              id: "chestPain",
              label: "Chest Pain",
              type: "radio",
              options: [
                { label: "Yes", value: "yes" },
                { label: "No", value: "no" },
              ],
            },
            {
              id: "chestPainCharacter",
              label: "Chest Pain Character",
              type: "checkbox",
              options: [
                { label: "Crushing", value: "crushing" },
                { label: "Stabbing", value: "stabbing" },
                { label: "Burning", value: "burning" },
                { label: "Pressure-like", value: "pressure" },
              ],
            },
            {
              id: "riskFactors",
              label: "Cardiovascular Risk Factors",
              type: "checkbox",
              options: [
                { label: "Hypertension", value: "hypertension" },
                { label: "Diabetes", value: "diabetes" },
                { label: "Smoking", value: "smoking" },
                { label: "Family History", value: "family_history" },
                { label: "High Cholesterol", value: "high_cholesterol" },
              ],
            },
          ],
        },
        {
          id: 2,
          title: "Cardiac Assessment",
          fields: [
            {
              id: "ecgFindings",
              label: "ECG Findings",
              type: "textarea",
              placeholder: "Describe ECG findings",
            },
            {
              id: "heartSounds",
              label: "Heart Sounds",
              type: "select",
              options: [
                { label: "Normal S1, S2", value: "normal" },
                { label: "S3 Gallop", value: "s3" },
                { label: "S4 Gallop", value: "s4" },
                { label: "Murmur Present", value: "murmur" },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    id: "pediatrics",
    name: "Pediatrics",
    description: "Pediatric assessment and care",
    form: {
      specialty: "Pediatrics",
      sections: [
        {
          id: 1,
          title: "Developmental Assessment",
          fields: [
            {
              id: "developmentalMilestones",
              label: "Developmental Milestones",
              type: "checkbox",
              options: [
                { label: "Age-appropriate speech", value: "speech" },
                { label: "Motor skills normal", value: "motor" },
                { label: "Social interaction normal", value: "social" },
                { label: "Cognitive development normal", value: "cognitive" },
              ],
            },
            {
              id: "vaccinationStatus",
              label: "Vaccination Status",
              type: "select",
              options: [
                { label: "Up to date", value: "current" },
                { label: "Behind schedule", value: "behind" },
                { label: "Unknown", value: "unknown" },
              ],
            },
          ],
        },
        {
          id: 2,
          title: "Pediatric Vital Signs",
          fields: [
            {
              id: "heartRate",
              label: "Heart Rate (bpm)",
              type: "number",
              description: "Age-appropriate ranges vary",
            },
            {
              id: "respiratoryRate",
              label: "Respiratory Rate (/min)",
              type: "number",
            },
            {
              id: "temperature",
              label: "Temperature (°C)",
              type: "number",
              step: 0.1,
            },
          ],
        },
      ],
    },
  },
  {
    id: "orthopedics",
    name: "Orthopedics",
    description: "Musculoskeletal assessment and treatment",
    form: {
      specialty: "Orthopedics",
      sections: [
        {
          id: 1,
          title: "Injury Assessment",
          fields: [
            {
              id: "injuryLocation",
              label: "Injury Location",
              type: "select",
              required: true,
              options: [
                { label: "Upper Extremity", value: "upper" },
                { label: "Lower Extremity", value: "lower" },
                { label: "Spine", value: "spine" },
                { label: "Pelvis", value: "pelvis" },
              ],
            },
            {
              id: "mechanismOfInjury",
              label: "Mechanism of Injury",
              type: "textarea",
              placeholder: "Describe how the injury occurred",
            },
            {
              id: "painLevel",
              label: "Pain Level (0-10)",
              type: "slider",
              min: 0,
              max: 10,
              step: 1,
            },
            {
              id: "symptoms",
              label: "Symptoms",
              type: "checkbox",
              options: [
                { label: "Pain", value: "pain" },
                { label: "Swelling", value: "swelling" },
                { label: "Numbness", value: "numbness" },
                { label: "Weakness", value: "weakness" },
                { label: "Deformity", value: "deformity" },
              ],
            },
          ],
        },
        {
          id: 2,
          title: "Physical Examination",
          fields: [
            {
              id: "rangeOfMotion",
              label: "Range of Motion",
              type: "select",
              options: [
                { label: "Full", value: "full" },
                { label: "Limited", value: "limited" },
                { label: "Severely restricted", value: "restricted" },
              ],
            },
            {
              id: "stability",
              label: "Joint Stability",
              type: "radio",
              options: [
                { label: "Stable", value: "stable" },
                { label: "Unstable", value: "unstable" },
              ],
            },
          ],
        },
      ],
    },
  },
]
