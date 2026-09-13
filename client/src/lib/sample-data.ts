import type { PatientForm } from "@/lib/form-configs/types"
import type { CustomFormRecord } from "@/lib/types"
import type { PersonalInfo } from "@/lib/assessment"

/**
 * Realistic-but-fictional clinical sample data so the app can be exercised
 * without medical knowledge. Shown in development, or in production when
 * VITE_SAMPLE_DATA=true. Both values are inlined at build time.
 */
export const SAMPLE_DATA_ENABLED =
  import.meta.env.DEV || import.meta.env.VITE_SAMPLE_DATA === "true"

export const pick = <T,>(items: readonly T[]): T => items[Math.floor(Math.random() * items.length)]

/* ---------- Patient identifiers ---------- */

const NAMES = ["Amina Rahman", "Daniel Okafor", "Priya Nair", "Tom Ashcroft", "Leila Haddad", "Marcus Webb", "Sofia Ruiz"]

export const samplePatient = (): Pick<PersonalInfo, "fullName" | "age" | "gender"> => ({
  fullName: pick(NAMES),
  age: String(18 + Math.floor(Math.random() * 65)),
  gender: pick(["female", "male"]),
})

/* ---------- Free text notes ---------- */

export const SAMPLE_NOTES: readonly string[] = [
  `58-year-old male presenting with central crushing chest pain for the last 90 minutes, radiating to the left arm and jaw, associated with diaphoresis and nausea. Pain 8/10, not relieved by rest. Known hypertension and type 2 diabetes, current smoker (20/day for 30 years). Obs: BP 162/94, HR 102 regular, RR 20, SpO₂ 95% on air, temp 36.9°C. Chest clear, heart sounds normal, no peripheral oedema. ECG shows 2 mm ST elevation in leads II, III and aVF. Aspirin 300 mg given pre-hospital.`,
  `34-year-old female with 3 days of worsening right iliac fossa pain, initially periumbilical. Anorexia, two episodes of vomiting, no diarrhoea. LMP 2 weeks ago, no vaginal bleeding. Obs: temp 38.1°C, HR 98, BP 118/76, RR 18, SpO₂ 98%. Examination: tender RIF with guarding and rebound, Rovsing's sign positive. Urine dip negative for blood and nitrites, pregnancy test negative. WCC 14.2, CRP 68.`,
  `72-year-old female brought in by ambulance after a fall at home, unwitnessed, found on the floor by her daughter after an estimated 2 hours. Complains of right hip pain and is unable to weight-bear. Right leg shortened and externally rotated. No head injury, no loss of consciousness reported. PMH: osteoporosis, atrial fibrillation on apixaban, hypertension. Obs stable: BP 134/82, HR 88 irregular, SpO₂ 96% on air, GCS 15. Analgesia given, fascia iliaca block considered.`,
  `6-year-old boy with 2 days of fever up to 39.2°C, sore throat, and reduced oral intake. No cough or coryza. Mild bilateral cervical lymphadenopathy, tonsils enlarged with exudate, no trismus or drooling. Passing urine normally. Fully vaccinated, no known allergies. Obs: HR 118, RR 24, SpO₂ 98%, CRT < 2 s. Centor score 4.`,
  `45-year-old male with sudden-onset severe headache 4 hours ago while lifting weights, described as "the worst headache of my life", reached maximum intensity within seconds. Associated photophobia and one episode of vomiting. No prior similar headaches, no head trauma. Not on anticoagulants. Obs: BP 156/98, HR 76, temp 37.0°C, GCS 15, no focal neurology, mild neck stiffness. Non-contrast CT head requested.`,
]

/* ---------- Dictation transcripts (spoken style) ---------- */

export const SAMPLE_TRANSCRIPTS: readonly string[] = [
  `Okay so this is a 62 year old gentleman, presented about an hour ago with shortness of breath that's been getting worse over the last three days. He's got a history of heart failure, ejection fraction about 35 percent, and he says he's been sleeping on three pillows and his ankles are swollen. On examination he's got bibasal crackles, raised JVP about four centimetres, and pitting oedema to mid shin. Sats are 91 percent on room air, up to 96 on two litres. Heart rate 96, blood pressure 148 over 90. Chest x-ray shows pulmonary congestion. I'm going to start IV furosemide, get a BNP and a troponin, and refer to the medical team.`,
  `Right, 28 year old woman, known asthmatic, came in with a wheeze that started this morning after a chest infection over the weekend. She's used her salbutamol inhaler about ten times today with not much relief. Speaking in short sentences, respiratory rate 28, sats 93 percent, peak flow 220 which she says is about 45 percent of her best. Widespread expiratory wheeze, no silent chest. Given back-to-back nebulisers and oral prednisolone, she's improving. Plan is to reassess peak flow in an hour and consider discharge with a steroid course if she's above 75 percent.`,
  `This is a 19 year old rugby player with a right shoulder injury from a tackle about two hours ago. Says he felt it pop out. Obvious loss of the normal shoulder contour, arm held in slight abduction and external rotation, he can't move it. Neurovascularly intact distally, regimental badge sensation is present. X-ray confirms anterior dislocation, no fracture. Plan is procedural sedation and reduction, post-reduction films, then a sling and physio referral.`,
]

/* ---------- Specialty forms (keyed by formConfig.specialty) ---------- */

type Values = Record<string, unknown>

const SPECIALTY_SAMPLES: Record<string, readonly Values[]> = {
  "Emergency Medicine": [
    {
      chiefComplaint: "Central chest pain for 2 hours, radiating to the left arm, with sweating and nausea.",
      triageCategory: "cat2",
      painScore: 8,
      heartRate: 102,
      bloodPressureSystolic: 162,
      bloodPressureDiastolic: 94,
      temperature: 36.9,
      oxygenSaturation: 95,
    },
    {
      chiefComplaint: "Fall from a ladder onto the right side, right-sided chest wall pain worse on inspiration.",
      triageCategory: "cat3",
      painScore: 6,
      heartRate: 88,
      bloodPressureSystolic: 128,
      bloodPressureDiastolic: 82,
      temperature: 36.7,
      oxygenSaturation: 97,
    },
  ],
  Cardiology: [
    {
      chestPain: "yes",
      chestPainCharacter: ["crushing", "pressure"],
      riskFactors: ["hypertension", "smoking", "high_cholesterol"],
      ecgFindings: "Sinus tachycardia 102 bpm. 2 mm ST elevation in II, III and aVF with reciprocal depression in I and aVL.",
      heartSounds: "normal",
    },
    {
      chestPain: "no",
      chestPainCharacter: [],
      riskFactors: ["diabetes", "family_history"],
      ecgFindings: "Atrial fibrillation with a ventricular rate of 132 bpm, no acute ST changes, QTc 440 ms.",
      heartSounds: "murmur",
    },
  ],
  Pediatrics: [
    {
      developmentalMilestones: ["speech", "social", "cognitive"],
      vaccinationStatus: "current",
      heartRate: 118,
      respiratoryRate: 24,
      temperature: 39.2,
    },
    {
      developmentalMilestones: ["speech"],
      vaccinationStatus: "behind",
      heartRate: 96,
      respiratoryRate: 30,
      temperature: 37.4,
    },
  ],
  Orthopedics: [
    {
      injuryLocation: "upper",
      mechanismOfInjury: "Fell onto an outstretched right hand while cycling; immediate wrist pain and swelling.",
      painLevel: 7,
      symptoms: ["pain", "swelling", "deformity"],
      rangeOfMotion: "restricted",
      stability: "stable",
    },
    {
      injuryLocation: "lower",
      mechanismOfInjury: "Twisting injury to the left knee during football, heard a pop, unable to continue playing.",
      painLevel: 6,
      symptoms: ["pain", "swelling"],
      rangeOfMotion: "limited",
      stability: "unstable",
    },
  ],
}

/**
 * Sample values for a specialty form. Uses the curated set when one exists,
 * otherwise derives plausible values from the field definitions so custom or
 * future specialties still get something sensible.
 */
export function sampleFormValues(formConfig: PatientForm): Values {
  const curated = SPECIALTY_SAMPLES[formConfig.specialty]
  if (curated) return pick(curated)

  const values: Values = {}
  for (const section of formConfig.sections) {
    for (const field of section.fields) {
      switch (field.type) {
        case "number":
          values[field.id] = Math.round(((field.min ?? 0) + (field.max ?? 100)) / 2)
          break
        case "slider":
          values[field.id] = Math.round(((field.min ?? 0) + (field.max ?? 10)) / 2)
          break
        case "checkbox":
          values[field.id] = (field.options ?? []).slice(0, 2).map((o) => o.value)
          break
        case "select":
        case "radio":
          values[field.id] = field.options?.[0]?.value ?? ""
          break
        case "dateTime":
          values[field.id] = new Date().toISOString().slice(0, 16)
          break
        default:
          values[field.id] = field.placeholder || `Sample ${field.label.toLowerCase()}`
      }
    }
  }
  return values
}

/* ---------- Form builder ---------- */

export const sampleCustomForm = (): Omit<CustomFormRecord, "id"> => ({
  name: "Minor injuries triage",
  description: "Quick intake for walk-in minor injuries before clinician review.",
  fields: [
    { id: "f_mechanism", type: "textarea", label: "How did the injury happen?", placeholder: "Describe the mechanism", required: true },
    { id: "f_site", type: "select", label: "Injury site", options: ["Hand / wrist", "Ankle / foot", "Knee", "Head / face", "Other"], required: true },
    { id: "f_when", type: "date", label: "Date of injury", required: true },
    { id: "f_pain", type: "number", label: "Pain score (0–10)", validation: { min: 0, max: 10 } },
    { id: "f_symptoms", type: "checkbox", label: "Symptoms", options: ["Swelling", "Bruising", "Numbness", "Unable to weight-bear"] },
    { id: "f_tetanus", type: "radio", label: "Tetanus up to date?", options: ["Yes", "No", "Unsure"] },
  ],
})
